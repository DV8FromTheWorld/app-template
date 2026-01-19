const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const appRoot = path.resolve(projectRoot, '../app');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo (merge with defaults)
config.watchFolders = [...(config.watchFolders || []), monorepoRoot];

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(appRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Add platform-specific extensions (merge with defaults)
// .native.tsx files will be resolved before .tsx on React Native
const nativeExtensions = ['native.tsx', 'native.ts', 'native.js', 'native.jsx'];
config.resolver.sourceExts = [
  ...nativeExtensions,
  ...(config.resolver.sourceExts || []).filter((ext) => !nativeExtensions.includes(ext)),
];

module.exports = config;
