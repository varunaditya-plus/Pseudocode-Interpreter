import { TokenType } from './tokenizer.js';
import * as errors from './modules/errors.js';

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  peek() {
    return this.tokens[this.current];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  check(type) {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    if (this.check(type)) return this.advance();
    
    const token = this.peek();
    throw errors.createSyntaxError(message, token.line, token.column);
  }

  parse() {
    try {
      const statements = [];
      
      while (!this.isAtEnd()) {
        try {
          const statement = this.declaration();
          statement.line = this.previous().line;
          statement.column = this.previous().column;
          statements.push(statement);
        } catch (error) {
          console.error(error.message);

          this.synchronize();

          // placeholder error statement
          statements.push({
            type: 'ErrorStatement',
            message: error.message,
            line: error.line,
            column: error.column
          });
        }
      }
      
      return {
        type: 'Program',
        statements
      };
    } catch (error) {
      console.error(error.message);
      throw error;
    }
  }
  
  // synchronize method to skip to next statement
  synchronize() {
    this.advance();
    
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      
      switch (this.peek().type) {
        case TokenType.DECLARE:
        case TokenType.CONSTANT:
        case TokenType.PROCEDURE:
        case TokenType.FUNCTION:
        case TokenType.IF:
        case TokenType.FOR:
        case TokenType.WHILE:
        case TokenType.REPEAT:
        case TokenType.CASE:
        case TokenType.INPUT:
        case TokenType.OUTPUT:
        case TokenType.CALL:
        case TokenType.RETURN:
          return;
      }
      
      this.advance();
    }
  }

  declaration() {
    if (this.match(TokenType.DECLARE)) return this.variableDeclaration();
    if (this.match(TokenType.CONSTANT)) return this.constantDeclaration();
    if (this.match(TokenType.PROCEDURE)) return this.procedureDeclaration();
    if (this.match(TokenType.FUNCTION)) return this.functionDeclaration();
    
    return this.statement();
  }

  variableDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected variable name').lexeme;
    this.consume(TokenType.COLON, 'Expected ":" after variable name');
    
    let dataType;
    let isArray = false;
    let dimensions = [];
    
    if (this.match(TokenType.ARRAY)) {
      isArray = true;
      this.consume(TokenType.LEFT_BRACKET, 'Expected "[" after ARRAY');
      
      // First dimension
      const lowerBound1 = this.expression();
      this.consume(TokenType.COLON, 'Expected ":" in array dimension');
      const upperBound1 = this.expression();
      
      dimensions.push({
        lowerBound: lowerBound1,
        upperBound: upperBound1
      });
      
      // Check for second dimension
      if (this.match(TokenType.COMMA)) {
        const lowerBound2 = this.expression();
        this.consume(TokenType.COLON, 'Expected ":" in array dimension');
        const upperBound2 = this.expression();
        
        dimensions.push({
          lowerBound: lowerBound2,
          upperBound: upperBound2
        });
      }
      
      this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after array dimensions');
      this.consume(TokenType.OF, 'Expected "OF" after array dimensions');
    }
    
    // Parse data type
    if (this.match(TokenType.INTEGER)) {
      dataType = 'INTEGER';
    } else if (this.match(TokenType.REAL)) {
      dataType = 'REAL';
    } else if (this.match(TokenType.CHAR)) {
      dataType = 'CHAR';
    } else if (this.match(TokenType.STRING)) {
      dataType = 'STRING';
    } else if (this.match(TokenType.BOOLEAN)) {
      dataType = 'BOOLEAN';
    } else {
      throw errors.createSyntaxError('Expected data type', this.peek().line, this.peek().column);
    }
    
    return {
      type: 'VariableDeclaration',
      name,
      dataType,
      isArray,
      dimensions
    };
  }

  constantDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected constant name').lexeme;
    this.consume(TokenType.ASSIGN, 'Expected "←" after constant name');
    
    const value = this.expression();
    
    return {
      type: 'ConstantDeclaration',
      name,
      value
    };
  }

  procedureDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected procedure name').lexeme;
    
    // Parse parameters
    const parameters = [];
    
    if (this.match(TokenType.LEFT_PAREN)) {
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          const paramName = this.consume(TokenType.IDENTIFIER, 'Expected parameter name').lexeme;
          this.consume(TokenType.COLON, 'Expected ":" after parameter name');
          
          let paramType;
          if (this.match(TokenType.INTEGER)) {
            paramType = 'INTEGER';
          } else if (this.match(TokenType.REAL)) {
            paramType = 'REAL';
          } else if (this.match(TokenType.CHAR)) {
            paramType = 'CHAR';
          } else if (this.match(TokenType.STRING)) {
            paramType = 'STRING';
          } else if (this.match(TokenType.BOOLEAN)) {
            paramType = 'BOOLEAN';
          } else {
            throw errors.createSyntaxError('Expected parameter type', this.peek().line, this.peek().column);
          }
          
          parameters.push({
            name: paramName,
            type: paramType
          });
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after parameters');
    }
    
    // Parse procedure body
    const body = [];
    
    while (!this.check(TokenType.ENDPROCEDURE) && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume(TokenType.ENDPROCEDURE, 'Expected ENDPROCEDURE');
    
    return {
      type: 'ProcedureDeclaration',
      name,
      parameters,
      body
    };
  }

  functionDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected function name').lexeme;
    
    // Parse parameters
    const parameters = [];
    
    if (this.match(TokenType.LEFT_PAREN)) {
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          const paramName = this.consume(TokenType.IDENTIFIER, 'Expected parameter name').lexeme;
          this.consume(TokenType.COLON, 'Expected ":" after parameter name');
          
          let paramType;
          if (this.match(TokenType.INTEGER)) {
            paramType = 'INTEGER';
          } else if (this.match(TokenType.REAL)) {
            paramType = 'REAL';
          } else if (this.match(TokenType.CHAR)) {
            paramType = 'CHAR';
          } else if (this.match(TokenType.STRING)) {
            paramType = 'STRING';
          } else if (this.match(TokenType.BOOLEAN)) {
            paramType = 'BOOLEAN';
          } else {
            throw errors.createSyntaxError('Expected parameter type', this.peek().line, this.peek().column);
          }
          
          parameters.push({
            name: paramName,
            type: paramType
          });
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after parameters');
    }
    
    // Parse return type
    this.consume(TokenType.RETURNS, 'Expected RETURNS after function parameters');
    
    let returnType;
    if (this.match(TokenType.INTEGER)) {
      returnType = 'INTEGER';
    } else if (this.match(TokenType.REAL)) {
      returnType = 'REAL';
    } else if (this.match(TokenType.CHAR)) {
      returnType = 'CHAR';
    } else if (this.match(TokenType.STRING)) {
      returnType = 'STRING';
    } else if (this.match(TokenType.BOOLEAN)) {
      returnType = 'BOOLEAN';
    } else {
      throw errors.createSyntaxError('Expected return type', this.peek().line, this.peek().column);
    }
    
    // Parse function body
    const body = [];
    
    while (!this.check(TokenType.ENDFUNCTION) && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume(TokenType.ENDFUNCTION, 'Expected ENDFUNCTION');
    
    return {
      type: 'FunctionDeclaration',
      name,
      parameters,
      returnType,
      body
    };
  }

  statement() {
    if (this.match(TokenType.INPUT)) return this.inputStatement();
    if (this.match(TokenType.OUTPUT)) return this.outputStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.CASE)) return this.caseStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.REPEAT)) return this.repeatStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.CALL)) return this.callStatement();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.OPENFILE)) return this.openFileStatement();
    if (this.match(TokenType.READFILE)) return this.readFileStatement();
    if (this.match(TokenType.WRITEFILE)) return this.writeFileStatement();
    if (this.match(TokenType.CLOSEFILE)) return this.closeFileStatement();
    
    return this.assignmentStatement();
  }

  inputStatement() {
    const variable = this.variable();
    
    return {
      type: 'InputStatement',
      variable
    };
  }

  outputStatement() {
    const expression = this.expression();
    
    return {
      type: 'OutputStatement',
      expression
    };
  }

  ifStatement() {
    const condition = this.expression();
    this.consume(TokenType.THEN, 'Expected THEN after if condition');
    
    const thenBranch = [];
    const elseBranch = [];
    
    // Parse then branch
    while (!this.check(TokenType.ELSE) && !this.check(TokenType.ENDIF) && !this.isAtEnd()) {
      thenBranch.push(this.declaration());
    }
    
    // Parse else branch if it exists
    if (this.match(TokenType.ELSE)) {
      while (!this.check(TokenType.ENDIF) && !this.isAtEnd()) {
        elseBranch.push(this.declaration());
      }
    }
    
    this.consume(TokenType.ENDIF, 'Expected ENDIF');
    
    return {
      type: 'IfStatement',
      condition,
      thenBranch,
      elseBranch: elseBranch.length > 0 ? elseBranch : null
    };
  }

  caseStatement() {
    const subject = this.expression();
    this.consume(TokenType.OF, 'Expected OF after CASE expression');
    
    const cases = [];
    let otherwiseCase = null;
    
    // Parse cases
    while (!this.check(TokenType.OTHERWISE) && !this.check(TokenType.ENDCASE) && !this.isAtEnd()) {
      const value = this.expression();
      this.consume(TokenType.COLON, 'Expected ":" after case value');
      const statement = this.statement();
      
      cases.push({
        value,
        statement
      });
    }
    
    // Parse otherwise case if it exists
    if (this.match(TokenType.OTHERWISE)) {
      this.consume(TokenType.COLON, 'Expected ":" after OTHERWISE');
      otherwiseCase = this.statement();
    }
    
    this.consume(TokenType.ENDCASE, 'Expected ENDCASE');
    
    return {
      type: 'CaseStatement',
      subject,
      cases,
      otherwiseCase
    };
  }

  forStatement() {
    const variable = this.consume(TokenType.IDENTIFIER, 'Expected variable name').lexeme;
    this.consume(TokenType.ASSIGN, 'Expected "←" after variable name');
    const start = this.expression();
    
    this.consume(TokenType.TO, 'Expected TO after start value');
    const end = this.expression();
    
    // Parse step if it exists
    let step = { type: 'Literal', value: 1 };
    if (this.match(TokenType.STEP)) {
      step = this.expression();
    }
    
    // Parse loop body
    const body = [];
    
    while (!this.check(TokenType.NEXT) && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume(TokenType.NEXT, 'Expected NEXT');
    this.consume(TokenType.IDENTIFIER, 'Expected variable name after NEXT');
    
    return {
      type: 'ForStatement',
      variable,
      start,
      end,
      step,
      body
    };
  }

  repeatStatement() {
    const body = [];
    
    while (!this.check(TokenType.UNTIL) && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume(TokenType.UNTIL, 'Expected UNTIL');
    const condition = this.expression();
    
    return {
      type: 'RepeatStatement',
      body,
      condition
    };
  }

  whileStatement() {
    const condition = this.expression();
    this.consume(TokenType.DO, 'Expected DO after WHILE condition');
    
    const body = [];
    
    while (!this.check(TokenType.ENDWHILE) && !this.isAtEnd()) {
      body.push(this.declaration());
    }
    
    this.consume(TokenType.ENDWHILE, 'Expected ENDWHILE');
    
    return {
      type: 'WhileStatement',
      condition,
      body
    };
  }

  callStatement() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected procedure name').lexeme;
    const args = [];
    
    if (this.match(TokenType.LEFT_PAREN)) {
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          args.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after arguments');
    }
    
    return {
      type: 'CallStatement',
      name,
      arguments: args
    };
  }

  returnStatement() {
    const value = this.expression();
    
    return {
      type: 'ReturnStatement',
      value
    };
  }

  openFileStatement() {
    const filename = this.expression();
    this.consume(TokenType.FOR, 'Expected FOR after filename');
    
    let mode;
    if (this.match(TokenType.READ)) {
      mode = 'READ';
    } else if (this.match(TokenType.WRITE)) {
      mode = 'WRITE';
    } else {
      throw errors.createSyntaxError('Expected READ or WRITE', this.peek().line, this.peek().column);
    }
    
    return {
      type: 'OpenFileStatement',
      filename,
      mode
    };
  }

  readFileStatement() {
    const filename = this.expression();
    this.consume(TokenType.COMMA, 'Expected comma after filename');
    const variable = this.variable();
    
    return {
      type: 'ReadFileStatement',
      filename,
      variable
    };
  }

  writeFileStatement() {
    const filename = this.expression();
    this.consume(TokenType.COMMA, 'Expected comma after filename');
    const expression = this.expression();
    
    return {
      type: 'WriteFileStatement',
      filename,
      expression
    };
  }

  closeFileStatement() {
    const filename = this.expression();
    
    return {
      type: 'CloseFileStatement',
      filename
    };
  }

  assignmentStatement() {
    const target = this.variable();
    this.consume(TokenType.ASSIGN, 'Expected "←" in assignment');
    const value = this.expression();
    
    return {
      type: 'AssignmentStatement',
      target,
      value
    };
  }

  variable() {
    const name = this.consume(TokenType.IDENTIFIER, 'Expected variable name').lexeme;
    
    // Check if it's an array access
    if (this.match(TokenType.LEFT_BRACKET)) {
      const indices = [];
      
      // First index
      indices.push(this.expression());
      
      // Check for second index
      if (this.match(TokenType.COMMA)) {
        indices.push(this.expression());
      }
      
      this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after array indices');
      
      return {
        type: 'ArrayAccess',
        name,
        indices
      };
    }
    
    return {
      type: 'Variable',
      name
    };
  }

  expression() {
    return this.or();
  }

  or() {
    let expr = this.and();
    
    while (this.match(TokenType.OR)) {
      const operator = this.previous().type;
      const right = this.and();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  and() {
    let expr = this.equality();
    
    while (this.match(TokenType.AND)) {
      const operator = this.previous().type;
      const right = this.equality();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  equality() {
    let expr = this.comparison();
    
    while (this.match(TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().type;
      const right = this.comparison();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  comparison() {
    let expr = this.term();
    
    while (this.match(
      TokenType.LESS, TokenType.LESS_EQUAL,
      TokenType.GREATER, TokenType.GREATER_EQUAL
    )) {
      const operator = this.previous().type;
      const right = this.term();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  term() {
    let expr = this.factor();
    
    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().type;
      const right = this.factor();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  factor() {
    let expr = this.power();
    
    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().type;
      const right = this.power();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  power() {
    let expr = this.unary();
    
    while (this.match(TokenType.POWER)) {
      const operator = this.previous().type;
      const right = this.unary();
      
      expr = {
        type: 'BinaryExpression',
        operator,
        left: expr,
        right
      };
    }
    
    return expr;
  }

  unary() {
    if (this.match(TokenType.MINUS, TokenType.NOT)) {
      const operator = this.previous().type;
      const right = this.unary();
      
      return {
        type: 'UnaryExpression',
        operator,
        right
      };
    }
    
    return this.call();
  }

  call() {
    if (this.check(TokenType.IDENTIFIER) && this.tokens[this.current + 1]?.type === TokenType.LEFT_PAREN) {
      const name = this.consume(TokenType.IDENTIFIER, 'Expected function name').lexeme;
      this.consume(TokenType.LEFT_PAREN, 'Expected "(" after function name');
      
      const args = [];
      
      if (!this.check(TokenType.RIGHT_PAREN)) {
        do {
          args.push(this.expression());
        } while (this.match(TokenType.COMMA));
      }
      
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after arguments');
      
      return {
        type: 'FunctionCall',
        name,
        arguments: args
      };
    }
    
    return this.primary();
  }

  primary() {
    if (this.match(TokenType.INTEGER_LITERAL, TokenType.REAL_LITERAL)) {
      return {
        type: 'Literal',
        value: this.previous().literal
      };
    }
    
    if (this.match(TokenType.STRING_LITERAL, TokenType.CHAR_LITERAL)) {
      return {
        type: 'Literal',
        value: this.previous().literal
      };
    }
    
    if (this.match(TokenType.TRUE)) {
      return {
        type: 'Literal',
        value: true
      };
    }
    
    if (this.match(TokenType.FALSE)) {
      return {
        type: 'Literal',
        value: false
      };
    }
    
    if (this.match(TokenType.IDENTIFIER)) {
      // Check if it's an array access
      if (this.match(TokenType.LEFT_BRACKET)) {
        const name = this.previous().lexeme;
        const indices = [];
        
        // First index
        indices.push(this.expression());
        
        // Check for second index
        if (this.match(TokenType.COMMA)) {
          indices.push(this.expression());
        }
        
        this.consume(TokenType.RIGHT_BRACKET, 'Expected "]" after array indices');
        
        return {
          type: 'ArrayAccess',
          name,
          indices
        };
      }
      
      return {
        type: 'Variable',
        name: this.previous().lexeme
      };
    }
    
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, 'Expected ")" after expression');
      
      return {
        type: 'GroupingExpression',
        expression: expr
      };
    }
    
    throw errors.createSyntaxError('Expected expression', this.peek().line, this.peek().column);
  }
}