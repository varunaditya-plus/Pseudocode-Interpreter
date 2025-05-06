import { TokenType } from '../tokenizer.js';
import * as errors from './errors.js';

// Defaults for each type
const getDefaultValue = (dataType) => {
  switch (dataType) {
    case 'INTEGER':
      return 0;
    case 'REAL':
      return 0.0;
    case 'CHAR':
      return '';
    case 'STRING':
      return '';
    case 'BOOLEAN':
      return false;
    default:
      return null;
  }
};

export const executeVariableDeclaration = (declaration, environment) => {
  const { name, dataType, isArray, dimensions } = declaration;
  console.log(`Declaring variable: ${name} with type ${dataType}${isArray ? ' (array)' : ''}`);
  
  if (name in environment.variables || name in environment.constants) {
    throw errors.createRuntimeError(`Variable ${name} already declared`);
  }
  
  if (isArray) {
    if (dimensions.length === 1) {
      // 1D array
      const lowerBound = dimensions[0].lowerBound.value;
      const upperBound = dimensions[0].upperBound.value;
      const size = upperBound - lowerBound + 1;
      
      // Create array with default values based on data type
      const array = new Array(upperBound + 1).fill(null);
      
      // Initialize with default values based on data type
      for (let i = lowerBound; i <= upperBound; i++) {
        array[i] = getDefaultValue(dataType);
      }
      
      environment.variables[name] = array;
    } else if (dimensions.length === 2) {
      // 2D array
      const lowerBound1 = dimensions[0].lowerBound.value;
      const upperBound1 = dimensions[0].upperBound.value;
      const lowerBound2 = dimensions[1].lowerBound.value;
      const upperBound2 = dimensions[1].upperBound.value;
      
      // Create 2D array
      const array = new Array(upperBound1 + 1);
      
      for (let i = lowerBound1; i <= upperBound1; i++) {
        array[i] = new Array(upperBound2 + 1).fill(null);
        
        // Initialize with default values
        for (let j = lowerBound2; j <= upperBound2; j++) {
          array[i][j] = getDefaultValue(dataType);
        }
      }
      
      environment.variables[name] = array;
    }
  } else {
    environment.variables[name] = getDefaultValue(dataType);
  }
};

export const executeConstantDeclaration = (declaration, environment) => {
  const { name, value } = declaration;
  console.log(`Declaring constant: ${name} with value ${value.value}`);
  
  // Check if the constant already exists
  if (name in environment.variables || name in environment.constants) {
    throw errors.createRuntimeError(`Constant ${name} already declared`);
  }
  
  environment.constants[name] = value.value;
};

export const executeAssignment = (statement, environment, interpreter) => {
  const { target, value } = statement;
  const evaluatedValue = interpreter.evaluateExpression(value);
  console.log(`Assigning value: ${evaluatedValue} to ${target.type === 'Variable' ? target.name : `${target.name}[${target.indices.map(i => i.value || '?').join('][')}]`}`);
  
  if (target.type === 'Variable') {
    // Check if it's a constant
    if (target.name in environment.constants) {
      throw errors.createRuntimeError(`Cannot assign to constant ${target.name}`);
    }
    
    // Check if the variable exists
    if (!(target.name in environment.variables)) {
      throw errors.createRuntimeError(`Variable ${target.name} not declared`);
    }
    
    environment.variables[target.name] = evaluatedValue;
  } else if (target.type === 'ArrayAccess') {
    if (!(target.name in environment.variables)) {
      throw errors.createRuntimeError(`Array ${target.name} not declared`);
    }
    
    const array = environment.variables[target.name];
    
    // Evaluate the indices
    const indices = target.indices.map(index => interpreter.evaluateExpression(index));
    
    // Assign the value to the array element
    if (indices.length === 1) {
      // 1D array
      array[indices[0]] = evaluatedValue;
    } else if (indices.length === 2) {
      // 2D array
      array[indices[0]][indices[1]] = evaluatedValue;
    } else {
      throw errors.createRuntimeError('Invalid array access');
    }
  } else {
    throw errors.createRuntimeError('Invalid assignment target');
  }
};