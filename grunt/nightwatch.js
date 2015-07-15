var nightwatchConfig = function() {
  'use strict';
  var jarVersion = '2.47.1';
  return {
    options: {
      'standalone': true,
      'jar_path': 'test/selenium-server-standalone-' + jarVersion + '.jar',
      'jar_version': jarVersion,

      // 'selenium_host': 'ondemand.saucelabs.com',
      // 'selenium_port': '80'

      // 'selenium_host': 'bbpcc028.epfl.ch',
      // 'selenium_port': 4444,

      'src_folders': ['test/functional'],
      'output_folder': 'reports',

      'test_settings': {
        'default': {
          'screenshots': './screenshots',
          'launch_url': 'http://localhost:8333',

          'desiredCapabilities': {
            'browserName': 'chrome',
            'javascriptEnabled': true,
            'acceptSslCerts': true
          }
        },
        'firefox': {
          'desiredCapabilities': {
            'browserName': 'firefox',
            'javascriptEnabled': true,
            'acceptSslCerts': true
          }
        },
        'phantomjs': {
          'desiredCapabilities': {
            'browserName': 'phantomjs'
          }
        }
      },

    }
  };
};
module.exports = nightwatchConfig;
