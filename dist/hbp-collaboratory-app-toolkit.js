/*! hbp-collaboratory-app-toolkit - v0.0.1 - 2016-01-06
* Copyright (c) 2016 EPFL; Licensed  */
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

/**
 * Parses an escaped url query string into key-value pairs.
 *
 * This function comes from AngularJS
 * https://github.com/angular/angular.js/blob/986647a968858121c1de472fc4913221dc8d339a/src/Angular.js
 *
 * LICENSE
 *
 *  The MIT License
 *
 *  Copyright (c) 2010-2016 Google, Inc. http://angularjs.org
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 * @param {string} keyValue
 * @returns {Object.<string,boolean|Array>}
 */
  function parseKeyValue(keyValue) {
    var obj = {};
    var parts = (keyValue || '').split('&');
    for (var i = 0; i < parts.length; i++) {
      keyValue = parts[i];
      var splitPoint, key, val;
      if (keyValue) {
        key = keyValue = keyValue.replace(/\+/g,'%20');
        splitPoint = keyValue.indexOf('=');
        if (splitPoint !== -1) {
          key = keyValue.substring(0, splitPoint);
          val = keyValue.substring(splitPoint + 1);
        }
        key = tryDecodeURIComponent(key);
        if (key !== undefined) {
          val = val !== undefined ? tryDecodeURIComponent(val) : true;
          if (!hasOwnProperty.call(obj, key)) {
            obj[key] = val;
          } else if (typeof obj[key] === 'array') {
            obj[key].push(val);
          } else {
            obj[key] = [obj[key],val];
          }
        }
      }
    }
    return obj;
  }

  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (e) {
      $log.debug('invalid value', value);
    }
  }



  function context() {
    var parts = location.href.split('?');
    if (parts.length < 1) {
      throw new Error('Missing Context');
    }
    var pString = parts[parts.length-1];
    obj = parseKeyValue(pString)
    return {
      ctx: obj.ctx,
      state: obj.ctxstate
    };
  }

  // Return a value to define the module export.
  // This example returns a functions, but the module
  // can return an object as the exported value.
  return new AppToolkit();
}));
