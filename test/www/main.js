/*global define*/

define(['hbp-collaboratory-app-toolkit.js'], function(tk) {
  document.getElementById('echo-btn').addEventListener('click', function(event) {
    event.preventDefault();
    tk.emit('echo', {ping: 'pong'})
    .then(function(result) {
      console.log('result', result);
    })
    .catch(function(err) {
      console.log('err', err);
    });
  }, false)
});
