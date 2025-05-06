// Token types
export const TokenType = {
  // Keywords
  DECLARE: 'DECLARE',
  CONSTANT: 'CONSTANT',
  ARRAY: 'ARRAY',
  OF: 'OF',
  INPUT: 'INPUT',
  OUTPUT: 'OUTPUT',
  IF: 'IF',
  THEN: 'THEN',
  ELSE: 'ELSE',
  ENDIF: 'ENDIF',
  CASE: 'CASE',
  OF: 'OF',
  OTHERWISE: 'OTHERWISE',
  ENDCASE: 'ENDCASE',
  FOR: 'FOR',
  TO: 'TO',
  STEP: 'STEP',
  NEXT: 'NEXT',
  REPEAT: 'REPEAT',
  UNTIL: 'UNTIL',
  WHILE: 'WHILE',
  DO: 'DO',
  ENDWHILE: 'ENDWHILE',
  PROCEDURE: 'PROCEDURE',
  ENDPROCEDURE: 'ENDPROCEDURE',
  FUNCTION: 'FUNCTION',
  RETURNS: 'RETURNS',
  RETURN: 'RETURN',
  ENDFUNCTION: 'ENDFUNCTION',
  CALL: 'CALL',
  OPENFILE: 'OPENFILE',
  READFILE: 'READFILE',
  WRITEFILE: 'WRITEFILE',
  CLOSEFILE: 'CLOSEFILE',
  FOR: 'FOR',
  READ: 'READ',
  WRITE: 'WRITE',
  
  // Data types
  INTEGER: 'INTEGER',
  REAL: 'REAL',
  CHAR: 'CHAR',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  
  // Boolean literals
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  
  // Operators
  ASSIGN: 'ASSIGN', // ←
  PLUS: 'PLUS', // +
  MINUS: 'MINUS', // -
  MULTIPLY: 'MULTIPLY', // *
  DIVIDE: 'DIVIDE', // /
  POWER: 'POWER', // ^
  
  // Relational operators
  EQUAL: 'EQUAL', // =
  LESS: 'LESS', // <
  LESS_EQUAL: 'LESS_EQUAL', // <=
  GREATER: 'GREATER', // >
  GREATER_EQUAL: 'GREATER_EQUAL', // >=
  NOT_EQUAL: 'NOT_EQUAL', // <>
  
  // Boolean operators
  AND: 'AND',
  OR: 'OR',
  NOT: 'NOT',
  
  // Punctuation
  COLON: 'COLON', // :
  COMMA: 'COMMA', // ,
  LEFT_BRACKET: 'LEFT_BRACKET', // [
  RIGHT_BRACKET: 'RIGHT_BRACKET', // ]
  LEFT_PAREN: 'LEFT_PAREN', // (
  RIGHT_PAREN: 'RIGHT_PAREN', // )
  
  // Literals and identifiers
  IDENTIFIER: 'IDENTIFIER',
  INTEGER_LITERAL: 'INTEGER_LITERAL',
  REAL_LITERAL: 'REAL_LITERAL',
  CHAR_LITERAL: 'CHAR_LITERAL',
  STRING_LITERAL: 'STRING_LITERAL',
  
  // Special
  COMMENT: 'COMMENT',
  EOF: 'EOF'
};

// Keywords map for quick lookup
const KEYWORDS = {
  'DECLARE': TokenType.DECLARE,
  'CONSTANT': TokenType.CONSTANT,
  'ARRAY': TokenType.ARRAY,
  'OF': TokenType.OF,
  'INPUT': TokenType.INPUT,
  'OUTPUT': TokenType.OUTPUT,
  'IF': TokenType.IF,
  'THEN': TokenType.THEN,
  'ELSE': TokenType.ELSE,
  'ENDIF': TokenType.ENDIF,
  'CASE': TokenType.CASE,
  'OTHERWISE': TokenType.OTHERWISE,
  'ENDCASE': TokenType.ENDCASE,
  'FOR': TokenType.FOR,
  'TO': TokenType.TO,
  'STEP': TokenType.STEP,
  'NEXT': TokenType.NEXT,
  'REPEAT': TokenType.REPEAT,
  'UNTIL': TokenType.UNTIL,
  'WHILE': TokenType.WHILE,
  'DO': TokenType.DO,
  'ENDWHILE': TokenType.ENDWHILE,
  'PROCEDURE': TokenType.PROCEDURE,
  'ENDPROCEDURE': TokenType.ENDPROCEDURE,
  'FUNCTION': TokenType.FUNCTION,
  'RETURNS': TokenType.RETURNS,
  'RETURN': TokenType.RETURN,
  'ENDFUNCTION': TokenType.ENDFUNCTION,
  'CALL': TokenType.CALL,
  'OPENFILE': TokenType.OPENFILE,
  'READFILE': TokenType.READFILE,
  'WRITEFILE': TokenType.WRITEFILE,
  'CLOSEFILE': TokenType.CLOSEFILE,
  'READ': TokenType.READ,
  'WRITE': TokenType.WRITE,
  
  // Data types
  'INTEGER': TokenType.INTEGER,
  'REAL': TokenType.REAL,
  'CHAR': TokenType.CHAR,
  'STRING': TokenType.STRING,
  'BOOLEAN': TokenType.BOOLEAN,
  
  // Boolean literals
  'TRUE': TokenType.TRUE,
  'FALSE': TokenType.FALSE,
  
  // Boolean operators
  'AND': TokenType.AND,
  'OR': TokenType.OR,
  'NOT': TokenType.NOT,
  'DIV': TokenType.DIV,
  'MOD': TokenType.MOD
};

