// 在现有的 .eslintrc.js 文件中添加以下规则
module.exports = {
  extends: [
    'react-app', // Use the existing CRA config
    'react-app/jest',
    'prettier', // Add prettier integration
  ],
  plugins: [
    'prettier',
  ],
  rules: {
    // Basic rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // React rules
    'react/jsx-props-no-spreading': 'off',
    
    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // Import rules
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    
    // Prettier rules
    'prettier/prettier': 'off', // 禁用所有 prettier 规则
    // 或者只禁用逗号相关的规则
    // 'prettier/prettier': ['error', { 'trailingComma': 'none' }]
  },
};