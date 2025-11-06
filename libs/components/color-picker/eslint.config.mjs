import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: [
      'libs/components/color-picker/**/*.ts',
      'libs/components/color-picker/**/*.tsx',
      'libs/components/color-picker/**/*.js',
      'libs/components/color-picker/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/components/color-picker/**/*.ts',
      'libs/components/color-picker/**/*.tsx',
    ],
    rules: {},
  },
  {
    files: [
      'libs/components/color-picker/**/*.js',
      'libs/components/color-picker/**/*.jsx',
    ],
    rules: {},
  },
];
