module.exports = {
  default: {
    require: ['./hooks/hooks.js', './features/stepDefinitions/**/*.js'],
    format: ['progress'],
    paths: ['./features/**/*.feature'],
    publish: false,
  },
};
