/*
  The following license only applies to min-require (roughly next 90 lines)
  the rest is GPLv3 and I can't relicense it.

  Copyright (c) 2014 Vu Nguyen <ng-vu@liti.ws>

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
(function (context) {
  var modules,
    funcs,
    stack;

  function reset() {
    modules = {};
    funcs = {};
    stack = [];
  }

  // define(id, function(require, module, exports))
  // or
  // define(id, [dep1, ...], function (module1, ...))
  function define(id, deps, callback) {
    if (typeof id !== 'string' || id === '') throw new Error('invalid module id ' + id);
    if (funcs[id]) throw new Error('duplicated module id ' + id);
    if (typeof deps === 'function') {
      funcs[id] = deps; // callback
      return;
    } 

    if (typeof callback !== 'function') throw new Error('invalid module function');

    funcs[id] = function (require, module, exports) {
      return callback.apply(this, deps.map(function (dep) {
        if (dep === 'exports') return exports;
        if (dep === 'require') return require;
        return require(dep);
      }));
    }
  }

  define.amd = {};

  function stubRequire(stub) {
    return function (id) {
        if (!stub.hasOwnProperty(id)) {
          throw new Error('Stub ' + id + ' not found!');
        } else {
          return stub[id];
        }
    };
  }

  // require(id, stub)
  function require(id, stub) {
    var m;
    if (!funcs[id]) throw new Error('module ' + id + ' is not defined');
    if (stub) {
      m = { id: id, exports: {} };
      m.exports = funcs[id](stubRequire(stub), m, m.exports) || m.exports;
      return m.exports;
    }
    if (modules[id]) return modules[id].exports;

    stack.push(id);
    m = modules[id] = { id: id, exports: {} };
    m.exports = funcs[id](require, m, m.exports) || m.exports;
    stack.pop();

    return m.exports;
  }

  reset();
  context.define = define;
  context.requireAndRun = require;
  context.reset = reset;
})(typeof window !== 'undefined' ? window : (typeof global === 'object' ? global : this));
/* END MIT LICENSE */
