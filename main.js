console.log(`TypeScript compiler version: ${ts.version}`);
async function load(filename) {
    console.log(`Loading ${filename}`)
    const response = await fetch(filename);
    if (response.status !== 200) {
        throw new Error(`Couldn't load typescript file: ${filename}, error ${response.status}`);
    }
    const typescriptCode = await response.text();
    let compilerOptions = {target: ts.ScriptTarget.ES2020, noImplicitAny:true, noEmitOnError:true, inlineSourceMap:true, inlineSources: true};
    const compiledCode = ts.transpile(typescriptCode, compilerOptions, filename);
    let tsMain = new Function(compiledCode);
    tsMain();
}

function jsMain() {
    load('./main.ts');
}

jsMain();