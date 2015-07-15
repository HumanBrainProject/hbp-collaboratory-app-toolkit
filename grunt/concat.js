var concat = {
  options: {
    banner: '<%= banner %>',
    stripBanners: true
  },
  dist: {
    src: ['lib/**/*.js'],
    dest: 'dist/<%= pkg.name %>.js'
  }
};
module.exports = concat;
