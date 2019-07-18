module.exports = {
  /**
   * A set of globs passed to the glob package that qualify typescript files for testing.
   */
  include: ["assembly/__tests__/**/*.spec.ts"],
  /**
   * A set of globs passed to the glob package that quality files to be added to each test.
   */
  add: ["assembly/__tests__/**/*.include.ts"],
  /**
   * All the compiler flags needed for this test suite. Make sure that a binary file is output.
   */
  flags: {
    "--validate": [],
    "--debug": [],
    // "--measure": [],
    /** This is required. Do not change this. */
    "--binaryFile": ["output.wasm"],
  },
  /**
   * A set of regexp that will disclude source files from testing.
   */
  disclude: [],
  /**
   * Add your required AssemblyScript imports here.
   */
  imports: {},
  /**
   * Add a custom reporter here if you want one
   */
  // reporter: new CustomReporter(),
};
