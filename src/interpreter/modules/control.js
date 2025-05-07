export const executeIfStatement = (statement, environment, interpreter) => {
  const { condition, thenBranch, elseBranch } = statement;
  
  // evaluate condition
  const conditionValue = interpreter.evaluateExpression(condition);
  console.log(`Executing IF statement with condition result: ${conditionValue}`);
  
  if (conditionValue) {
    // Execute the then branch
    for (const stmt of thenBranch) {
      interpreter.executeStatement(stmt);
    }
  } else if (elseBranch) {
    for (const stmt of elseBranch) {
      interpreter.executeStatement(stmt);
    }
  }
};

export const executeCaseStatement = (statement, environment, interpreter) => {
  const { subject, cases, otherwiseCase } = statement;
  
  // Evaluate the subject
  const subjectValue = interpreter.evaluateExpression(subject);
  console.log(`Executing CASE statement with subject value: ${subjectValue}`);
  
  let matched = false;
  
  for (const caseItem of cases) {
    const caseValue = interpreter.evaluateExpression(caseItem.value);
    
    if (subjectValue === caseValue) {
      // Execute matching case
      interpreter.executeStatement(caseItem.statement);
      matched = true;
      break;
    }
  }
  
  // If no case matched and theres otherwise case, execute it
  if (!matched && otherwiseCase) {
    interpreter.executeStatement(otherwiseCase);
  }
};

export const executeForStatement = (statement, environment, interpreter) => {
  const { variable, start, end, step, body } = statement;
  
  const startValue = interpreter.evaluateExpression(start);
  const endValue = interpreter.evaluateExpression(end);
  const stepValue = interpreter.evaluateExpression(step);
  console.log(`Executing FOR loop with variable ${variable} from ${startValue} to ${endValue} step ${stepValue}`);
  
  // Initialize loop variable
  environment.variables[variable] = startValue;
  
  // Add iteration counter
  let iterationCount = 0;
  const MAX_ITERATIONS = 10000; // Prevent infinite loops
  
  if (stepValue > 0) {
    // Ascending loop
    for (let i = startValue; i <= endValue; i += stepValue) {
      // Check iteration count
      if (iterationCount++ > MAX_ITERATIONS) {
        interpreter.addOutput("WARNING: Loop iteration limit reached. Possible infinite loop detected.");
        break;
      }
      
      // Check memory usage
      if (interpreter.checkMemoryUsage()) {
        break; // Memory limit exceeded, stop execution
      }
      
      environment.variables[variable] = i;
      
      for (const stmt of body) {
        interpreter.executeStatement(stmt);
      }
    }
  } else {
    // Descending loop
    for (let i = startValue; i >= endValue; i += stepValue) {
      // Check iteration count
      if (iterationCount++ > MAX_ITERATIONS) {
        interpreter.addOutput("WARNING: Loop iteration limit reached. Possible infinite loop detected.");
        break;
      }
      
      // Check memory usage
      if (interpreter.checkMemoryUsage()) {
        break; // Memory limit exceeded, stop execution
      }
      
      environment.variables[variable] = i;
      
      for (const stmt of body) {
        interpreter.executeStatement(stmt);
      }
    }
  }
};

export const executeRepeatStatement = (statement, environment, interpreter) => {
  const { body, condition } = statement;
  console.log(`Starting REPEAT-UNTIL loop`);
  
  // Add iteration counter
  let iterationCount = 0;
  const MAX_ITERATIONS = 1000000; // Prevent infinite loops
  
  do {
    if (iterationCount++ > MAX_ITERATIONS) {
      interpreter.addOutput("WARNING: Loop iteration limit reached. Possible infinite loop detected.");
      
      const shouldContinue = confirm("Possible infinite loop detected. Continue execution?");
      if (!shouldContinue) {
        interpreter.addOutput("Execution terminated by user due to possible infinite loop.");
        break;
      }
      
      iterationCount = 0;
    }
    
    // Check memory usage
    if (interpreter.checkMemoryUsage()) {
      break; // Memory limit exceeded, stop execution
    }
    
    for (const stmt of body) {
      interpreter.executeStatement(stmt);
    }
    
  } while (!interpreter.evaluateExpression(condition));
};

export function executeWhileStatement(statement, environment, interpreter) {
  const { condition, body } = statement;
  console.log(`Starting WHILE loop`);
  
  let iterationCount = 0;
  const MAX_ITERATIONS_WITHOUT_CHECK = 100;
  
  while (evaluateCondition(condition, environment, interpreter)) {
    for (const stmt of body) {
      interpreter.executeStatement(stmt);
    }
    
    iterationCount++;
    
    if (iterationCount >= MAX_ITERATIONS_WITHOUT_CHECK) {
      iterationCount = 0;
      
      // Check memory usage
      if (interpreter.checkMemoryUsage()) {
        throw errors.createRuntimeError("Memory limit exceeded in while loop. Program terminated.", interpreter.currentLine);
      }
    }
  }
}

function evaluateCondition(condition, environment, interpreter) {
  const result = interpreter.evaluateExpression(condition);
  
  if (typeof result !== 'boolean') {
    throw errors.createTypeError('Condition must evaluate to a boolean', interpreter.currentLine);
  }
  
  return result;
}
