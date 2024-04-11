const globals = require("globals");
const js = require("@eslint/js");

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

module.exports = [
  js.configs.recommended,
  {
    "rules": {
      "indent": [
        "error",
        4
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
    },
    "languageOptions": {
      "ecmaVersion": 2022,
      "sourceType": "module",
      "globals": globalVars,
    },
  },
  {
    "ignores": [
      "**/gentle-alerts.min.js",
    ],
  },
];
