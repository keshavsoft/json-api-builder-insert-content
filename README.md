# json-api-builder-insert-content

[![npm version](https://img.shields.io/npm/v/json-api-builder-insert-content?color=cb3837&style=flat-square)](https://www.npmjs.com/package/json-api-builder-insert-content)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg?style=flat-square)](package.json)
[![GitHub Repository](https://img.shields.io/badge/GitHub-keshavsoft%2Fjson-api-builder-insert-content-181717.svg?style=flat-square&logo=github)](https://github.com/keshavsoft/json-api-builder-insert-content)
[![Documentation](https://img.shields.io/badge/docs-live_portal-amber.svg?style=flat-square)](https://keshavsoft.github.io/json-api-builder-insert-content/)

> **Stage 3 of 8**: ESTree AST Template Compilation & Router Content Insertion via Astring

Part of the modular **[JSON API Builder](https://github.com/keshavsoft/json-api-builder-orchestrator)** ecosystem by [KeshavSoft](https://github.com/keshavsoft).

---

## 1. The Core Story: Why AST & Why Astring?

### The Problem With String-Based Code Generation
Traditional code generation tools treat code as raw strings (using string concatenation, regex templates, or template literals like `\`import ...\``). This naive approach inevitably suffers from critical flaws:
1. **Escaped Quote Nightmares**: Inconsistent single, double, and backtick quotes break syntax easily.
2. **Formatting Drift**: Indentation, comma placement, and newline inconsistencies lead to malformed files.
3. **Fragile Templates**: A single missing semicolon or misplaced character fails silently at generation time and crashes at runtime.

### Why We Ditched Babel AST (`@babel/generator`)
When exploring Abstract Syntax Tree (AST) approaches, the industry default is often Babel (`@babel/core`, `@babel/generator`, `@babel/traverse`). However, Babel introduces massive architectural friction:
- **Massive Dependency Footprint**: Babel pulls in dozens of packages totaling **over 50 MB** of `node_modules` overhead.
- **Complex Non-Standard AST Dialect**: Babel deviates from the official ESTree specification with proprietary node types (`StringLiteral` vs `Literal`, custom directives, etc.).
- **Significant Performance Penalty**: Babel was designed to transpile entire legacy applications, making it orders of magnitude slower than necessary for straightforward AST code generation.

### The Solution: Astring (`astring`)
Instead of bloated toolchains or fragile string concatenation, **`json-api-builder-insert-content`** adopts **[`astring`](https://github.com/davidbonnet/astring)**:
- **Tiny (~10 KB)**: Completely self-contained with **zero external dependencies**.
- **Official ESTree Compliance**: Directly understands standard ESTree AST JSON nodes (`Program`, `ImportDeclaration`, `VariableDeclaration`, `ExportDefaultDeclaration`).
- **Blazing Performance**: Generates clean, production-grade JavaScript **up to 50x faster** than `@babel/generator`.
- **Guaranteed Syntax**: If the AST JSON is valid, the resulting JavaScript code is **100% syntactically valid** by definition.

---

## 2. Architecture & Pipeline Position

```text
[0. Validate] ──▶ [1. Folders] ──▶ [2. Files] ──▶ [3. Insert Content (Astring)] ──▶ [4. Hook Routes]
                                                                                            │
[8. Finished App] ◀── [7. Verify] ◀── [6. Endpoints] ◀── [5. Create App] ◀──────────────────┘
```

**Stage 3's Single Responsibility**:
Takes the empty target files touched in Stage 2, reads the AST blueprint from `source-of-truth/routes.estree.json`, compiles it via `astring.generate()`, and writes production-ready Hono router code into each route file.

---

## 3. How It Works in Code

### The Input: ESTree Blueprint (`source-of-truth/routes.estree.json`)
The template is stored directly as an official ESTree JSON AST:

```json
{
  "type": "Program",
  "sourceType": "module",
  "body": [
    {
      "type": "ImportDeclaration",
      "specifiers": [
        {
          "type": "ImportSpecifier",
          "imported": { "type": "Identifier", "name": "Hono" },
          "local": { "type": "Identifier", "name": "Hono" }
        }
      ],
      "source": { "type": "Literal", "value": "hono" }
    },
    {
      "type": "VariableDeclaration",
      "kind": "const",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": { "type": "Identifier", "name": "app" },
          "init": {
            "type": "NewExpression",
            "callee": { "type": "Identifier", "name": "Hono" },
            "arguments": []
          }
        }
      ]
    },
    {
      "type": "ExportDefaultDeclaration",
      "declaration": { "type": "Identifier", "name": "app" }
    }
  ]
}
```

### The Engine: Pure Astring Compilation
The engine reads the AST definition and transforms it in one single, reliable call:

```javascript
import fs from "node:fs";
import { generate } from "astring";

// 1. Read authentic ESTree AST JSON
const ast = JSON.parse(fs.readFileSync(definitionPath, "utf8"));

// 2. Compile AST directly into pristine JavaScript
const javascript = generate(ast);

// 3. Write target route module
fs.writeFileSync(targetFilePath, javascript, "utf8");
```

### The Output: Pristine Generated JavaScript
Every scaffolded `routes.js` file instantly receives:

```javascript
import { Hono } from "hono";

const app = new Hono();

export default app;
```

---

## 4. Installation & Usage

```bash
npm install json-api-builder-insert-content
```

```javascript
import { insertContent } from "json-api-builder-insert-content";

const result = insertContent({
    clientRoot: "./my-project",
    outputRoot: "./my-project/output"
});

console.log("Stage 3 completed: AST templates compiled via Astring.");
```

---

## 5. Verification & Tests

To run the built-in syntax checks and unit tests:
```bash
npm run check
npm test
```
