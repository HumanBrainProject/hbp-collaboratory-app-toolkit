var connectConfig = {
  functionalTest: {
    options: {
      port: 8333,
      hostname: 'localhost',
      base: ['dist', 'bower_components', 'test/www']
    }
  },
  dev: {
    options: {
      post: 8000,
      hostname: 'localhost',
      base: ['dist', 'bower_components', 'test/www'],
      keepalive: true
    }
  }
};
module.exports = connectConfig;
