import * as errors from './errors.js';

export const executeProcedureDeclaration = (declaration, environment) => {
  const { name, parameters, body } = declaration;
  console.log(`Declaring procedure: ${name} with ${parameters.length} parameters`);
  
  // Store the procedure in the environment
  environment.procedures[name] = {
    parameters,
    body
  };
};

export const executeFunctionDeclaration = (declaration, environment) => {
  const { name, parameters, returnType, body } = declaration;
  console.log(`Declaring function: ${name} with ${parameters.length} parameters and return type ${returnType}`);
  
  // Store the function in the environment
  environment.functions[name] = {
    parameters,
    returnType,
    body
  };
};

export const executeCallStatement = (statement, environment, interpreter) => {
  const { name, arguments: args } = statement;
  console.log(`Calling procedure: ${name} with ${args.length} arguments`);
  
  // check if the procedure exists
  if (!(name in environment.procedures)) {
    throw errors.createRuntimeError(`Undefined procedure: ${name}`);
  }
  
  const procedure = environment.procedures[name];
  
  // create a new environment for procedure
  const localEnvironment = {
    variables: {},
    constants: { ...environment.constants },
    procedures: { ...environment.procedures },
    functions: { ...environment.functions }
  };
  
  // evaluate args and bind them to parameters
  for (let i = 0; i < procedure.parameters.length; i++) {
    const parameter = procedure.parameters[i];
    const argument = i < args.length ? interpreter.evaluateExpression(args[i]) : null;
    
    localEnvironment.variables[parameter.name] = argument;
  }
  
  // save environment
  const savedEnvironment = { ...interpreter.environment };
  interpreter.environment = localEnvironment;
  
  try {
    for (const stmt of procedure.body) {
      interpreter.executeStatement(stmt);
    }
  } finally {
    // restore original environment
    interpreter.environment = savedEnvironment;
  }
};

export const executeReturnStatement = (statement, environment, interpreter) => {
  const { value } = statement;
  
  const returnValue = interpreter.evaluateExpression(value);
  console.log(`Returning value: ${returnValue}`);
  
  const returnError = new Error('RETURN');
  returnError.value = returnValue;
  throw returnError;
};

export const evaluateFunctionCall = (expression, environment, interpreter) => {
  const { name, arguments: args } = expression;
  console.log(`Evaluating function call: ${name} with ${args.length} arguments`);
  
  // Check if built-in function
  if (name === 'DIV') {
    // DIV function (integer division)
    if (args.length !== 2) {
      throw errors.createRuntimeError('DIV function requires 2 arguments');
    }
    
    const x = interpreter.evaluateExpression(args[0]);
    const y = interpreter.evaluateExpression(args[1]);
    
    if (y === 0) {
      throw errors.createRuntimeError('Division by zero');
    }
    
    return Math.floor(x / y);
  } else if (name === 'MOD') {
    // MOD function (remainder)
    if (args.length !== 2) {
      throw errors.createRuntimeError('MOD function requires 2 arguments');
    }
    
    const x = interpreter.evaluateExpression(args[0]);
    const y = interpreter.evaluateExpression(args[1]);
    
    if (y === 0) {
      throw errors.createRuntimeError('Division by zero');
    }
    
    return x % y;
  } else if (name === 'LENGTH') {
    // LENGTH function (string length)
    if (args.length !== 1) {
      throw errors.createRuntimeError('LENGTH function requires 1 argument');
    }
    
    const str = interpreter.evaluateExpression(args[0]);
    return str.length;
  } else if (name === 'LCASE') {
    // LCASE function (convert to lowercase)
    if (args.length !== 1) {
      throw errors.createRuntimeError('LCASE function requires 1 argument');
    }
    
    const str = interpreter.evaluateExpression(args[0]);
    return str.toLowerCase();
  } else if (name === 'UCASE') {
    // UCASE function (convert to uppercase)
    if (args.length !== 1) {
      throw errors.createRuntimeError('UCASE function requires 1 argument');
    }
    
    const str = interpreter.evaluateExpression(args[0]);
    return str.toUpperCase();
  } else if (name === 'SUBSTRING') {
    // SUBSTRING function
    if (args.length !== 3) {
      throw errors.createRuntimeError('SUBSTRING function requires 3 arguments');
    }
    
    const str = interpreter.evaluateExpression(args[0]);
    const start = interpreter.evaluateExpression(args[1]);
    const length = interpreter.evaluateExpression(args[2]);
    
    // Convert from 1-based to 0-based indexing
    const startIndex = start - 1;
    return str.substring(startIndex, startIndex + length);
  } else if (name === 'ROUND') {
    // ROUND function
    if (args.length !== 2) {
      throw errors.createRuntimeError('ROUND function requires 2 arguments');
    }
    
    const x = interpreter.evaluateExpression(args[0]);
    const places = interpreter.evaluateExpression(args[1]);
    
    const factor = Math.pow(10, places);
    return Math.round(x * factor) / factor;
  } else if (name === 'RANDOM') {
    // RANDOM function
    if (args.length === 0) {
      // RANDOM() with no arguments returns a value between 0 and 1
      return Math.random();
    } else if (args.length === 2) {
      // RANDOM(min, max) returns a value between min and max
      const min = interpreter.evaluateExpression(args[0]);
      const max = interpreter.evaluateExpression(args[1]);
      
      return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
      throw errors.createRuntimeError('RANDOM function requires 0 or 2 arguments');
    }
  }
  
  // check if user-defined function
  if (!(name in environment.functions)) {
    throw errors.createRuntimeError(`Undefined function: ${name}`);
  }
  
  const func = environment.functions[name];
  
  // create a new environment for the function
  const localEnvironment = {
    variables: {},
    constants: { ...environment.constants },
    procedures: { ...environment.procedures },
    functions: { ...environment.functions }
  };
  
  for (let i = 0; i < func.parameters.length; i++) {
    const parameter = func.parameters[i];
    const argument = i < args.length ? interpreter.evaluateExpression(args[i]) : null;
    
    localEnvironment.variables[parameter.name] = argument;
  }
  
  const savedEnvironment = { ...interpreter.environment };
  interpreter.environment = localEnvironment;
  
  try {
    // Execute the function body
    for (const stmt of func.body) {
      try {
        interpreter.executeStatement(stmt);
      } catch (error) {
        // Check if it's a return signal
        if (error.message === 'RETURN') {
          return error.value;
        }
        
        // rethrow other errors
        throw error;
      }
    }
    
    return getDefaultReturnValue(func.returnType);
  } finally {
    // restore original environment
    interpreter.environment = savedEnvironment;
  }
};

const getDefaultReturnValue = (returnType) => {
  switch (returnType) {
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