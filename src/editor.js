import { Tokenizer } from './interpreter/tokenizer.js';
import { Parser } from './interpreter/parser.js';
import { Interpreter } from './interpreter/interpreter.js';
import { initializeFileBrowser, getFileContent, saveFileContent } from './interpreter/modules/files.js';

const PlayIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
const AlertCircleIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

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
            <div class="absolute inset-0 flex">
              <div id="line-numbers" class="py-5 px-3 text-right bg-[#181A1F] text-[#555555] select-none font-mono text-sm w-auto min-w-[40px] overflow-hidden whitespace-pre"></div>
              <textarea
                id="code-editor"
                class="flex-grow font-mono text-sm p-5 resize-none border-0 focus:ring-0 focus:outline-none bg-[#181A1F] text-[#fff] transition-colors whitespace-pre overflow-auto"
                placeholder="Write your pseudocode here..."
                spellCheck="false"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="w-full h-[30%] flex flex-row shadow-md gap-2">
          <div class="w-[65%] relative">
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

          <div class="w-[35%] flex flex-col bg-[#181A1F] rounded-lg">
            <div class="flex-grow overflow-hidden">
              <div id="errors" class="h-full overflow-auto p-5 font-mono text-sm">
                <div class="text-[#525b6b]">// No problems detected.</div>
              </div>
            </div>
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

  const codeEditor = document.getElementById('code-editor');
  const lineNumbers = document.getElementById('line-numbers');
  const runButton = document.getElementById('run-button');
  const outputElement = document.getElementById('output');
  const errorsElement = document.getElementById('errors');
  
  let currentFile = 'app.pseudo';

  initializeFileBrowser(document.querySelector('.toppanel'), (file) => {
    if (currentFile) {
      saveFileContent(currentFile, codeEditor.value);
    }
    
    currentFile = file.name;
    codeEditor.value = file.content || getFileContent(file.name);
    updateLineNumbers();
  });
  
  document.addEventListener('fileSelected', (event) => {
    const file = event.detail;
    
    if (currentFile) {
      saveFileContent(currentFile, codeEditor.value);
    }
    
    currentFile = file.name;
    codeEditor.value = file.content || getFileContent(file.name);
    updateLineNumbers();
  });
  
  codeEditor.value = getFileContent('app.pseudo') || '// Write your pseudocode here\n\n// Example:\nDECLARE name : STRING\nOUTPUT "What is your name?"\nINPUT name\nOUTPUT "Hello, " + name';

  updateLineNumbers();

  codeEditor.addEventListener('input', updateLineNumbers);
  codeEditor.addEventListener('scroll', syncScroll);
  codeEditor.addEventListener('keydown', handleKeyDown);
  runButton.addEventListener('click', runCode);

  function handleKeyDown(e) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runCode();
      return;
    }
    
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      
      this.selectionStart = this.selectionEnd = start + 2;
      
      updateLineNumbers();
    }
  }

  function updateLineNumbers() {
    const lines = codeEditor.value.split('\n');
    const count = lines.length;
    let lineNumbersHTML = '';
    
    for (let i = 1; i <= count; i++) {
      lineNumbersHTML += i + '\n';
    }
    
    lineNumbers.textContent = lineNumbersHTML;
  }

  function syncScroll() {
    lineNumbers.scrollTop = codeEditor.scrollTop;
  }

  function runCode() {
    if (currentFile) {
      saveFileContent(currentFile, codeEditor.value);
    }
    
    const code = codeEditor.value;
    const interpreter = new BrowserInterpreter();
    
    try {
      outputElement.innerHTML = '';
      errorsElement.innerHTML = '';
      
      const result = interpreter.execute(code);
      
      if (interpreter.output.length > 0) {
        interpreter.output.forEach(line => {
          const div = document.createElement('div');
          div.className = 'mb-1 whitespace-pre-wrap';
          div.textContent = line;
          outputElement.appendChild(div);
        });
      } else {
        outputElement.innerHTML = '<div class="text-[#525b6b]">// No output generated.</div>';
      }
      
      if (interpreter.errors && interpreter.errors.length > 0) {
        interpreter.errors.forEach(error => {
          const div = document.createElement('div');
          div.className = 'text-red-400 mb-3 flex items-start';
          div.innerHTML = `
            ${AlertCircleIcon}
            <span class="ml-3">${error}</span>
          `;
          errorsElement.appendChild(div);
        });
      } else {
        errorsElement.innerHTML = '<div class="text-[#525b6b]">// No problems detected.</div>';
      }
    } catch (error) {
      errorsElement.innerHTML = `
        <div class="text-red-400 mb-3 flex items-start">
          ${AlertCircleIcon}
          <span class="ml-3">${error.message || 'Unknown error occurred'}</span>
        </div>
      `;
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
  }
  
  reset() {
    this.interpreter.reset();
    this.output = [];
    this.errors = [];
  }
  
  addOutput(message) {
    this.output.push(message);
    return message;
  }
  
  addError(message) {
    this.errors.push(message);
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
