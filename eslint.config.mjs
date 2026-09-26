import js from "@eslint/js";
import ts from "typescript-eslint";

export default ts.config(
    {
        ignores: [
            "**/dist/**",
            "**/public/**",
            "**/scripts/**",
            "**/node_modules/**",
            "frontend/**",
            "eslint.config.mjs",
            "jest.config.js",
            "jest.setup.js",
            "**/.temp/**",
        ],
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        files: ["src/**/*.ts", "tests/**/*.ts"],
        languageOptions: {
            globals: {
                exports: "writable",
                module: "writable",
                require: "writable",
                process: "writable",
                console: "writable",
                jest: "writable",
                describe: "writable",
                it: "writable",
                expect: "writable",
                beforeEach: "writable",
                afterEach: "writable",
                beforeAll: "writable",
                afterAll: "writable",
            },
            ecmaVersion: 2020,
            sourceType: "module",
        },
        rules: {
            camelcase: "error",
            "brace-style": ["error", "1tbs"],
            "comma-dangle": ["error", "never"],
            "comma-spacing": ["error", {
                before: false,
                after: true,
            }],
            "comma-style": ["error", "last"],
            "arrow-body-style": ["error", "as-needed"],
            "arrow-parens": ["error", "as-needed"],
            "arrow-spacing": "error",
            "no-var": "error",
            "prefer-template": "error",
            "prefer-const": "error",
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "no-useless-escape": "off",
        },
    },
);
