import { Tokenizer } from './interpreter/tokenizer.js';
import { Parser } from './interpreter/parser.js';
import { Interpreter } from './interpreter/interpreter.js';
import { initializeFileBrowser, getFileContent, saveFileContent } from './interpreter/modules/files.js';
import { definePseudocodeLanguage } from './monaco-lang.js';
import { Theme } from './monaco-theme.js';

const PlayIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

export function initEditor(appContainer) {
  const app = appContainer;
  
  app.innerHTML = `
    <div class="flex flex-col h-screen bg-[#24262B] p-2 text-white">
      <div class="mb-2 flex items-center justify-between mx-2">
        <span class="text-base font-normal">ViPE Pseudocode Editor</span>
        <a href="/docs" class="bg-[#3b3e48] text-white rounded-lg px-2 py-1 cursor-pointer inline-block">Docs</a>
      </div>
      <div class="flex flex-col flex-grow overflow-hidden gap-2">
        <div class="toppanel w-full h-[70%] flex flex-col shadow-md">
          <div class="flex-grow relative overflow-hidden rounded-lg">
            <div id="monaco-editor" class="absolute inset-0 bg-[#181A1F] pt-4"></div>
          </div>
        </div>

        <div class="w-full h-[30%] relative">
          <button
            id="run-button"
            class="absolute top-2 right-2 z-[10] flex items-center gap-2 bg-[#272c36] hover:bg-[#343945] text-white rounded-md p-2 transition-colors cursor-pointer"
            title="Run Code (Ctrl+Enter or Cmd+Enter)"
          >
            ${PlayIcon}
          </button>
          <div id="output" class="w-full h-full overflow-auto p-5 font-mono text-sm bg-[#181A1F] text-[#fff] rounded-lg">
            <div class="text-[#525b6b]">// No output yet. Run your code to see results.</div>
          </div>
        </div>
      </div>

      <!-- Mobile Warning -->
      <div class="p-6 md:hidden fixed inset-0 bg-[#181A1F] z-50 flex items-center justify-center">
        <div class="bg-[#0F0F10] p-6 rounded-lg border border-[#1F1F22] max-w-md">
          <h1 class="text-2xl font-normal text-center mb-3">
            Sorry, but this code editor isn't optimized for small screens.
          </h1>
          <p class="text-[#999999] text-center">Please use a larger device for the best experience.</p>
        </div>
      </div>
    </div>
  `;

  const runButton = document.getElementById('run-button');
  const outputElement = document.getElementById('output');
  
  let currentFile = 'app.pseudo';
  let editor = null;

  initMonacoEditor().then(monacoEditor => {
    editor = monacoEditor;
    
    const initialContent = getFileContent('app.pseudo') || 
      '// Write your pseudocode here\n\n// Example:\nDECLARE name : STRING\nOUTPUT "What is your name?"\nINPUT name\nOUTPUT "Hello, " + name';
    
    editor.setValue(initialContent);
    
    initializeFileBrowser(document.querySelector('.toppanel'), (file) => {
      if (currentFile) {
        saveFileContent(currentFile, editor.getValue());
      }
      
      currentFile = file.name;
      editor.setValue(file.content || getFileContent(file.name));
    });
    
    document.addEventListener('fileSelected', (event) => {
      const file = event.detail;
      
      if (currentFile) {
        saveFileContent(currentFile, editor.getValue());
      }
      
      currentFile = file.name;
      editor.setValue(file.content || getFileContent(file.name));
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, runCode);
  });

  runButton.addEventListener('click', runCode);

  function initMonacoEditor() {
    return new Promise((resolve) => {
      require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' }});
      
      require(['vs/editor/editor.main'], () => {
        definePseudocodeLanguage(monaco);
        monaco.editor.defineTheme('pseudocode-custom-theme', Theme);
        
        const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
          value: '',
          language: 'pseudocode',
          theme: 'pseudocode-custom-theme',
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
          tabSize: 2,
          renderLineHighlight: 'all',
          lineNumbers: 'on',
          lineHeight: 1.6,
          letterSpacing: 0.5,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto'
          },
          lineDecorationsWidth: 5,
          lineNumbersMinChars: 3
        });
        
        resolve(editor);
      });
    });
  }

  function runCode() {
    if (editor && currentFile) {
      saveFileContent(currentFile, editor.getValue());
    }
    
    if (!editor) return;
    
    const code = editor.getValue();
    const interpreter = new BrowserInterpreter();
    
    try {
      outputElement.innerHTML = '';
      
      interpreter.setOutputCallback((message, type = 'output') => {
        const div = document.createElement('div');
        div.className = 'mb-1 whitespace-pre-wrap';
        
        if (type === 'error') {
          div.className += ' text-red-400';
          console.error(message);
        }
        
        div.textContent = message;
        outputElement.appendChild(div);
        outputElement.scrollTop = outputElement.scrollHeight;
      });
      
      const result = interpreter.execute(code);
    } catch (error) {
      if (!error.displayed) {
        console.error(error.message || 'Unknown error occurred');
        interpreter.addError(error.message || 'Unknown error occurred');
      }
    }
  }
}

class BrowserInterpreter {
  constructor() {
    this.tokenizer = null;
    this.parser = null;
    this.interpreter = new Interpreter();
    this.output = [];
    this.errors = [];
    this.outputCallback = null;
  }
  
  reset() {
    this.interpreter.reset();
    this.output = [];
    this.errors = [];
    
    // Re-set the output callback after reset
    if (this.outputCallback) {
      this.interpreter.setOutputCallback(this.outputCallback);
    }
  }
  
  setOutputCallback(callback) {
    this.outputCallback = callback;
    this.interpreter.setOutputCallback(callback);
  }
  
  addOutput(message) {
    this.output.push(message);
    
    // Call the callback if it exists
    if (this.outputCallback && typeof this.outputCallback === 'function') {
      this.outputCallback(message);
    }
    
    return message;
  }
  
  addError(message) {
    this.errors.push(message);
    
    if (this.outputCallback && typeof this.outputCallback === 'function') {
      this.outputCallback(message, 'error');
    }
        
    return message;
  }
  
  execute(code) {
    this.reset();
    
    try {
      this.tokenizer = new Tokenizer(code);
      const tokens = this.tokenizer.tokenize();
      
      this.parser = new Parser(tokens);
      const ast = this.parser.parse();
      
      const result = this.interpreter.interpret(ast);
      
      if (this.interpreter.output) {
        this.output = this.interpreter.output;
      }
      
      return result;
    } catch (error) {
      this.addError(error.message || 'Unknown error occurred');
      return null;
    }
  }
}
