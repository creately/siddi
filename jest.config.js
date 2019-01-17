module.exports = {
    rootDir: 'src',
    preset: 'ts-jest',
    testMatch: [ '**/__tests__/**/*.spec.ts' ],
    testEnvironment: 'node',
    coverageDirectory: '../coverage',
}