export class Tokenizer {
  constructor(source) {
    this.source = source;
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.column = 1;
  }

  tokenize() {
    while (!this.isAtEnd()) {
      // Start of the next token
      this.start = this.current;
      this.scanToken();
    }
    
    // Add EOF token
    this.tokens.push({
      type: TokenType.EOF,
      lexeme: '',
      line: this.line,
      column: this.column
    });
    
    return this.tokens;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c = this.advance();
    
    switch (c) {
      // Single-character tokens
      case '(': this.addToken(TokenType.LEFT_PAREN); break;
      case ')': this.addToken(TokenType.RIGHT_PAREN); break;
      case '[': this.addToken(TokenType.LEFT_BRACKET); break;
      case ']': this.addToken(TokenType.RIGHT_BRACKET); break;
      case ',': this.addToken(TokenType.COMMA); break;
      case '.': this.addToken(TokenType.DOT); break;
      case ':': this.addToken(TokenType.COLON); break;
      case '+': this.addToken(TokenType.PLUS); break;
      case '-': this.addToken(TokenType.MINUS); break;
      case '*': this.addToken(TokenType.MULTIPLY); break;
      case '^': this.addToken(TokenType.POWER); break;
      
      // Two-character tokens
      case '=':
        this.addToken(TokenType.EQUAL);
        break;
      case '<':
        if (this.match('=')) {
          this.addToken(TokenType.LESS_EQUAL);
        } else if (this.match('>')) {
          this.addToken(TokenType.NOT_EQUAL);
        } else {
          this.addToken(TokenType.LESS);
        }
        break;
      case '>':
        if (this.match('=')) {
          this.addToken(TokenType.GREATER_EQUAL);
        } else {
          this.addToken(TokenType.GREATER);
        }
        break;
      case '←':
      case '⟵': // Alternative arrow character
        this.addToken(TokenType.ASSIGN);
        break;
      
      // Whitespace
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace
        break;
      case '\n':
        this.line++;
        this.column = 1;
        break;
      
      // String literals
      case '"':
        this.string();
        break;
      case '\'': // Single quote for char literals
        this.char();
        break;
      
      // Comments
      case '/':
        if (this.match('/')) {
          // Comment goes until the end of the line
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
          // Skip the comment instead of adding it as a token
          // this.addToken(TokenType.COMMENT);
        } else {
          this.addToken(TokenType.DIVIDE);
        }
        break;
      
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          // Unrecognized character
          console.error(`Unexpected character: ${c} at line ${this.line}, column ${this.column}`);
        }
        break;
    }
  }

  advance() {
    const char = this.source.charAt(this.current);
    this.current++;
    this.column++;
    return char;
  }

  addToken(type, literal = null) {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push({
      type,
      lexeme: text,
      literal,
      line: this.line,
      column: this.column - text.length
    });
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) !== expected) return false;
    
    this.current++;
    this.column++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  string() {
    let value = '';
    
    // Consume characters until closing quote
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = 1;
      }
      value += this.advance();
    }
    
    // Unterminated string
    if (this.isAtEnd()) {
      console.error(`Unterminated string at line ${this.line}, column ${this.column}`);
      return;
    }
    
    // Consume the closing quote
    this.advance();
    
    // Add the string token
    this.addToken(TokenType.STRING_LITERAL, value);
  }

  char() {
    let value = '';
    
    // Consume the character
    if (!this.isAtEnd()) {
      value = this.advance();
    }
    
    // Expect closing quote
    if (this.isAtEnd() || this.peek() !== '\'') {
      console.error(`Unterminated character literal at line ${this.line}, column ${this.column}`);
      return;
    }
    
    // Consume the closing quote
    this.advance();
    
    // Add the character token
    this.addToken(TokenType.CHAR_LITERAL, value);
  }

  number() {
    let isReal = false;
    
    // Consume digits
    while (this.isDigit(this.peek())) {
      this.advance();
    }
    
    // Look for a decimal point
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      isReal = true;
      
      // Consume the decimal point
      this.advance();
      
      // Consume the fractional part
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }
    
    // Parse the number
    const value = parseFloat(this.source.substring(this.start, this.current));
    
    // Add the appropriate token
    if (isReal) {
      this.addToken(TokenType.REAL_LITERAL, value);
    } else {
      this.addToken(TokenType.INTEGER_LITERAL, Math.floor(value));
    }
  }

  identifier() {
    // Consume alphanumeric characters
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }
    
    // Get the identifier text
    const text = this.source.substring(this.start, this.current).toUpperCase();
    
    // Check if it's a keyword
    const type = KEYWORDS[text] || TokenType.IDENTIFIER;
    
    // Add the token
    this.addToken(type);
  }
  
  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
           (c >= 'A' && c <= 'Z') ||
           c === '_';
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }
}