const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        ...tsJestTransformCfg,
    },

    // ✅ Запускать только файлы .test.ts
    testMatch: [
        '**/__tests__/**/*.test.ts',
    ],

    // ✅ Игнорировать dist и utils папки
    testPathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/__tests__/.*/utils/',  // Игнорирует все папки utils внутри __tests__
    ],

    // ✅ Игнорировать dist при поиске модулей
    modulePathIgnorePatterns: [
        '<rootDir>/dist/'
    ],

    // ✅ Принудительный выход после завершения тестов
    forceExit: true,

    // ✅ Отключить предупреждение об открытых хэндлах
    detectOpenHandles: false,
};