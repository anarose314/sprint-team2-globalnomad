const COMMIT_TYPES = [
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

const COMMITLINT_CONFIG = {
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(`^(${COMMIT_TYPES.join('|')}):\\s(.+)$`, 'u'),
      headerCorrespondence: ['type', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', COMMIT_TYPES],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 72],
  },
};

export default COMMITLINT_CONFIG;
