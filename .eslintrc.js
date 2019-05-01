module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
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
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "globals": {
        "$": true,
        "it": true,
        "describe": true,
        "beforeEach": true,
        "afterEach": true,
        "chai": true,
        "jQuery": true,
        "chrome": true,
        "modal": true,
        "modalTimeout": true,
        "modalHTML": true,
        "Modal": true,
        "flashInterval": true,
        "currentScript": true
    }
};
