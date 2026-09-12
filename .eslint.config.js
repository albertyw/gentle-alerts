import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

let globalVars = globals.browser;
globalVars = {...globalVars, ...{
  "context": true,
  "describe": true,
  "it": true,
  "before": true,
  "after": true,
  "beforeEach": true,
  "afterEach": true,
  "beforeAll": true,
  "afterAll": true,
  "process": true,

  "chrome": true,
  "module": true,
  "require": true,
  "modal": true,
}};

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    "rules": {
      "indent": [
        "error",
        2
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "quotes": [
        "error",
        "double",
      ],
      "semi": [
        "error",
        "always"
      ],
      // chai assertions such as `expect(x).to.be.undefined` are bare expressions
      "@typescript-eslint/no-unused-expressions": "off",
    },
    "languageOptions": {
      "ecmaVersion": 2022,
      "sourceType": "module",
      "globals": globalVars,
    },
  },
  {
    // Build output: webpack compiles the TypeScript sources into these exact
    // filenames inside the extension directory
    "ignores": [
      "**/gentle-alerts.min.js",
      "gentle-alerts/bootstrap.js",
      "gentle-alerts/options.js",
    ],
  },
);
