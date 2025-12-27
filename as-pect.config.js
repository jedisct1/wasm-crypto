export default {
  entries: ["assembly/__tests__/**/*.spec.ts"],
  include: ["assembly/__tests__/**/*.include.ts"],
  disclude: [/node_modules/],
  async instantiate(memory, createImports, instantiate, binary) {
    let instance;
    const myImports = {
      env: { memory }
    };
    instance = instantiate(binary, createImports(myImports));
    return instance;
  },
  outputBinary: false,
};
