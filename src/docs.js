import { highlightPseudocodeInPre } from './monaco-lang.js';

const ChevronRightIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`;
const BookIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;

export function initDocs(appContainer) {
  appContainer.innerHTML = `
    <div class="flex flex-col h-screen bg-[#24262B] p-2 text-white">
      <div class="mb-2 flex items-center justify-between mx-2">
        <span class="text-base font-normal">ViPE Pseudocode Documentation</span>
        <a href="/" class="bg-[#3b3e48] text-white rounded-lg px-2 py-1 cursor-pointer inline-block">Editor</a>
      </div>
      <div class="flex flex-row flex-grow overflow-hidden gap-2">
        <div class="w-[20%] bg-[#181A1F] rounded-lg shadow-md overflow-auto">
          <div class="p-3 pb-0">
            <div class="text-sm font-medium text-[#cfcfcf]">CONTENTS</div>
          </div>
          <div id="toc" class="p-2 space-y-1">
            ${generateTOCItem('intro', 'Introduction')}
            ${generateTOCItem('comments', 'Comments')}
            ${generateTOCItem('data-types-literals', 'Data Types & Literals')}
            ${generateTOCItem('variables', 'Variables')}
            ${generateTOCItem('constants', 'Constants')}
            ${generateTOCItem('arrays', 'Arrays')}
            ${generateTOCItem('assignments', 'Assignments')}
            ${generateTOCItem('input-output', 'Input & Output')}
            ${generateTOCItem('operators-expressions', 'Operators & Expressions')}
            ${generateTOCItem('selection', 'Selection')}
            ${generateTOCItem('iteration', 'Iteration')}
            ${generateTOCItem('procedures-functions', 'Procedures & Functions')}
            ${generateTOCItem('file-handling', 'File Handling')}
            ${generateTOCItem('example', 'Example Program')}
          </div>
        </div>
        <div class="w-[80%] overflow-auto">
          <div class="flex flex-col gap-2">
            ${sectionIntro()}
            ${sectionComments()}
            ${sectionDataTypesLiterals()}
            ${sectionVariables()}
            ${sectionConstants()}
            ${sectionArrays()}
            ${sectionAssignments()}
            ${sectionInputOutput()}
            ${sectionOperatorsExpressions()}
            ${sectionSelection()}
            ${sectionIteration()}
            ${sectionProceduresFunctions()}
            ${sectionFileHandling()}
            ${sectionExample()}
          </div>
        </div>
      </div>
      <!-- Mobile Warning -->
      <div class="p-6 md:hidden fixed inset-0 bg-[#181A1F] z-50 flex items-center justify-center">
        <div class="bg-[#0F0F10] p-6 rounded-lg border border-[#1F1F22] max-w-md">
          <h1 class="text-2xl font-normal text-center mb-3">
            Sorry, but this documentation isn't optimized for small screens.
          </h1>
          <p class="text-[#999999] text-center">Please use a larger device for the best experience.</p>
        </div>
      </div>
    </div>
  `;
  
  setTimeout(() => {
    const preElements = document.querySelectorAll('pre');
    preElements.forEach(pre => {
      highlightPseudocodeInPre(pre);
    });
  }, 0);
}

function generateTOCItem(id, title) {
  return `
    <div class="toc-item p-2 rounded hover:bg-[#252830] cursor-pointer flex items-center" onclick="document.getElementById('section-${id}').scrollIntoView({behavior: 'smooth'})">
      ${BookIcon}
      <span class="ml-2 text-sm">${title}</span>
    </div>
  `;
}

function sectionIntro() {
  return `
  <div id="section-intro" class="bg-[#181A1F] rounded-lg p-5 shadow-md">
    <h2 class="text-xl font-semibold mb-4 text-blue-400 flex items-center">
      ${ChevronRightIcon}
      <span class="ml-1">Introduction to Pseudocode</span>
    </h2>
    <p>Pseudocode is not a real coding language. It is a model language to display the logic that you want to code. Before coding, coders plan out their code in Pseudocode (or using flowcharts). This documentation aims to help you learn the CIE Pseudocode (for iGCSE Computer Science) and its syntax.</p>
  </div>
  `;
}

function sectionComments() {
  return `
  <div id="section-comments" class="bg-[#181A1F] rounded-lg p-5 shadow-md">
    <h2 class="text-xl font-semibold mb-4 flex items-center text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Comments</span>
    </h2>
    <p>Comments start with <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">//</code> and continue to the end of the line. Place comments before code blocks or right at the end of a statement.<br>In your exams (specifically the last question of Paper 2), the examiner will expect to see comments detailing your logic and reasoning behind your code.</p>
    <pre class="bg-[#272a34] p-2 mt-2 border border-[#353843] rounded-md font-mono overflow-auto">// This is a comment</div>
  `;
}

function sectionDataTypesLiterals() {
  return `
  <div id="section-data-types-literals" class="bg-[#181A1F] rounded-lg p-5 shadow-md">
    <h2 class="text-xl font-semibold mb-4 flex items-center text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Data Types & Literals</span>
    </h2>
    <p>Below are the data types you need to know in Pseudocode and some examples for each one. A type is a kind of data that can be used in your program. For example, <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">INTEGER</code> is a data type that represents whole numbers, like 5, -3, 0, etc.</p>
    <div class="mt-2 overflow-hidden rounded-lg border border-[#3A3D50]">
      <div class="grid grid-cols-3 text-left bg-[#1d2028] border-b border-[#3A3D50]">
        <div class="py-2 px-4 font-medium border-r border-[#3A3D50]">Type</div>
        <div class="py-2 px-4 font-medium border-r border-[#3A3D50]">What it is</div>
        <div class="py-2 px-4 font-medium">Examples</div>
      </div>
      <div class="grid grid-cols-3 border-b border-[#3A3D50]">
        <div class="py-2 px-4 border-r border-[#3A3D50]">INTEGER</div>
        <div class="py-2 px-4 border-r border-[#3A3D50]">Whole number</div>
        <div class="py-2 px-4">5, -3</div>
      </div>
      <div class="grid grid-cols-3 border-b border-[#3A3D50]">
        <div class="py-2 px-4 border-r border-[#3A3D50]">REAL</div>
        <div class="py-2 px-4 border-r border-[#3A3D50]">Decimal number</div>
        <div class="py-2 px-4">4.7, 0.0, -4.0</div>
      </div>
      <div class="grid grid-cols-3 border-b border-[#3A3D50]">
        <div class="py-2 px-4 border-r border-[#3A3D50]">CHAR</div>
        <div class="py-2 px-4 border-r border-[#3A3D50]">Single character</div>
        <div class="py-2 px-4">'x', '@'</div>
      </div>
      <div class="grid grid-cols-3 border-b border-[#3A3D50]">
        <div class="py-2 px-4 border-r border-[#3A3D50]">STRING</div>
        <div class="py-2 px-4 border-r border-[#3A3D50]">Text</div>
        <div class="py-2 px-4">"Hello", ""</div>
      </div>
      <div class="grid grid-cols-3">
        <div class="py-2 px-4 border-r border-[#3A3D50]">BOOLEAN</div>
        <div class="py-2 px-4 border-r border-[#3A3D50]">TRUE or FALSE</div>
        <div class="py-2 px-4">TRUE, FALSE</div>
      </div>
    </div>
  </div>
  `;
}

function sectionVariables() {
  return `
  <div id="section-variables" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Variables</span>
    </h2>
    
    <p>Variables allow you to store values that might change during program execution. However, to create a variable you must declare a variable with a proper data type (from above) before using it. This is the format you must use to declare variables:</p>
    <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">DECLARE &lt;Identifier&gt; : &lt;DataType&gt;</pre>
    <p>Example: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">DECLARE Counter : INTEGER</code></p>
  </div>
  `;
}

function sectionConstants() {
  return `
  <div id="section-constants" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Constants</span>
    </h2>

    <p>Constants are values that don't change throughout the program. They are basically the same as variables except they cannot be change. They must be assigned a value at declaration and cannot be modified later. This is the format you must use to set constants:</p>
    <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">CONSTANT &lt;Identifier&gt; ← &lt;Value&gt;</pre>
    <p>Example: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">CONSTANT HourlyRate ← 6.50</code></p>
  </div>
  `;
}

function sectionArrays() {
  return `
  <div id="section-arrays" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Arrays</span>
    </h2>
    
    <p>Arrays store multiple values of the same data type. In some languages they aren't necessarily the same type but in Pseudocode they are. You specify the index range with lower (l) and upper (u) bounds. Arrays can be one or multi-dimensional. A multi-dimensional array is just an array with multiple array inside. This is the format you must use to declare arrays (first line is 1D, second line is 2D):</p>
    <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">DECLARE &lt;Id&gt; : ARRAY[&lt;l&gt;:&lt;u&gt;] OF &lt;DataType&gt;
