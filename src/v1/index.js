import fs from "node:fs";
import path from "node:path";
import startFunc from "json-traversal-core";
import { generate } from "astring";


function resolvePaths(options = {}) {
    const clientRoot = path.resolve(options.clientRoot ?? process.cwd());
    const inputRoot = path.resolve(options.inputRoot ?? path.join(clientRoot, "input"));
    const sourceRoot = path.resolve(options.sourceRoot ?? path.join(inputRoot, "source-of-truth"));
    const outputRoot = path.resolve(options.outputRoot ?? path.join(clientRoot, "output"));
    const treePath = path.resolve(options.treePath ?? path.join(sourceRoot, "tree.json"));

    if (!fs.existsSync(treePath)) {
        throw new Error(`Tree definition not found: ${treePath}`);
    }

    const tree = JSON.parse(fs.readFileSync(treePath, "utf8"));
    return { clientRoot, inputRoot, sourceRoot, outputRoot, tree, treePath };
}

function targetPath(outputRoot, key, parentPath) {
    const parentParts = parentPath === "" ? [] : parentPath.split(".");
    return path.join(outputRoot, ...parentParts, key);
}

function formatJavaScript(source) {
    return source
        .replace(/import\s+\{([^}]+)\}\s+from/g, (_, names) => `import { ${names.trim()} } from`)
        .replace(/;\n(?=import\b)/g, ";\n")
        .replace(/;\n(?=(?:const|let|var)\b)/g, ";\n\n")
        .replace(/;\n(?=export\b)/g, ";\n\n")
        .replace(/\n{3,}/g, "\n\n")
        .trimEnd() + "\n";
}

export function insertContent(options = {}) {
    const { sourceRoot, outputRoot, tree } = resolvePaths(options);

    startFunc(tree, (key, value, parentPath) => {
        if (typeof value === "string") {
            const definitionPath = path.resolve(sourceRoot, value);
            if (!fs.existsSync(definitionPath)) {
                throw new Error(`AST definition not found: ${definitionPath}`);
            }

            const ast = JSON.parse(fs.readFileSync(definitionPath, "utf8"));
            const javascript = formatJavaScript(generate(ast));
            const filePath = targetPath(outputRoot, key, parentPath);

            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, javascript, "utf8");
        }
    });

    return { outputRoot };
}
