export function definePseudocodeLanguage(monaco) {
  monaco.languages.register({ id: 'pseudocode' });
  monaco.languages.setMonarchTokensProvider('pseudocode', {
    defaultToken: 'invalid',

    keywords: [
      'CONSTANT', 'ARRAY', 'OF', 'INPUT', 'OUTPUT',
      'ELSE', 'ENDIF', 'CASE', 'OTHERWISE', 'ENDCASE',
      'STEP', 'NEXT', 'REPEAT', 'UNTIL', 'DO', 'ENDWHILE',
      'PROCEDURE', 'ENDPROCEDURE', 'FUNCTION', 'RETURNS', 'ENDFUNCTION',
      'CALL', 'OPENFILE', 'READFILE', 'WRITEFILE', 'CLOSEFILE', 'READ', 'WRITE'
    ],

    declareKeywords: ['DECLARE'],
    ifKeywords: ['IF', 'THEN'],
    forKeywords: ['FOR', 'TO', 'WHILE', 'ENDWHILE'],
    returnKeywords: ['RETURN'],
    
    functionKeywords: ['PROCEDURE', 'FUNCTION', 'CALL', 'ENDPROCEDURE'],

    typeKeywords: [
      'INTEGER', 'REAL', 'CHAR', 'STRING', 'BOOLEAN'
    ],

    booleans: [
      'TRUE', 'FALSE'
    ],

    operators: [
      '+', '-', '*', '/', '^', '=', '<', '<=', '>', '>=', '<>', '←'
    ],

    booleanOperators: [
      'AND', 'OR', 'NOT', 'DIV', 'MOD'
    ],

    symbols: /[=><!~?:&|+\-*\/\^%]+/,

    escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@declareKeywords': 'keyword.declare',
            '@ifKeywords': 'keyword.if',
            '@forKeywords': 'keyword.for',
            '@returnKeywords': 'keyword.return',
            '@functionKeywords': 'function',
            '@keywords': 'keyword',
            '@typeKeywords': 'type',
            '@booleans': 'boolean',
            '@booleanOperators': 'operator',
            '@default': 'variable'
          }
        }],

        { include: '@whitespace' },

        [/\{/, { token: 'delimiter.curly.1', bracket: '@open', next: '@bracketCurly1' }],
        [/\[/, { token: 'delimiter.bracket.1', bracket: '@open', next: '@bracketSquare1' }],
        [/\(/, { token: 'delimiter.parenthesis.1', bracket: '@open', next: '@bracketParenthesis1' }],
        
        [/[<>](?!@symbols)/, '@brackets'],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': ''
          }
        }],

        [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
        [/\d+/, 'number'],

        [/[;,.]/, 'delimiter'],

        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],

        [/'[^'\\]'/, 'string'],
        [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
        [/'/, 'string.invalid']
      ],

      bracketCurly1: [
        [/\{/, { token: 'delimiter.curly.2', bracket: '@open', next: '@bracketCurly2' }],
        [/\}/, { token: 'delimiter.curly.1', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketCurly2: [
        [/\{/, { token: 'delimiter.curly.3', bracket: '@open', next: '@bracketCurly3' }],
        [/\}/, { token: 'delimiter.curly.2', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketCurly3: [
        [/\{/, { token: 'delimiter.curly.1', bracket: '@open', next: '@bracketCurly1' }],
        [/\}/, { token: 'delimiter.curly.3', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],

      bracketSquare1: [
        [/\[/, { token: 'delimiter.bracket.2', bracket: '@open', next: '@bracketSquare2' }],
        [/\]/, { token: 'delimiter.bracket.1', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketSquare2: [
        [/\[/, { token: 'delimiter.bracket.3', bracket: '@open', next: '@bracketSquare3' }],
        [/\]/, { token: 'delimiter.bracket.2', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketSquare3: [
        [/\[/, { token: 'delimiter.bracket.1', bracket: '@open', next: '@bracketSquare1' }],
        [/\]/, { token: 'delimiter.bracket.3', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],

      bracketParenthesis1: [
        [/\(/, { token: 'delimiter.parenthesis.2', bracket: '@open', next: '@bracketParenthesis2' }],
        [/\)/, { token: 'delimiter.parenthesis.1', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketParenthesis2: [
        [/\(/, { token: 'delimiter.parenthesis.3', bracket: '@open', next: '@bracketParenthesis3' }],
        [/\)/, { token: 'delimiter.parenthesis.2', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],
      bracketParenthesis3: [
        [/\(/, { token: 'delimiter.parenthesis.1', bracket: '@open', next: '@bracketParenthesis1' }],
        [/\)/, { token: 'delimiter.parenthesis.3', bracket: '@close', next: '@pop' }],
        { include: '@root' }
      ],

      comment: [
        [/[^\/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        ["\\*/", 'comment', '@pop'],
        [/[\/*]/, 'comment']
      ],

      string: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
      ],

      whitespace: [
        [/[ \t\r\n]+/, 'white'],
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment']
      ]
    }
  });

  monaco.languages.setLanguageConfiguration('pseudocode', {
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/']
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: '\'', close: '\'' }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: '\'', close: '\'' }
    ]
  });
}

export function highlightPseudocodeInPre(preElement, theme = null) {
  if (!preElement || preElement.tagName !== 'PRE') return;
  
  const code = preElement.textContent;
  if (!code) return;
  
  if (!theme) {
    try {
      theme = window.monaco?.editor?._themes?.['pseudocode-custom-theme'] || Theme;
    } catch (e) {
      import('./monaco-theme.js').then(module => {
        theme = module.Theme;
        applyHighlighting(code, theme);
      });
      return;
    }
  }
  
  
  preElement.style.backgroundColor = theme.colors["editor.background"] || "#181A1F";
  preElement.style.color = theme.colors["editor.foreground"] || "#D4D4D4";
  
  function tokenize(codeText) {
    const tokens = [];
    
    const patterns = [
      { type: 'keyword', regex: /\b(CONSTANT|ARRAY|OF|INPUT|OUTPUT|ELSE|ENDIF|CASE|OTHERWISE|ENDCASE|STEP|NEXT|REPEAT|UNTIL|DO|ENDWHILE|PROCEDURE|ENDPROCEDURE|FUNCTION|RETURNS|ENDFUNCTION|CALL|OPENFILE|READFILE|WRITEFILE|CLOSEFILE|READ|WRITE|DECLARE|IF|THEN|FOR|TO|WHILE|ENDWHILE|RETURN)\b/g },
      { type: 'type', regex: /\b(INTEGER|REAL|CHAR|STRING|BOOLEAN)\b/g },
      { type: 'boolean', regex: /\b(TRUE|FALSE)\b/g },
      { type: 'operator', regex: /(\+|\-|\*|\/|\^|=|<|<=|>|>=|<>|←|AND|OR|NOT|DIV|MOD)/g },
      { type: 'number', regex: /\b\d+(\.\d+)?\b/g },
      { type: 'string', regex: /"([^"\\]|\\.)*"/g },
      { type: 'char', regex: /'([^'\\]|\\.)'/g },
      { type: 'comment', regex: /\/\/.*$/gm },
      { type: 'variable', regex: /\b[a-zA-Z_]\w*\b/g }
    ];
    
    const lines = codeText.split('\n');
    
    lines.forEach(line => {
      let lineTokens = [];
      
      const commentMatch = /\/\/(.*)$/.exec(line);
      if (commentMatch) {
        const commentIndex = commentMatch.index;
        if (commentIndex > 0) {
          const beforeComment = line.substring(0, commentIndex);
          processText(beforeComment, lineTokens);
        }
        
        const commentText = line.substring(commentIndex);
        lineTokens.push({
          type: 'comment',
          text: commentText
        });
      } else {
        processText(line, lineTokens);
      }
      
      tokens.push(lineTokens);
    });
    
    function processText(text, lineTokens) {
      let allMatches = [];
      
      patterns.forEach(pattern => {
        let match;
        pattern.regex.lastIndex = 0;
        
        while ((match = pattern.regex.exec(text)) !== null) {
          allMatches.push({
            type: pattern.type,
            index: match.index,
            length: match[0].length,
            text: match[0]
          });
        }
      });
      
      allMatches.sort((a, b) => a.index - b.index);
      
      const filteredMatches = [];
      let lastEnd = 0;
      
      allMatches.forEach(match => {
        if (match.index >= lastEnd) {
          filteredMatches.push(match);
          lastEnd = match.index + match.length;
        }
      });
      
      let currentIndex = 0;
      
      filteredMatches.forEach(match => {
        if (match.index > currentIndex) {
          lineTokens.push({
            type: 'text',
            text: text.substring(currentIndex, match.index)
          });
        }
        
        lineTokens.push({
          type: match.type,
          text: match.text
        });
        
        currentIndex = match.index + match.length;
      });
      
      if (currentIndex < text.length) {
        lineTokens.push({
          type: 'text',
          text: text.substring(currentIndex)
        });
      }
    }
    
    return tokens;
  }
  
  function getColorForToken(tokenType) {
    const tokenToThemeMap = {
      'keyword': 'keyword',
      'type': 'type',
      'boolean': 'boolean',
      'operator': 'operator',
      'number': 'number',
      'string': 'string',
      'char': 'string',
      'comment': 'comment',
      'variable': 'variable',
      'text': ''
    };
    
    const themeToken = tokenToThemeMap[tokenType] || '';
    
    for (const rule of theme.rules) {
      if (rule.token === themeToken) {
        return `#${rule.foreground}`;
      }
    }
    
    return theme.colors["editor.foreground"] || "#D4D4D4";
  }
  
  function applyHighlighting(codeText, themeObj) {
    const tokens = tokenize(codeText);
    
    preElement.innerHTML = '';
    
    tokens.forEach((lineTokens, index) => {
      const lineElement = document.createElement('div');
      
      lineTokens.forEach(token => {
        const span = document.createElement('span');
        span.textContent = token.text;
        span.style.color = getColorForToken(token.type);
        lineElement.appendChild(span);
      });
      
      preElement.appendChild(lineElement);
    });
  }
  
  applyHighlighting(code, theme);
}