var watch = {
  gruntfile: {
    files: ['Gruntfile.js', 'grunt/*.js'],
    tasks: ['newer:eslint'],
    reload: true
  },
  functional: {
    files: ['test/functional/*.js'],
    tasks: ['nightwatch']
  },
  libTest: {
    files: ['lib/**/*.js', 'test/unit/**/*.js'],
    tasks: ['newer:eslint']
  }
};
module.exports = watch;
