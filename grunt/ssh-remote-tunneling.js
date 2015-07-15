'use strict';

// Establish a shh remote tunnel to the selenium server
module.exports = function(grunt) {
  grunt.registerTask('sshRemoteTunneling', function() {
    var done = this.async();
    var spawn = require('pty').spawn;
    var tunnel = spawn('ssh',
                       ['-R', '8333:localhost:8333', 'root@bbpcc028.epfl.ch'],
                       { pty: true }
                      );
    tunnel.on('data', function (data) {
      grunt.log.debug('stdout: ' + data);
    });
    done();
  });
};
