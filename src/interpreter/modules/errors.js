// Error types (add more later)
export const ErrorType = {
  SYNTAX_ERROR: 'SyntaxError',
  RUNTIME_ERROR: 'RuntimeError',
  TYPE_ERROR: 'TypeError',
  REFERENCE_ERROR: 'ReferenceError',
  FILE_ERROR: 'FileError',
  INTERNAL_ERROR: 'InternalError'
};

export const formatError = (type, message, line, column) => {
  console.log(`Formatting error: ${type} - ${message}${line !== undefined ? ` at line ${line}` : ''}${column !== undefined ? `, column ${column}` : ''}`);
  
  let formattedMessage = `${type}: ${message}`;
  
  if (line !== undefined && column !== undefined) {
    formattedMessage += ` at line ${line}, column ${column}`;
  } else if (line !== undefined) {
    formattedMessage += ` at line ${line}`;
  }
  
  return formattedMessage;
};

export const createSyntaxError = (message, line, column) => {
  console.log(`Creating syntax error: ${message} at line ${line}, column ${column}`);
  const error = new Error(formatError(ErrorType.SYNTAX_ERROR, message, line, column));
  error.type = ErrorType.SYNTAX_ERROR;
  error.line = line;
  error.column = column;
  return error;
};

export const createRuntimeError = (message, line) => {
  console.log(`Creating runtime error: ${message}${line !== undefined ? ` at line ${line}` : ''}`);
  const error = new Error(formatError(ErrorType.RUNTIME_ERROR, message, line));
  error.type = ErrorType.RUNTIME_ERROR;
  error.line = line;
  return error;
};

export const createTypeError = (message, line) => {
  console.log(`Creating type error: ${message}${line !== undefined ? ` at line ${line}` : ''}`);
  const error = new Error(formatError(ErrorType.TYPE_ERROR, message, line));
  error.type = ErrorType.TYPE_ERROR;
  error.line = line;
  return error;
};

export const createReferenceError = (message, line) => {
  console.log(`Creating reference error: ${message}${line !== undefined ? ` at line ${line}` : ''}`);
  const error = new Error(formatError(ErrorType.REFERENCE_ERROR, message, line));
  error.type = ErrorType.REFERENCE_ERROR;
  error.line = line;
  return error;
};

export const createFileError = (message) => {
  console.log(`Creating file error: ${message}`);
  const error = new Error(formatError(ErrorType.FILE_ERROR, message));
  error.type = ErrorType.FILE_ERROR;
  return error;
};

export const createInternalError = (message) => {
  console.log(`Creating internal error: ${message}`);
  const error = new Error(formatError(ErrorType.INTERNAL_ERROR, message));
  error.type = ErrorType.INTERNAL_ERROR;
  return error;
};