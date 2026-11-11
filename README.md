# json-api-builder-insert-content

[![npm version](https://img.shields.io/npm/v/json-api-builder-insert-content?color=cb3837&style=flat-square)](https://www.npmjs.com/package/json-api-builder-insert-content)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg?style=flat-square)](package.json)
[![GitHub Repository](https://img.shields.io/badge/GitHub-keshavsoft%2Fjson-api-builder-insert-content-181717.svg?style=flat-square&logo=github)](https://github.com/keshavsoft/json-api-builder-insert-content)
[![Documentation](https://img.shields.io/badge/docs-live_portal-amber.svg?style=flat-square)](https://keshavsoft.github.io/json-api-builder-insert-content/)

> **Stage 3 of 8**: Stage 3: ESTree AST Template Compilation & Router Content Insertion

Part of the modular **[JSON API Builder](https://github.com/keshavsoft/json-api-builder-orchestrator)** ecosystem by [KeshavSoft](https://github.com/keshavsoft).

---

## The Story

Transforms ESTree-compatible AST JSON template definitions into clean JavaScript code and inserts them into target route files using Astring.

### The Problem It Solves
String interpolation or regex replacement in code generators creates syntax errors, unescaped characters, and fragile templates that break on formatting changes.

### The Solution
Uses authentic ESTree Abstract Syntax Trees as the source template format. Astring converts the AST into clean JavaScript and writes formatted Hono router boilerplate into each route file.

---

## Architecture & Pipeline Position

```
[1. Folders] ──▶ [2. Files] ──▶ [3. Content] ──▶ [4. Hook Routes]
                                                         │
[8. Orchestrator] ◀── [7. Validate] ◀── [6. Endpoints] ◀── [5. App]
```

**This repository implements Stage 3 in isolation.** It can be used independently in custom build workflows or composed automatically via `json-api-builder`.

---

## Installation

```bash
npm install json-api-builder-insert-content
```

---

## Quick Start

```js
import { insertContent } from "json-api-builder-insert-content";

const result = insertContent({
    clientRoot: "./my-project",
    outputRoot: "./my-project/output"
});

console.log("Inserted router boilerplate into files.");
```

---

## Input Specification

routes.estree.json containing valid ESTree AST nodes.

```json
{
  "type": "Program",
  "body": [
    {
      "type": "ImportDeclaration",
      "specifiers": [{ "type": "ImportSpecifier", "imported": { "name": "Hono" } }],
      "source": { "type": "Literal", "value": "hono" }
    },
    {
      "type": "VariableDeclaration",
      "declarations": [{ "id": { "name": "app" }, "init": { "type": "NewExpression", "callee": { "name": "Hono" } } }],
      "kind": "const"
    },
    {
      "type": "ExportDefaultDeclaration",
      "declaration": { "type": "Identifier", "name": "app" }
    }
  ]
}
```

---

## Output Transformation

Formatted, idiomatic JavaScript router boilerplate ready for route composition.

```text
import { Hono } from "hono";

const app = new Hono();

export default app;
```

---

## API Reference

### `insertContent`

Accepts an options object with the following configuration:

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `clientRoot` | `string` | `process.cwd()` | Root path of the client project. |
| `outputRoot` | `string` | `path.join(clientRoot, 'output')` | Target output directory. |
| `templatesRoot` | `string` | `input/source-of-truth/templates` | Directory containing ESTree AST JSON template files. |

---

## Sibling Pipeline Packages

| Stage | Package | Description |
| :---: | :--- | :--- |
| **01** | [json-api-builder-create-folders](https://github.com/keshavsoft/json-api-builder-create-folders) | Directory hierarchy scaffolding |
| **02** | [json-api-builder-create-files](https://github.com/keshavsoft/json-api-builder-create-files) | Non-destructive placeholder file creation |
| **03** | [json-api-builder-insert-content](https://github.com/keshavsoft/json-api-builder-insert-content) | ESTree template to JavaScript insertion |
| **04** | [json-api-builder-alter-content](https://github.com/keshavsoft/json-api-builder-alter-content) | Hierarchical route hooking & AST imports |
| **05** | [json-api-builder-create-app](https://github.com/keshavsoft/json-api-builder-create-app) | Root app.js assembly & server runtime |
| **06** | [json-api-builder-create-endpoints](https://github.com/keshavsoft/json-api-builder-create-endpoints) | CRUD endpoints & local JSON file sync |
| **07** | [json-api-builder-validation](https://github.com/keshavsoft/json-api-builder-validation) | Specification linting & artifact checks |
| **08** | [json-api-builder](https://github.com/keshavsoft/json-api-builder-orchestrator) | Master orchestrator coordinating all stages |

---

## Development & Testing

```bash
# Install dependencies
npm install

# Run automated tests
npm test

# Run syntax check
npm run check

# Prepublish verification
npm run prepublishOnly
```

---

## License

[MIT](LICENSE) © 2026 [KeshavSoft](https://github.com/keshavsoft)
