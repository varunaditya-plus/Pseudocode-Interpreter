// todo - add deleting

import * as errors from './errors.js';

const openFiles = {}; // open files and their modes
let projectFiles = []; // project files (persistant)

export const initializeFileBrowser = (container, onFileSelect) => {
  // Create file browser container
  const fileBrowserEl = document.createElement('div');
  fileBrowserEl.className = 'file-browser flex items-center mb-2 gap-2 p-2 bg-[#181A1F] rounded-lg overflow-x-auto whitespace-nowrap';
  container.prepend(fileBrowserEl);
  
  // Load files from localstorage
  loadProjectFiles();
  
  if (!projectFiles.some(file => file.name === 'app.pseudo')) {
    projectFiles.unshift({
      name: 'app.pseudo',
      content: '// Write your pseudocode here\n\n// Example:\nDECLARE name : STRING\nOUTPUT "What is your name?"\nINPUT name\nOUTPUT "Hello, " + name',
      type: 'pseudo'
    });
    saveProjectFiles();
  }
  
  // Render file browser
  renderFileBrowser(fileBrowserEl, onFileSelect);
};

const loadProjectFiles = () => {
  try {
    const savedFiles = localStorage.getItem('projectFiles');
    projectFiles = savedFiles ? JSON.parse(savedFiles) : [];
  } catch (error) {
    console.error('Error loading project files:', error);
    projectFiles = [];
  }
};

const saveProjectFiles = () => {
  try {
    localStorage.setItem('projectFiles', JSON.stringify(projectFiles));
  } catch (error) {
    console.error('Error saving project files:', error);
  }
};

const renderFileBrowser = (container, onFileSelect) => {
  // Clear container
  container.innerHTML = '';
  
  projectFiles.sort((a, b) => {
    if (a.name === 'app.pseudo') return -1;
    if (b.name === 'app.pseudo') return 1;
    return a.name.localeCompare(b.name);
  });
  
  // Add file tabs
  projectFiles.forEach(file => {
    const fileTab = document.createElement('div');
    fileTab.className = 'file-tab px-3 py-1 bg-[#272c36] hover:bg-[#343945] rounded cursor-pointer flex items-center';
    fileTab.innerHTML = `<span>${file.name}</span>`;
    fileTab.addEventListener('click', () => onFileSelect(file));
    container.appendChild(fileTab);
  });
  
  // Add new file btn
  const newFileBtn = document.createElement('button');
  newFileBtn.className = 'new-file-btn h-full px-2 py-1 bg-[#272c36] hover:bg-[#343945] rounded cursor-pointer';
  newFileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  newFileBtn.addEventListener('click', createNewFile);
  container.appendChild(newFileBtn);
};

const createNewFile = () => {
  const fileName = prompt('Enter file name (only .txt files allowed):');
  
  if (!fileName) return; // User cancelled
  
  if (!fileName.endsWith('.txt')) {
    alert('Only .txt files are allowed');
    return;
  }
  
  // Check if file exists
  if (projectFiles.some(file => file.name === fileName)) {
    alert(`File ${fileName} already exists`);
    return;
  }
  
  // Create file
  const newFile = {
    name: fileName,
    content: '',
    type: 'txt'
  };
  
  projectFiles.push(newFile);
  saveProjectFiles();
  
  localStorage.setItem(fileName, '');
  
  // Re-render file browser
  const fileBrowserEl = document.querySelector('.file-browser');
  if (fileBrowserEl) {
    renderFileBrowser(fileBrowserEl, (file) => {
      // Dispatch custom event
      const event = new CustomEvent('fileSelected', { detail: file });
      document.dispatchEvent(event);
    });
  }
};

export const getProjectFiles = () => {
  loadProjectFiles();
  return [...projectFiles];
};

export const getFileContent = (fileName) => {
  if (fileName.endsWith('.txt')) {
    return localStorage.getItem(fileName) || '';
  }
  
  const file = projectFiles.find(f => f.name === fileName);
  return file ? file.content : '';
};

export const saveFileContent = (fileName, content) => {
  const file = projectFiles.find(f => f.name === fileName);
  
  if (file) {
    file.content = content;
    saveProjectFiles();
  }
  
  if (fileName.endsWith('.txt')) {
    localStorage.setItem(fileName, content);
  }
};

