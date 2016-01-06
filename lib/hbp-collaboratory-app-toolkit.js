/*global define,angular*/

(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function() {
      return factory(root);
    });
  } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.

      module.exports = factory(root);
  } else if (typeof angular === 'object') {
    // Define an Angular JS module
    angular.module('hbpCollaboratoryAppToolkit', [])
    .factory('hbpCollaboratoryAppToolkit', ['$window', function($window) {
      return factory($window);
    }]);
  } else {
    // Browser globals (root is window)
    root.hbpCollaboratoryAppToolkit = factory(root);
  }
}(this, function factory(window) {
  'use strict';
  var eventId = 0;
  var sentMessages = {};

  /**
   * @module hbpCollaboratoryAppToolkit
   */
  function AppToolkit() { }
  AppToolkit.prototype = {
    emit: emit,
    context: context
  };

  window.addEventListener('message', function(event) {
    if(!event.data.origin) {
      return;
    }
    if(!sentMessages[event.data.origin]) {
      return;
    }
    if (event.data.eventName === 'resolved') {
      sentMessages[event.data.origin](null, event.data.data);
    } else if (event.data.eventName === 'error'){
      sentMessages[event.data.origin](event.data.data);
    }
    sentMessages[event.data.origin] = null;
  });

  function emit(name, data, callback) {
    window.parent.postMessage({
      apiVersion: 1,
      eventName: name,
      data: data,
      ticket: ++eventId
    }, '*');
    sentMessages[eventId] = callback;
  }

  var currentContext;

  /**
   * @typedef HbpCollaboratoryContext
   * @type {object}
   * @property {string} mode - the current mode, either 'run' or 'edit'
   * @property {string} ctx - the UUID of the current context
   * @property {string} state - an application defined state string
   */


  /**
   * @callback hbpCollaboratoryContextCallback
   * @param {HbpError} error - an HbpError
   * @param {HbpCollaboratoryContext} context - the context informations
   */


   /**
    * @desc
    * Asynchronously retrieve the current HBP Collaboratory Context, including
    * the mode, the ctx UUID and the application state if any.
    * @function context
    * @param  [{hbpCollaboratoryContextCallback} callback] - receiver of the call
    * @static
    */
  function context(callback) {
    if (currentContext) {
      callback(null, currentContext);
    }
    var kill = setTimeout(function() {
      callback({
        type: 'TimeoutException',
        message: 'No context can be retrieved'
      }, null);
    }, 250);
    emit('context', {}, function(err, context) {
      clearTimeout(kill)
      if (err) {
        callback(err);
      } else {
        currentContext = context;
        callback(null, currentContext);
      }
    });
    return;
  }

  // Return a value to define the module export.
  // This example returns a functions, but the module
  // can return an object as the exported value.
  return new AppToolkit();
}));
