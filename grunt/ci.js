'use strict';

module.exports = function(grunt) {
  return function ciTask(target) {
    var tasks = [
      // 'test',
      'build',
      'eslint',
      'localFunctionalTest'
    ];

    var done = this.async();
    var exec = require('child_process').exec;
    // Inspect the log message to see if we need to release
    exec('git log --format=%B --no-merges -n 1', function(error, stdout){
      if (error) {
        grunt.log.error('Error checking commit message', error);
      }
      var matches = stdout.match(/release (patch|minor|major|prerelease|prepatch|preminor|premajor|git)/);
      if (process.env.CI && matches && matches[1]) {
        grunt.log.writeln('New release detected: ' + matches[1]);
        tasks.unshift('bump:' + matches[1] + ':bump-only');
        tasks.push('exec:changelog', 'exec:gitRelease');
      }
      grunt.task.run(tasks);
      done();
    });
  };
};
