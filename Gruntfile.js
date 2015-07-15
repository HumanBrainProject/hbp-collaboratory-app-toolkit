/*global module:false*/
'use strict';

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  // grunt.loadNpmTasks('intern');

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    'pkg': grunt.file.readJSON('package.json'),
    'banner': '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    'eslint': require('./grunt/eslint'),
    'concat': require('./grunt/concat'),
    'uglify': require('./grunt/uglify'),
    'watch': require('./grunt/watch'),
    'nightwatch': require('./grunt/nightwatch')(grunt),
    'connect': require('./grunt/connect'),
    'bump': require('./grunt/bump'),
    'exec': require('./grunt/exec')
  });

  require('./grunt/ssh-remote-tunneling')(grunt);

  // Default task.
  grunt.registerTask('default', ['build', 'eslint', 'localFunctionalTest']);
  grunt.registerTask('localFunctionalTest', ['sshRemoteTunneling', 'connect:functionalTest', 'nightwatch:phantomjs']);
  grunt.registerTask('build', ['concat', 'uglify']);
  grunt.registerTask('ci', require('./grunt/ci')(grunt));
  grunt.registerTask('serve', ['build', 'connect:functionalTest', 'watch']);
};
