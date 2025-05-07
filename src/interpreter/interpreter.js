import { TokenType } from './tokenizer.js';
import * as assignments from './modules/assignments.js';
import * as operations from './modules/operations.js';
import * as control from './modules/control.js';
import * as procedures from './modules/procedures.js';
import * as files from './modules/files.js';
import * as errors from './modules/errors.js';

export class Interpreter {
  constructor() {
    // environment for storing variables, constants, arrays etc
    this.environment = {
      variables: {},
      constants: {},
      procedures: {},
      functions: {}
    };
    
    // Output buffer
    this.output = [];
    
    // Add output callback
    this.outputCallback = null;
    
    // Input queue for input statements
    this.inputQueue = [];
    
    // Current line being executed
    this.currentLine = 0;
    
    // Output line limit
    this.MAX_OUTPUT_LINES = 1000;
    
    // Line count for execution limit
    this.executionLineCount = 0;
    this.MAX_EXECUTION_LINES = 1000;
  }
  
  reset() {
    this.environment = {
      variables: {},
      constants: {},
      procedures: {},
      functions: {}
    };
    this.output = [];
    this.inputQueue = [];
    this.currentLine = 0;
  }
 
  // Add this method to check memory usage
  checkMemoryUsage() {
    // Check if memory usage exceeds 1GB (1073741824 bytes)
    if (window.performance && window.performance.memory) {
      const memoryInfo = window.performance.memory;
      const usedHeapSize = memoryInfo.usedJSHeapSize;
      const memoryLimitBytes = 1073741824; // 1GB in bytes
      
      if (usedHeapSize > memoryLimitBytes) {
        this.addOutput("ERROR: Memory limit exceeded (1GB). Program execution terminated.");
        return true; // Memory limit exceeded
      }
    }
    return false; // Memory usage is acceptable
  }
  
  setOutputCallback(callback) {
    this.outputCallback = callback;
  }
  
  addOutput(message, isError = false) {
    this.output.push(message);
    
    if (this.outputCallback && typeof this.outputCallback === 'function') {
      this.outputCallback(message, isError ? 'error' : 'output');
    }
    
    // Keep only the latest MAX_OUTPUT_LINES lines
    if (this.output.length > this.MAX_OUTPUT_LINES) {
      this.output = this.output.slice(-this.MAX_OUTPUT_LINES);
    }
    
    this.executionLineCount++;
    
    // Check if we've already exceeded the limit
    if (!this.limitExceeded && this.executionLineCount > this.MAX_EXECUTION_LINES) {
      this.limitExceeded = true;
      throw errors.createRuntimeError(`Maximum line limit (${this.MAX_EXECUTION_LINES}) exceeded. Program terminated.`, this.currentLine);
    }
    
    return message;
  }
  
  getInput(promptText) {
    // In browser environment, we'll use window.prompt() for input
    if (this.inputQueue.length > 0) {
      return this.inputQueue.shift();
    }
    
    const value = window.prompt(promptText || 'Enter input:');
    return value;
  }
  
  setInputQueue(values) {
    this.inputQueue = values;
  }
  
  interpret(ast) {
    try {
      if (ast && ast.type === 'Program' && ast.statements) {
        for (const statement of ast.statements) {
          try {
            this.executeStatement(statement);
          } catch (error) {
            this.addOutput(`Error: ${error.message}`, true);
            if (error.isCritical) {
              break;
            }
          }
        }
        return this.output.join('\n');
      } else {
        this.executeProgram(ast);
        return this.output.join('\n');
      }
    } catch (error) {
      this.addOutput(`Error: ${error.message}`, true);
      return this.output.join('\n');
    }
  }

  executeProgram(program) {
    if (program.type !== 'Program') {
      throw new Error('Expected program AST');
    }
    
    for (const statement of program.statements) {
      this.executeStatement(statement);
    }
  }
  
  executeStatement(statement) {
    try {
      this.currentLine = statement.line || this.currentLine;
      this.executionLineCount++;
      
      if (this.executionLineCount > this.MAX_EXECUTION_LINES) {
        throw errors.createRuntimeError(`Maximum line limit (${this.MAX_EXECUTION_LINES}) exceeded at /Users/varunaditya/Desktop/pseudocode-interpreter/src/`, this.currentLine);
      }
      
      switch (statement.type) {
        case 'ErrorStatement':
          this.addOutput(`Error at line ${statement.line}: ${statement.message}`, true);
          return;
        case 'VariableDeclaration':
          return assignments.executeVariableDeclaration(statement, this.environment);
        
        case 'ConstantDeclaration':
          return assignments.executeConstantDeclaration(statement, this.environment);
        
        case 'AssignmentStatement':
          return assignments.executeAssignment(statement, this.environment, this);
        
        case 'InputStatement':
          return this.executeInputStatement(statement);
        
        case 'OutputStatement':
          return this.executeOutputStatement(statement);
        
        case 'IfStatement':
          return control.executeIfStatement(statement, this.environment, this);
        
        case 'CaseStatement':
          return control.executeCaseStatement(statement, this.environment, this);
        
        case 'ForStatement':
          return control.executeForStatement(statement, this.environment, this);
        
        case 'RepeatStatement':
          return control.executeRepeatStatement(statement, this.environment, this);
        
        case 'WhileStatement':
          return control.executeWhileStatement(statement, this.environment, this);
        
        case 'ProcedureDeclaration':
          return procedures.executeProcedureDeclaration(statement, this.environment);
        
        case 'FunctionDeclaration':
          return procedures.executeFunctionDeclaration(statement, this.environment);
        
        case 'CallStatement':
          return procedures.executeCallStatement(statement, this.environment, this);
        
        case 'ReturnStatement':
          return procedures.executeReturnStatement(statement, this.environment, this);
        
        case 'OpenFileStatement':
          return files.executeOpenFileStatement(statement, this.environment, this);
        
        case 'ReadFileStatement':
          return files.executeReadFileStatement(statement, this.environment, this);
        
        case 'WriteFileStatement':
          return files.executeWriteFileStatement(statement, this.environment, this);
        
        case 'CloseFileStatement':
          return files.executeCloseFileStatement(statement, this.environment, this);
        
        default:
          throw new Error(`Unknown statement type: ${statement.type}`);
      }
    } catch (error) {
      if (!error.line && this.currentLine) {
        error.line = this.currentLine;
      }
      throw error;
    }
  }
  
