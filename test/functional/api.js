'use strict';

/*global document,window,require,angular*/
module.exports = {
  'api.emit use postMessage API': function(browser) {
    browser.globals.retryAssertionTimeout = 5000;
    browser
      .url(browser.launch_url + '/api.html')
      .waitForElementVisible('body', 1000)
      .execute(echoMessage)
      .frame('app')
      .timeoutsAsyncScript(5000)
      .executeAsync(function(done) {
        require(['hbp-collaboratory-app-toolkit'], function(tk) {
          tk.emit('someEvent', {some: 'data'}, function(err, data) {
            done(err || data);
          });
        });
      }, [], function(result) {
        this.verify.ok(result.value.data.some === 'data', 'invalid response: ' + JSON.stringify(result.value));
      })
      .frame(null)
      .execute(function() {
        return document.body.innerHTML;
      })
      .waitForElementVisible('#message-1', 1000)
      .assert.containsText('#message-1 .event-name', 'someEvent')
      .assert.containsText('#message-1 .event-data', '{"some":"data"}')
      .end();
  },
  'api.emit using angular': function(browser) {
    browser.globals.retryAssertionTimeout = 5000;
    browser
      .url(browser.launch_url + '/angular-main.html')
      .waitForElementVisible('body', 1000)
      .execute(echoMessage)
      .frame('app')
      .timeoutsAsyncScript(5000)
      .executeAsync(function(done) {
        var elt = document.createElement('DIV');
        document.body.appendChild(elt);
        angular.module('testApp1', ['hbpCollaboratoryAppToolkit'])
        .run(function(hbpCollaboratoryAppToolkit) {
          hbpCollaboratoryAppToolkit.emit('someEvent', {some: 'data'}, function(err, data) {
            done(err || data);
          })
        });
        angular.bootstrap(elt, ['testApp1']);
      }, [], function(result) {
        this.verify.ok(result.value.data.some === 'data', 'invalid response' + JSON.stringify(result.value));
      })
      .frame(null)
      .waitForElementVisible('#message-1', 1000)
      .assert.containsText('#message-1 .event-name', 'someEvent')
      .assert.containsText('#message-1 .event-data', '{"some":"data"}')
      .frame('app')
      .timeoutsAsyncScript(5000)
      .executeAsync(function(done) {
        var elt = document.createElement('DIV');
        document.body.appendChild(elt);
        angular.module('testApp2', ['hbpCollaboratoryAppToolkit'])
        .run(function(hbpCollaboratoryAppToolkit) {
          hbpCollaboratoryAppToolkit.emit('doError', {some: 'data'}, function(err, data) {
            done(err || data);
          });
        });
        angular.bootstrap(elt, ['testApp2']);
      }, [], function(result) {
        this.verify.ok(result.value.name === 'ERROR', 'invalid response' + JSON.stringify(result.value));
      })
      .end();
  },

  'api.context(callback) contains the context': function(browser) {
    browser
      .url(browser.launch_url + '/api.html')
      .waitForElementVisible('body', 1000)
      .execute(function() {
        window.addEventListener('message', function(event) {
          if (event.data && event.data.eventName === 'context') {
            document.getElementById('app').contentWindow.postMessage({
              apiVersion: 1,
              eventName: 'resolved',
              origin: event.data.ticket,
              data: {
                ctx: '123a-456aaaa-bbbbbbbbbbbb',
                state: 'lorem ipsum',
                mode: 'run'
              }
            }, '*');
          }
        });
      })
      .frame('app')
      .timeoutsAsyncScript(1000)
      .executeAsync(function(done) {
        require(['hbp-collaboratory-app-toolkit'], function(tk) {
          try {
            tk.context(function(err, context) {
              done(err || context);
            })
          } catch(ex) {
            done(ex);
          }
        });
      }, [], function(result) {
        this.verify.ok(result.value.ctx === '123a-456aaaa-bbbbbbbbbbbb', 'invalid ctx' + JSON.stringify(result.value));
        this.verify.ok(result.value.state === 'lorem ipsum', 'invalid state' + JSON.stringify(result.value));
        this.verify.ok(result.value.mode === 'run', 'invalid mode' + JSON.stringify(result.value));
      })
  }
};

function echoMessage(){
  window.addEventListener('message', function(event) {
    if (event.data.eventName === 'doError') {
      document.getElementById('app').contentWindow.postMessage({
        apiVersion: 1,
        eventName: 'error',
        origin: event.data.ticket,
        data: {name: 'ERROR'}
      }, '*');
    } else {
      event.data['originEventName'] = event.data.eventName
      document.getElementById('app').contentWindow.postMessage({
        apiVersion: 1,
        eventName: 'resolved',
        origin: event.data.ticket,
        data: event.data
      }, '*');
    }
  });
}
