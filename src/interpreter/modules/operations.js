import { TokenType } from '../tokenizer.js';

export const evaluateBinaryExpression = (expression, environment, interpreter) => {
  const { operator, left, right } = expression;
  const leftValue = interpreter.evaluateExpression(left);
  const rightValue = interpreter.evaluateExpression(right);
  console.log(`Evaluating binary expression: ${leftValue} ${operator} ${rightValue}`);
  
  switch (operator) {
    // Arithmetic operators
    case TokenType.PLUS:
      return leftValue + rightValue;
    case TokenType.MINUS:
      return leftValue - rightValue;
    case TokenType.MULTIPLY:
      return leftValue * rightValue;
    case TokenType.DIVIDE:
      if (rightValue === 0) {
        throw new Error('Division by zero');
      }
      return leftValue / rightValue;
    case TokenType.POWER:
      return Math.pow(leftValue, rightValue);
    
    // Relational operators
    case TokenType.EQUAL:
      return leftValue === rightValue;
    case TokenType.NOT_EQUAL:
      return leftValue !== rightValue;
    case TokenType.LESS:
      return leftValue < rightValue;
    case TokenType.LESS_EQUAL:
      return leftValue <= rightValue;
    case TokenType.GREATER:
      return leftValue > rightValue;
    case TokenType.GREATER_EQUAL:
      return leftValue >= rightValue;
    
    // Logical operators
    case TokenType.AND:
      return leftValue && rightValue;
    case TokenType.OR:
      return leftValue || rightValue;
    
    default:
      throw new Error(`Unknown binary operator: ${operator}`);
  }
};

export const evaluateUnaryExpression = (expression, environment, interpreter) => {
  const { operator, right } = expression;
  const rightValue = interpreter.evaluateExpression(right);
  console.log(`Evaluating unary expression: ${operator}${rightValue}`);
  
  switch (operator) {
    case TokenType.MINUS:
      return -rightValue;
    case TokenType.NOT:
      return !rightValue;
    default:
      throw new Error(`Unknown unary operator: ${operator}`);
  }
};

export const div = (x, y) => {
  console.log(`Executing DIV operation: ${x} DIV ${y}`);
  if (y === 0) {
    throw new Error('Division by zero');
  }
  return Math.floor(x / y);
};

export const mod = (x, y) => {
  console.log(`Executing MOD operation: ${x} MOD ${y}`);
  if (y === 0) {
    throw new Error('Division by zero');
  }
  return x % y;
};

export const length = (str) => {
  console.log(`Getting length of string: "${str}"`);
  return str.length;
};

export const lcase = (str) => {
  return str.toLowerCase();
};

export const ucase = (str) => {
  return str.toUpperCase();
};

export const substring = (str, start, length) => {
  // Convert from 1-based to 0-based indexing
  const startIndex = start - 1;
  return str.substring(startIndex, startIndex + length);
};

export const round = (x, places) => {
  const factor = Math.pow(10, places);
  return Math.round(x * factor) / factor;
};

export const toString = (value) => {
  return String(value);
};

export const toInteger = (str) => {
  return parseInt(str, 10);
};

export const toReal = (str) => {
  return parseFloat(str);
};

export const random = (min, max) => {
  console.log(`Generating random number between ${min} and ${max}`);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};