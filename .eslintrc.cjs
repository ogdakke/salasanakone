module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "plugin:react/recommended",
        "standard-with-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
    ],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
        rules: {},
    },
    plugins: ["react", "@typescript-eslint"],
    rules: {
        "react/prop-types": "off",
        "react/react-in-jsx-scope": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
    },
};
