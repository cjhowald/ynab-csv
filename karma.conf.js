module.exports = function(config) {
  //noinspection Eslint
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "src/**/*.ts" }
    ],
    preprocessors: {
      "src/**/*.ts": ["karma-typescript"]
    },
    reporters: ["progress", "karma-typescript", 'jasmine-diff'],
    browsers: ["Chrome"]
  });
};