  executeInputStatement(statement) {
    const { variable } = statement;
    
    if (variable.type === 'Variable') {
      if (!(variable.name in this.environment.variables)) {
        throw errors.createRuntimeError(`Variable ${variable.name} not declared`);
      }
      
      const value = this.getInput(`Enter value for ${variable.name}:`);
      
      this.environment.variables[variable.name] = value;
    } else if (variable.type === 'ArrayAccess') {
      if (!(variable.name in this.environment.variables)) {
        throw errors.createRuntimeError(`Array ${variable.name} not declared`);
      }
      
      const array = this.environment.variables[variable.name];
      
      const indices = variable.indices.map(index => this.evaluateExpression(index));
      
      const value = this.getInput(`Enter value for ${variable.name}[${indices.join(', ')}]:`);
      
      // Assign the value to the array element
      if (indices.length === 1) {
        // 1D array
        array[indices[0]] = value;
      } else if (indices.length === 2) {
        // 2D array
        array[indices[0]][indices[1]] = value;
      } else {
        throw errors.createRuntimeError('Invalid array access');
      }
    } else {
      throw errors.createRuntimeError('Invalid input target');
    }
  }

  executeOutputStatement(statement) {
    const { expression } = statement;
    
    const value = this.evaluateExpression(expression);
    
    this.addOutput(value);
  }
 
  evaluateExpression(expression) {
    switch (expression.type) {
      case 'BinaryExpression':
        return operations.evaluateBinaryExpression(expression, this.environment, this);
      
      case 'UnaryExpression':
        return operations.evaluateUnaryExpression(expression, this.environment, this);
      
      case 'Literal':
        return expression.value;
      
      case 'Variable':
        return this.evaluateVariable(expression);
      
      case 'ArrayAccess':
        return this.evaluateArrayAccess(expression);
      
      case 'FunctionCall':
        return procedures.evaluateFunctionCall(expression, this.environment, this);
      
      case 'GroupingExpression':
        return this.evaluateExpression(expression.expression);
      
      default:
        throw new Error(`Unknown expression type: ${expression.type}`);
    }
  }

  evaluateVariable(variable) {
    const { name } = variable;
    
    // Check if it's a constant
    if (name in this.environment.constants) {
      return this.environment.constants[name];
    }
    
    // Check if it's a variable
    if (name in this.environment.variables) {
      return this.environment.variables[name];
    }
    
    throw errors.createRuntimeError(`Undefined variable: ${name}`);
  }
  
  evaluateArrayAccess(arrayAccess) {
    const { name, indices } = arrayAccess;
    
    // Check if the array exists
    if (!(name in this.environment.variables)) {
      throw errors.createRuntimeError(`Undefined array: ${name}`);
    }
    
    const array = this.environment.variables[name];
    
    const evaluatedIndices = indices.map(index => this.evaluateExpression(index));
    
    // Access the array element
    if (evaluatedIndices.length === 1) {
      // 1D array
      if (evaluatedIndices[0] < 0 || evaluatedIndices[0] >= array.length || array[evaluatedIndices[0]] === undefined) {
        throw errors.createRuntimeError(`Array index out of bounds: ${name}[${evaluatedIndices[0]}]`);
      }
      
      return array[evaluatedIndices[0]];
    } else if (evaluatedIndices.length === 2) {
      // 2D array
      if (evaluatedIndices[0] < 0 || evaluatedIndices[0] >= array.length || 
          array[evaluatedIndices[0]] === undefined ||
          evaluatedIndices[1] < 0 || evaluatedIndices[1] >= array[evaluatedIndices[0]].length ||
          array[evaluatedIndices[0]][evaluatedIndices[1]] === undefined) {
        throw errors.createRuntimeError(`Array index out of bounds: ${name}[${evaluatedIndices.join(', ')}]`);
      }
      
      return array[evaluatedIndices[0]][evaluatedIndices[1]];
    } else {
      throw errors.createRuntimeError('Invalid array access');
    }
  }
}