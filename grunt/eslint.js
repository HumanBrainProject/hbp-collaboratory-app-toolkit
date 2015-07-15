var eslint = {
  options: {
    format: process.env.CI ? 'junit' : 'stylish',
    outputFile: process.env.CI && 'reports/eslint-unit.xml'
  },
  target: ['Gruntfile.js', 'grunt/*.js', 'lib/**/*.js', 'test/**/*.js']
};
module.exports = eslint;
