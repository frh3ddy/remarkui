module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": ["react-hooks"],
    "settings": {
        "import/resolver": {
            "node": {
                "moduleDirectory": ["node_modules", "src/"]
            }
        }
    },
    "rules": {
        "no-alert": ["error"],
        "react/jsx-filename-extension": 0,
        "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
        "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
        semi: ["error", "never"],
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        'import/no-cycle': 0,
        "no-restricted-imports": [
            "error",
            {
            "paths": [{
                "name": "styled-components",
                "message": "Please import from styled-components/macro."
            }],
            "patterns": [
                "!styled-components/macro"
            ]
            }
        ]
    },
};
