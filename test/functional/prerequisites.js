'use strict';

/*global document,window,require,angular*/
module.exports = {
  'postMessage support': function(browser) {
    var result;
    browser.globals.retryAssertionTimeout = 1000;
    browser
      .url(browser.launch_url + '/api.html')
      .waitForElementVisible('body', 1000);
      browser.execute(function() {
        addEventListener('message', function(event) {
          var div = document.createElement('DIV');
          div.id = 'the-message';
          div.innerHTML = event.data;
          document.body.appendChild(div);
        }, false);
      })
      .frame('app')
      .waitForElementVisible('body', 1000)
      .execute(function() {
        window.parent.postMessage('someEvent', '*');
      })
      .frame(null)
      .waitForElementVisible('#the-message', 1000)
      .assert.containsText('#the-message', 'someEvent')
      .end();
  }
};
