module.exports = {
    preset: "ts-jest",
    setupFiles: ["./jest.setup.js"],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.jest.json",
            },
        ],
    },
};
