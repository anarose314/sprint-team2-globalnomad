const commitTypes = [
  '🎉 Init',
  '✨ Feat',
  '🐛 Fix',
  '♻️ Refactor',
  '🔧 Chore',
  '🎨 Style',
  '📝 Docs',
  '🚚 Rename',
  '🔥 Remove',
  '🔀 Merge',
  '🚀 Deploy',
];

const commitlintConfig = {
  parserPreset: {
    parserOpts: {
      headerPattern:
        /^([\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]\s[A-Z][a-z]+):\s(.+)$/u,
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', commitTypes],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 72],
  },
};

export default commitlintConfig;
