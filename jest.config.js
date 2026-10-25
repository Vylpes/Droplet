module.exports = {
    preset: "ts-jest",
    setupFiles: ["./jest.setup.js"],
    testPathIgnorePatterns: ["/node_modules/", "/frontend/", "/shared/"],
    moduleNameMapper: {
        "^uuid$": "<rootDir>/tests/__mocks__/uuid.ts",
    },
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.jest.json",
            },
        ],
    },
};
