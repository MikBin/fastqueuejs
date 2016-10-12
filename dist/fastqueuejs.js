(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.FastQueueJs = factory());
}(this, (function () { 'use strict';

  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();





  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();







  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

















  var set = function set(object, property, value, receiver) {
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent !== null) {
        set(parent, property, value, receiver);
      }
    } else if ("value" in desc && desc.writable) {
      desc.value = value;
    } else {
      var setter = desc.set;

      if (setter !== undefined) {
        setter.call(receiver, value);
      }
    }

    return value;
  };















  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Class Definitions
   * ------------------------------------------------------------------------
   */

  var FastQueueJs = function () {
      var FastQueueJs = function () {
          function FastQueueJs() {
              var sizeLimit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1024;
              classCallCheck(this, FastQueueJs);

              this._limit = ~~sizeLimit;
              this._queue = [];
              this._first = 0;
          }

          createClass(FastQueueJs, [{
              key: "enqueue",
              value: function enqueue(value) {
                  this._queue.push(value);

                  return this;
              }
          }, {
              key: "dequeue",
              value: function dequeue() {
                  /**should throw if empty? */
                  var out = void 0;
                  if (!this.isEmpty()) {
                      out = this._queue[this._first];
                      this._first++;
                      if (this._first === this._limit) {
                          this.removeDequeued();
                      }
                  }

                  return out;
              }
          }, {
              key: "removeDequeued",
              value: function removeDequeued() {
                  var l = this._queue.length,
                      i = this._first,
                      queue = this._queue;
                  while (i > 0) {
                      l--;
                      i--;
                      queue[i] = queue[l];
                  }

                  queue.length = queue.length - this._first;
                  this._first = 0;
              }
          }, {
              key: "enqueueMany",
              value: function enqueueMany(list) {
                  if (list.length) {
                      var _queue;

                      (_queue = this._queue).push.apply(_queue, toConsumableArray(list));
                  }
                  return this;
              }
          }, {
              key: "dequeueMany",
              value: function dequeueMany(howMany) {
                  var l = this.getLength();

                  if (howMany <= l) {
                      var first = this._first;
                      this._first += howMany;
                      var out = this._queue.slice(first, first + howMany);
                      if (this._first >= this._limit) {
                          this.removeDequeued();
                      }

                      return out;
                  } else {
                      return this.flush();
                  }
              }
          }, {
              key: "isEmpty",
              value: function isEmpty() {
                  return this.getLength() === 0;
              }
          }, {
              key: "flush",
              value: function flush() {
                  if (this.getLength() === 0) {
                      return [];
                  }
                  this.removeDequeued();
                  var queue = this._queue;
                  this._queue = [];
                  this._first = 0;
                  return queue;
              }
          }, {
              key: "peek",
              value: function peek() {
                  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                  if (n === 1) {
                      return this._queue[this._first];
                  } else {

                      var max = this._first + n;
                      if (max >= this._queue.length) {
                          return this._queue.slice(this._first);
                      }

                      return this._queue.slice(this._first, this._first + n);
                  }
              }
          }, {
              key: "last",
              value: function last() {
                  var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

                  if (n === 1) {
                      return this._queue[this._queue.length - 1];
                  } else {
                      if (n < this.getLength()) {
                          return this._queue.slice(this._queue.length - n);
                      }
                      return this._queue.slice(this._first);
                  }
              }
          }, {
              key: "getLength",
              value: function getLength() {
                  return this._queue.length - this._first;
              }
          }, {
              key: "setLimit",
              value: function setLimit(sizeLimit) {
                  this._limit = !isNaN(sizeLimit) ? ~~sizeLimit : 1024;
              }
          }]);
          return FastQueueJs;
      }();

      
      return FastQueueJs;
  }();

  return FastQueueJs;

})));

//# sourceMappingURL=fastqueuejs.js.map