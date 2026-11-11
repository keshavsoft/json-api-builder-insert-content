# @keshavsoft/json-api-builder-insert-content

Insert content stage extracted from the existing `json-api-builder` V9 implementation.

## Source

The implementation is located at `src/v1/index.js`. It is copied/extracted from the existing V7/V9 implementation without redesigning its logic.

## Install

```bash
npm install @keshavsoft/json-api-builder-insert-content
```

## Use

```js
import { insertContent } from "@keshavsoft/json-api-builder-insert-content";
```

Pass the same options/configuration object used by the original V9 stage.

## Development

```bash
npm install
npm test
npm run check
npm pack --dry-run
```

## Publish

```bash
npm login
npm publish --access public
```

This package is prepared locally only. It has not been published to npm or pushed to GitHub.
