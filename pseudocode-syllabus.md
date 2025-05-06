# Cambridge IGCSE Pseudocode Language Reference (0478)

This document consolidates **every specification detail** for the pseudocode language defined in the Cambridge IGCSE Computer Science (0478) syllabus (examinations 2026‒2028). It contains *nothing less and nothing more* than what the syllabus states.

---

## Table of Contents

1. [General Style](#general-style)
2. [Comments](#comments)
3. [Data Types & Literals](#data-types--literals)
4. [Identifiers](#identifiers)
5. [Declarations](#declarations)
   - Variables
   - Constants
   - Arrays
6. [Assignment](#assignment)
7. [Input & Output](#input--output)
8. [Operators & Expressions](#operators--expressions)
   - Arithmetic
   - Integer Division (DIV, MOD)
   - Logical Relational Operators
   - Boolean Operators
   - String Operations
   - Library Routines
9. [Selection](#selection)
   - IF Statements
   - CASE Statements
10. [Iteration](#iteration)
    - FOR Loops
    - REPEAT UNTIL Loops
    - WHILE DO Loops
11. [Procedures & Functions](#procedures--functions)
12. [File Handling](#file-handling)

---

## General Style

### Font

- All pseudocode appears in *Courier New* at a consistent size.

### Indentation

- 4 spaces indent **inside** a compound statement.
- Continuation lines: 2 spaces from margin (line numbers may cancel this).
- `THEN` and `ELSE` clauses of an `IF`, and each case in a `CASE`, are indented **2 spaces**.

### Case Conventions

- **Keywords** – UPPER CASE (`IF`, `REPEAT`, `PROCEDURE`).
- **Identifiers** – *PascalCase* (`NumberOfPlayers`).
- **Meta‑variables** – enclosed in angle brackets `< >`.

### Lines & Line Numbering

- Each statement line may be numbered.
- Wrapped continuation lines are **not** numbered.

---

## Comments

- Precede a comment with `//`. It continues to end of the line.
- Multi‑line comments repeat `//` on every line.
- Prefer comment lines *before* the code they explain; a short comment for a single line may trail it.

**Example**

```text
// This procedure swaps
// values of X and Y
PROCEDURE SWAP(X : INTEGER, Y : INTEGER)
    Temp ← X    // temporarily store X
    X ← Y
    Y ← Temp
ENDPROCEDURE
```

---

## Data Types & Literals

| Keyword   | Meaning                 | Literal Forms                                            |
| --------- | ----------------------- | -------------------------------------------------------- |
| `INTEGER` | Whole number            | `5`, `‑3`                                                |
| `REAL`    | Fractional capable      | `4.7`, `0.0`, `‑4.0` *(≥1 digit either side of decimal)* |
| `CHAR`    | Single character        | `'x'`, `'@'`                                             |
| `STRING`  | Zero or more characters | `"Hello"`, `""` (empty)                                  |
| `BOOLEAN` | `TRUE` or `FALSE`       | `TRUE`, `FALSE`                                          |

---

## Identifiers

- **PascalCase**, letters & digits only, start with a capital letter.
- No underscores, accents, or keywords.
- Case‑insensitive (`Countdown` = `CountDown`).
- Descriptive names encouraged; single letters allowed where conventional (`i`, `j`, `X`, `Y`).

---

## Declarations

### Variable Declaration

```text
DECLARE <Identifier> : <DataType>
```

*Example*

```text
DECLARE Counter : INTEGER
DECLARE TotalToPay : REAL
DECLARE GameOver : BOOLEAN
```

### Constant Declaration

```text
CONSTANT <Identifier> ← <LiteralValue>
```

- Only literals allowed on right‑hand side.

*Example*

```text
CONSTANT HourlyRate ← 6.50
CONSTANT DefaultText ← "N/A"
```

### Arrays

*Fixed‑length; 1‑D or 2‑D.*

**Declaration Syntax**

```text
DECLARE <Id> : ARRAY[<l>:<u>] OF <DataType>
DECLARE <Id> : ARRAY[<l1>:<u1>, <l2>:<u2>] OF <DataType>
```

- Lower bound should be stated (usually `1`).

*Examples*

```text
DECLARE StudentNames : ARRAY[1:30] OF STRING
DECLARE NoughtsAndCrosses : ARRAY[1:3, 1:3] OF CHAR
```

**Using Arrays**

```text
StudentNames[1] ← "Ali"
NoughtsAndCrosses[2,3] ← 'X'
```

- Populate ranges with a loop where appropriate.

---

## Assignment

- Operator: `←`

```text
<Identifier> ← <Expression>
```

*Example*

```text
Counter ← Counter + 1
TotalToPay ← NumberOfHours * HourlyRate
```

---

## Input & Output

```text
INPUT <Variable>
OUTPUT <Value1>, <Value2>, ...
```

*Examples*

```text
INPUT Answer
OUTPUT Score
OUTPUT "You have ", Lives, " lives left"
```

---

## Operators & Expressions

### Arithmetic Operators

`+` (add) `‑` (subtract) `*` (multiply) `/` (divide) `^` (power)

### Integer Division

- `DIV(x, y)` → quotient \* `MOD(x, y)` → remainder (both integers)

### Relational Operators (return `BOOLEAN`)

`=`  `<`  `<=`  `>`  `>=`  `<>`

### Boolean Operators

`AND` `OR` `NOT`

### String Operations

| Routine                       | Returns                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `LENGTH(s)`                   | *INTEGER* length of string `s`                                    |
| `LCASE(s)`                    | Lower‑case version of `s`                                         |
| `UCASE(s)`                    | Upper‑case version of `s`                                         |
| `SUBSTRING(s, start, length)` | Substring of `s` starting at `start` for `length` chars (1‑based) |

### Library Routines

- `ROUND(x, places)` – rounds `x` (REAL) to given decimal places.
- `RANDOM()` – random REAL in `[0, 1]` (inclusive).

---

## Selection

### IF Statement

```text
IF <Condition>
  THEN
    <Statements>
ENDIF

IF <Condition>
  THEN
    <Statements>
  ELSE
    <Statements>
ENDIF
```

- Nest additional `IF`s with further 2‑space indents.

### CASE Statement

```text
CASE OF <Identifier>
  <Value1> : <Statement>
  <Value2> : <Statement>
  ...
  OTHERWISE <Statement>   // optional, must be last
ENDCASE
```

- Cases are evaluated sequentially until one matches; remaining cases are skipped.

---

## Iteration

### Count‑Controlled FOR Loop

```text
FOR <Var> ← <Start> TO <End> [STEP <Increment>]
    <Statements>
NEXT <Var>
```

- `<Var>` is *INTEGER*; loop runs for inclusive range; negative increments allowed.

### Post‑Condition REPEAT UNTIL Loop

```text
REPEAT
    <Statements>
UNTIL <Condition>      // executes at least once
```

### Pre‑Condition WHILE DO Loop

```text
WHILE <Condition> DO
    <Statements>
ENDWHILE
```

- Statements may never execute if the initial condition is `FALSE`.

---

## Procedures & Functions

### Procedures

*Definition*

```text
PROCEDURE <Identifier>([Param1:Type, ...])
    <Statements>
ENDPROCEDURE
```

*Call*

```text
CALL <Identifier>([Arg1, Arg2, ...])
```

### Functions

*Definition*

```text
FUNCTION <Identifier>([Param1:Type, ...]) RETURNS <ReturnType>
    <Statements>
    RETURN <Value>
ENDFUNCTION
```

*Call (as part of an expression)*

```text
Result ← FunctionName(Arg1, Arg2) * 2
```

---

## File Handling

```text
OPENFILE <FileId> FOR READ | WRITE
READFILE <FileId>, <Variable>
WRITEFILE <FileId>, <Variable>
CLOSEFILE <FileId>
```

- `WRITE` mode creates/overwrites the file.
- Only one mode may be active per file at a time.

*Example – copy one line*

```text
DECLARE LineOfText : STRING
OPENFILE "FileA.txt" FOR READ
OPENFILE "FileB.txt" FOR WRITE
READFILE "FileA.txt", LineOfText
WRITEFILE "FileB.txt", LineOfText
CLOSEFILE "FileA.txt"
CLOSEFILE "FileB.txt"
```

---

### End of Reference

