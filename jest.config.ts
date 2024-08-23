import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import tsconfigBaseJson from './tsconfig.base.json';

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
  modulePaths: [tsconfigBaseJson.compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(tsconfigBaseJson.compilerOptions.paths),
};

export default config;
