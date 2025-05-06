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
  
  if (stepValue > 0) {
    // Ascending loop
    for (let i = startValue; i <= endValue; i += stepValue) {
      environment.variables[variable] = i;
      
      for (const stmt of body) {
        interpreter.executeStatement(stmt);
      }
    }
  } else {
    // Descending loop
    for (let i = startValue; i >= endValue; i += stepValue) {
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
  
  do {
    for (const stmt of body) {
      interpreter.executeStatement(stmt);
    }
    
  } while (!interpreter.evaluateExpression(condition));
};

export const executeWhileStatement = (statement, environment, interpreter) => {
  const { condition, body } = statement;
  console.log(`Starting WHILE loop`);
  
  while (interpreter.evaluateExpression(condition)) {
    for (const stmt of body) {
      interpreter.executeStatement(stmt);
    }
  }
};