export const executeOpenFileStatement = (statement, environment, interpreter) => {
  const { filename, mode } = statement;
  
  const filenameValue = interpreter.evaluateExpression(filename);
  console.log(`Opening file: ${filenameValue} in ${mode} mode`);
  
  if (filenameValue in openFiles) {
    throw errors.createRuntimeError(`File ${filenameValue} is already open`);
  }
  
  if (mode === 'READ' && !filenameValue.endsWith('.txt')) {
    throw errors.createRuntimeError(`Only .txt files can be opened for reading`);
  }
  
  const fileExists = localStorage.getItem(filenameValue) !== null || 
                    projectFiles.some(file => file.name === filenameValue);
  
  if (mode === 'READ' && !fileExists) {
    throw errors.createRuntimeError(`File ${filenameValue} does not exist`);
  }
  
  openFiles[filenameValue] = {
    mode,
    content: mode === 'READ' ? getFileContent(filenameValue) : '',
    position: 0
  };
  
  if (mode === 'WRITE') {
    if (filenameValue.endsWith('.txt')) {
      localStorage.setItem(filenameValue, '');
      
      if (!projectFiles.some(file => file.name === filenameValue)) {
        projectFiles.push({
          name: filenameValue,
          content: '',
          type: 'txt'
        });
        saveProjectFiles();
      }
    } else {
      throw errors.createRuntimeError(`Only .txt files can be opened for writing`);
    }
  }
};

export const executeReadFileStatement = (statement, environment, interpreter) => {
  const { filename, variable } = statement;
  
  const filenameValue = interpreter.evaluateExpression(filename);
  console.log(`Reading from file: ${filenameValue} into variable ${variable.name}`);
  
  if (!(filenameValue in openFiles)) {
    throw errors.createRuntimeError(`File ${filenameValue} is not open`);
  }
  
  if (openFiles[filenameValue].mode !== 'READ') {
    throw errors.createRuntimeError(`File ${filenameValue} is not open for reading`);
  }
  
  const fileContent = openFiles[filenameValue].content;
  const lines = fileContent.split('\n');
  const position = openFiles[filenameValue].position;
  
  if (position >= lines.length) {
    throw errors.createRuntimeError(`End of file ${filenameValue}`);
  }
  
  const line = lines[position];
  openFiles[filenameValue].position++;
  
  if (variable.type === 'Variable') {
    if (!(variable.name in environment.variables)) {
      throw errors.createRuntimeError(`Variable ${variable.name} not declared`);
    }
    
    environment.variables[variable.name] = line;
  } else {
    throw errors.createRuntimeError('Invalid read target');
  }
};

export const executeWriteFileStatement = (statement, environment, interpreter) => {
  const { filename, expression } = statement;
  
  const filenameValue = interpreter.evaluateExpression(filename);
  const expressionValue = interpreter.evaluateExpression(expression);
  console.log(`Writing to file: ${filenameValue} value: ${expressionValue}`);
  
  if (!(filenameValue in openFiles)) {
    throw errors.createRuntimeError(`File ${filenameValue} is not open`);
  }
  
  if (openFiles[filenameValue].mode !== 'WRITE') {
    throw errors.createRuntimeError(`File ${filenameValue} is not open for writing`);
  }
  
  if (!filenameValue.endsWith('.txt')) {
    throw errors.createRuntimeError(`Only .txt files can be written to`);
  }
  
  const currentContent = localStorage.getItem(filenameValue) || '';
  const newContent = currentContent + expressionValue + '\n';
  localStorage.setItem(filenameValue, newContent);
  
  const fileIndex = projectFiles.findIndex(file => file.name === filenameValue);
  if (fileIndex >= 0) {
    projectFiles[fileIndex].content = newContent;
    saveProjectFiles();
  }
  
  const fileBrowserEl = document.querySelector('.file-browser');
  if (fileBrowserEl) {
    renderFileBrowser(fileBrowserEl, (file) => {
      const event = new CustomEvent('fileSelected', { detail: file });
      document.dispatchEvent(event);
    });
  }
};

export const executeCloseFileStatement = (statement, environment, interpreter) => {
  const { filename } = statement;
  
  const filenameValue = interpreter.evaluateExpression(filename);
  console.log(`Closing file: ${filenameValue}`);
  
  if (!(filenameValue in openFiles)) {
    throw errors.createRuntimeError(`File ${filenameValue} is not open`);
  }
  
  delete openFiles[filenameValue];
};