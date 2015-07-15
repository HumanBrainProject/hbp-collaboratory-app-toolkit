'use strict';

/*global window,require*/
module.exports = {
  'Load in the global environment': function(browser) {
    browser
      .url(browser.launch_url + '/global.html')
      .waitForElementVisible('body', 1000)
      .execute(function() {
        return !!window.hbpCollaboratoryAppToolkit;
      }, [], function(result) {
        this.assert.ok(result.value, 'hbpCollaboratoryAppToolkit is not declared');
      })
      .end();
  },
  'Load as an AMD module': function(browser) {
    browser
      .url(browser.launch_url + '/amd.html')
      .waitForElementVisible('body', 1000)
      .timeoutsAsyncScript(1000)
      .executeAsync(function(done) {
        require(['hbp-collaboratory-app-toolkit'], function(tk) {
          done({
            firstArgPresence: !!tk,
            globalPresence: !!window.hbpCollaboratoryAppToolkit
          });
        });
      }, [], function(result) {
        this.verify.ok(!result.value.globalPresence);
        this.assert.ok(result.value.firstArgPresence);
      })
      .end();
  },
  'Load as an AngularJS module': function(browser) {
    browser.globals.retryAssertionTimeout = 5000;
    browser
      .url(browser.launch_url + '/angular.html')
      .waitForElementVisible('#angular-injected', 5000)
      .assert.containsText('#angular-injected', 'OK')
      .end();
  }
};