DECLARE &lt;Id&gt; : ARRAY[&lt;l1&gt;:&lt;u1&gt;, &lt;l2&gt;:&lt;u2&gt;] OF &lt;DataType&gt;</pre>
    <p class="!mb-1">Examples: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">DECLARE StudentNames : ARRAY[1:30] OF STRING</code></p>
    <p><span class="opacity-0 pointer-events-none">Examples:</span> <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">DECLARE Grid : ARRAY[1:3,1:3] OF CHAR</code></p>
  </div>
  `;
}

function sectionAssignments() {
  return `
  <div id="section-assignments" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Assigning stuff</span>
    </h2>

    <p>The assignment operator (←) assigns values to variables. In the editor, you can easily get the symbol by typing "=" or "<-" and after you click space, it will autocorrect to "←" The expression on the right is evaluated and stored in the variable on the left. This is the format you must use to assign variables:</p>
    <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">&lt;Identifier&gt; ← &lt;Expression&gt;</pre>
    <p>Example: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">Counter ← Counter + 1</code></p>
  </div>
  `;
}

function sectionInputOutput() {
  return `
  <div id="section-input-output" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold mb-4 flex items-center text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Input & Output</span>
    </h2>
    <p>Input and output statements are essential for interacting with the user. The INPUT statement gets data from the user and stores it in a variable, while the OUTPUT statement displays information to the user.</p>
    
    <div class="flex flex-col gap-4">
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Input</h3>
        <p class="mb-2">The INPUT statement reads a value entered by the user and stores it in a variable. The variable must be declared before using it with INPUT.</p>
        <pre class="bg-[#272a34] p-2 mb-2 border border-[#353843] rounded-md font-mono">INPUT &lt;Variable&gt;</pre>
        <p>Example: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">INPUT userName</code></p>
      </div>
      
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Output</h3>
        <p class="mb-2">The OUTPUT statement displays values or messages to the user. You can output text, variables, or expressions, and combine them using the + operator.</p>
        <pre class="bg-[#272a34] p-2 mb-2 border border-[#353843] rounded-md font-mono">OUTPUT &lt;Value1&gt;, &lt;Value2&gt;, ...</pre>
        <p>Example: <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">OUTPUT "Hello, " + userName</code></p>
      </div>
    </div>
  </div>
  `;
}

function sectionOperatorsExpressions() {
  return `
  <div id="section-operators-expressions" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold mb-4 flex items-center text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Operators & Expressions</span>
    </h2>
    <p>Operators allow you to perform various operations on values and variables. Expressions are combinations of values, variables, and operators that can be evaluated to produce a result.</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Arithmetic</h3>
        <p class="mb-2">These operators perform basic math calculations on numbers:</p>
        <ul class="list-disc pl-6">
          <li>Addition ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x + y</code> )</li>
          <li>Subtraction ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x - y</code> )</li>
          <li>Multiplication ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x * y</code> )</li>
          <li>Division ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x / y</code> )</li>
          <li>Exponentiation ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x ^ 2</code> )</li>
        </ul>
      </div>
      
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Integer Division</h3>
        <p class="mb-2">Functions for working with integer division and remainders.</p>
        <ul class="list-disc pl-6">
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>DIV(int, int)</code></strong>: Division quotient ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">DIV(7, 2)</code> gives 3 )</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>MOD(int, int)</code></strong>: Remainder ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">MOD(7, 2)</code> gives 1 )</li>
        </ul>
      </div>
      
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Relational</h3>
        <p class="mb-2">These operators compare values using certain conditions and return a boolean result (TRUE or FALSE).</p>
        <ul class="list-disc pl-6">
          <li>Equal to ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x = y</code> )</li>
          <li>Not equal to ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x <> y</code> )</li>
          <li>Less than ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x < y</code> )</li>
          <li>Less than or equal to ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x <= y</code> )</li>
          <li>Greater than ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x > y</code> )</li>
          <li>Greater than or equal to ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x >= y</code> )</li>
        </ul>
      </div>
      
      <div class="bg-[#1D1F26] rounded-lg p-4">
        <h3 class="text-lg font-medium mb-2">Boolean</h3>
        <p class="mb-2">These operators work with boolean values (TRUE and FALSE) for logical operations. They are often used in IF statements.</p>
        <ul class="list-disc pl-6">
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>AND</code></strong>: Logical AND ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x > 0 AND y < 10</code> )</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>OR</code></strong>: Logical OR ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">x = 1 OR x = 2</code> )</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>NOT</code></strong>: Logical NOT ( <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">NOT (x > y)</code> )</li>
        </ul>
      </div>
      
      <div class="bg-[#1D1F26] rounded-lg p-4 col-span-full md:col-span-2">
        <h3 class="text-lg font-medium mb-2">String Operations</h3>
        <p class="mb-2">Functions for manipulating text strings and getting data based on the strings.</p>
        <ul class="list-disc pl-6">
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>LENGTH(string)</code></strong>: Returns the number of characters in a string. For example, <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">LENGTH("Hello")</code> gives 5</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>LCASE(string)</code></strong>: Converts a string to lowercase. For example, <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">LCASE("Hello")</code> gives "hello"</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>UCASE(string)</code></strong>: Converts a string to uppercase. For example, <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">UCASE("Hello")</code> gives "HELLO"</li>
          <li><strong class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded"><code>SUBSTRING(string, start, length)</code></strong>: Extracts a portion of a string. For example, <code class="bg-[#272a34] border border-[#353843] px-1 py-0.5 rounded">SUBSTRING("Hello", 2, 3)</code> gives "ell"</li>
        </ul>
      </div>
    </div>
  </div>
  `;
}

function sectionSelection() {
  return `
  <div id="section-selection" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Selection</span>
    </h2>
    <p>Selection statements allow your program to make decisions and execute different code based on conditions. Pseudocode has IF statements for simple conditions and CASE statements for multiple value matching. In the two boxes below, you can see what each does and how they are formatted.</p>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">IF Statements</h3>
      <p class="mb-2">IF statements check a condition and execute different code blocks depending on whether the condition is TRUE or FALSE. You can use the simple form with just THEN and ENDIF, or include an ELSE branch for alternative actions. In other languages like python, there is 'elif', but in Pseudocode you gotta do it the hard way.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">IF condition THEN
    statements
ENDIF

IF condition THEN
    statements
ELSE
    statements
ENDIF</pre>
      <p class="my-2">Below is an example of an IF statement which gives a different greeting depending on the person's name:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">IF name = "Jacob" THEN
    OUTPUT "Get out of here. I dont like you"
ELSE
    IF name = "Varun" THEN
        OUTPUT "Hello Varun, you're amazing! How are you?"
    ELSE
        OUTPUT "Hello, " + name + "! Who are you?"
    ENDIF
ENDIF</pre>
    </div>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">CASE Statements</h3>
      <p class="mb-2">CASE statements are useful when you need to compare a variable against multiple possible values. Each value has its associated code block, and you can include an OTHERWISE clause to handle any value not explicitly listed.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">CASE OF variable
  value1 : statements
  value2 : statements
  OTHERWISE statements
ENDCASE</pre>
      <p class="my-2">Below is an example of a CASE statement depending on the value of a variable:</p>
<pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">CASE grade OF
    "A": OUTPUT "Excellent!"
    "B": OUTPUT "Good job!"
    "C": OUTPUT "Passed"
    OTHERWISE: OUTPUT "Try again"
ENDCASE</pre>
    </div>
  </div>
  `;
}

function sectionIteration() {
  return `
  <div id="section-iteration" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Iteration</span>
    </h2>
    <p>Iteration (looping) allows you to repeat a block of code multiple times. Pseudocode supports three types of loops: FOR loops for counting, REPEAT UNTIL loops, and WHILE loops (you can guess what each of them do).</p>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">FOR loop</h3>
      <p class="mb-2">FOR loops are used when you know in advance how many times you want to repeat a block of code. The loop counter automatically increments (or decrements if using a negative STEP) with each iteration.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">FOR i ← start TO end [STEP step]
    statements
NEXT i</pre>
      <p class="my-2">Below is an example of a FOR loop that prints the numbers 1 to 5:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">FOR counter ← 1 TO 5
    OUTPUT counter
NEXT counter</pre>
    </div>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">REPEAT UNTIL loop</h3>
      <p class="mb-2">REPEAT UNTIL loops execute a block of code at least once, and then continue repeating until a specified condition becomes TRUE. This is useful when you want the code to run at least once regardless of the condition.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">REPEAT
    statements
UNTIL condition</pre>
      <p class="my-2">Below is an example of a REPEAT UNTIL loop that validates user input:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">REPEAT
    OUTPUT "Enter a positive number:"
    INPUT number
UNTIL number > 0</pre>
    </div>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">WHILE loop</h3>
      <p class="mb-2">WHILE DO loops check a condition first, and only execute the code block if the condition is TRUE. If the condition is initially FALSE, the code block will not run at all.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">WHILE condition DO
    statements
ENDWHILE</pre>
      <p class="my-2">Below is an example of a WHILE loop that calculates a sum:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">sum ← 0
x ← 1
WHILE x <= 10 DO
    sum ← sum + x
    x ← x + 1
ENDWHILE</pre>
    </div>
  </div>
  `;
}

function sectionProceduresFunctions() {
  return `
  <div id="section-procedures-functions" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Procedures & Functions</span>
    </h2>
    <p>Procedures and functions help organize code into reusable blocks so you don't have to keep repeating code. You can add parameters to both which can affect the actions the function/procedure takes. Procedures and functions are basically the same, except that procedures don't return values, while functions do.</p>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">Procedures</h3>
      <p class="mb-2">Procedures are blocks of code that can be called from other parts of your program. They can accept parameters (inputs) but don't return values. Use the CALL statement to execute a procedure.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">PROCEDURE Name(params)
    statements
ENDPROCEDURE

CALL Name(args)</pre>
      <p class="my-2">Below is an example of a procedure that prints a greeting message with the given name:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">PROCEDURE Greet(name)
    OUTPUT "Hello, " + name + "! Welcome to our program."
ENDPROCEDURE

CALL Greet("Varun")   // Outputs: Hello, Varun! Welcome to our program.
CALL Greet("Jacob")   // Outputs: Hello, Jacob! Welcome to our program.</pre>
    </div>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">Functions</h3>
      <p class="mb-2">Functions are similar to procedures but return a value. They're useful for calculations or operations that produce a result. Assign the function's return value to a variable using the assignment operator.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">FUNCTION Name(params) RETURNS Type
    statements
    RETURN value
ENDFUNCTION

Result ← Name(args)</pre>
      <p class="my-2">Below is an example of a function that calculates the average of two numbers:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">FUNCTION Average(num1, num2) RETURNS REAL
    RETURN (num1 + num2) / 2
ENDFUNCTION

score1 ← 85
score2 ← 91
avgScore ← Average(score1, score2)  // avgScore will be 88.0
OUTPUT "The average score is: " + avgScore</pre>
    </div>
  </div>
  `;
}

function sectionFileHandling() {
  return `
  <div id="section-file-handling" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">File Handling</span>
    </h2>
    <p>File handling allows your program to read from and write to files on the computer. This is essential for storing data permanently or processing large amounts of information.</p>
    
    <div class="bg-[#1D1F26] rounded-lg p-4">
      <h3 class="text-lg font-medium mb-2">File Operations</h3>
      <p class="mb-2">Pseudocode provides simple commands for opening, reading from, writing to, and closing files. The OPENFILE command specifies whether you want to READ from or WRITE to the file.</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">OPENFILE fileId FOR READ | WRITE
READFILE fileId, variable
WRITEFILE fileId, variable
CLOSEFILE fileId</pre>
      
      <p class="my-2">Below is an example of copying one line from FileA.txt to FileB.txt:</p>
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono">DECLARE line : STRING
OPENFILE "FileA.txt" FOR READ
OPENFILE "FileB.txt" FOR WRITE
READFILE "FileA.txt", line
WRITEFILE "FileB.txt", line
CLOSEFILE "FileA.txt"
CLOSEFILE "FileB.txt"</pre>
    </div>
  </div>
  `;
}

function sectionExample() {
  return `
  <div id="section-example" class="bg-[#181A1F] rounded-lg p-5 shadow-md space-y-4">
    <h2 class="text-xl font-semibold flex items-center mb-4 text-blue-400">
      ${ChevronRightIcon}
      <span class="ml-1">Example Program</span>
    </h2>
    <p>The following example demonstrates many of the pseudocode features covered in this documentation. This program calculates the factorial of a number entered by the user, showing the use of variables, input/output, selection, and iteration.</p>
    
      <pre class="bg-[#272a34] p-2 border border-[#353843] rounded-md font-mono overflow-auto">// Calculate factorial
DECLARE num : INTEGER
DECLARE factorial : INTEGER

OUTPUT "Enter a number: "
INPUT num

IF num < 0 THEN
    OUTPUT "Factorial is not defined for negative numbers"
ELSE
    factorial ← 1
    FOR i ← 1 TO num
        factorial ← factorial * i
    NEXT i
    OUTPUT "Factorial of " + num + " is " + factorial
ENDIF</pre>
  </div>
  `;
}
