import { EventEmitter } from 'eventemitter3';

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var DEFAULT_TARGET_ORIGIN = '*'; // By default timeout is 60 seconds

var DEFAULT_TIMEOUT_MILLISECONDS = 240000;
var JSON_RPC_VERSION = '2.0';
/**
 * We return a random number between the 0 and the maximum safe integer so that we always generate a unique identifier,
 * across all communication channels.
 */

function getUniqueId() {
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}
/**
 * Represents an error in an RPC returned from the event source. Always contains a code and a reason. The message
 * is constructed from both.
 */


var RpcError = /*#__PURE__*/function (_Error) {
  _inheritsLoose(RpcError, _Error);

  function RpcError(code, reason) {
    var _this;

    _this = _Error.call(this, code + ": " + reason) || this;
    _this.isRpcError = true;
    _this.code = code;
    _this.reason = reason;
    return _this;
  }

  return RpcError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * This is the primary artifact of this library.
 */

var IFrameEthereumProvider = /*#__PURE__*/function (_EventEmitter) {
  _inheritsLoose(IFrameEthereumProvider, _EventEmitter);

  function IFrameEthereumProvider(_temp) {
    var _this2;

    var _ref = _temp === void 0 ? {} : _temp,
        _ref$targetOrigin = _ref.targetOrigin,
        targetOrigin = _ref$targetOrigin === void 0 ? DEFAULT_TARGET_ORIGIN : _ref$targetOrigin,
        _ref$timeoutMilliseco = _ref.timeoutMilliseconds,
        timeoutMilliseconds = _ref$timeoutMilliseco === void 0 ? DEFAULT_TIMEOUT_MILLISECONDS : _ref$timeoutMilliseco,
        _ref$eventSource = _ref.eventSource,
        eventSource = _ref$eventSource === void 0 ? window : _ref$eventSource,
        _ref$eventTarget = _ref.eventTarget,
        eventTarget = _ref$eventTarget === void 0 ? window.parent : _ref$eventTarget;

    // Call super for `this` to be defined
    _this2 = _EventEmitter.call(this) || this;
    _this2.enabled = null;
    _this2.completers = {};
    /**
     * Handle a message on the event source.
     * @param event message event that will be processed by the provider
     */

    _this2.handleEventSourceMessage = function (event) {
      var data = event.data; // No data to parse, skip.

      if (!data) {
        return;
      }

      var message = data; // Always expect jsonrpc to be set to '2.0'

      if (message.jsonrpc !== JSON_RPC_VERSION) {
        return;
      } // If the message has an ID, it is possibly a response message


      if (typeof message.id !== 'undefined' && message.id !== null) {
        var completer = _this2.completers['' + message.id]; // True if we haven't timed out and this is a response to a message we sent.

        if (completer) {
          // Handle pending promise
          if ('error' in message || 'result' in message) {
            completer.resolve(message);
          } else {
            completer.reject(new Error('Response from provider did not have error or result key'));
          }

          delete _this2.completers[message.id];
        }
      } // If the method is a request from the parent window, it is likely a subscription.


      if ('method' in message) {
        switch (message.method) {
          case 'notification':
            _this2.emitNotification(message.params);

            break;

          case 'connect':
            _this2.emitConnect();

            break;

          case 'close':
            _this2.emitClose(message.params[0], message.params[1]);

            break;

          case 'chainChanged':
            _this2.emitChainChanged(message.params[0]);

            break;

          case 'networkChanged':
            _this2.emitNetworkChanged(message.params[0]);

            break;

          case 'accountsChanged':
            _this2.emitAccountsChanged(message.params[0]);

            break;
        }
      }
    };

    _this2.targetOrigin = targetOrigin;
    _this2.timeoutMilliseconds = timeoutMilliseconds;
    _this2.eventSource = eventSource;
    _this2.eventTarget = eventTarget; // Listen for messages from the event source.

    _this2.eventSource.addEventListener('message', _this2.handleEventSourceMessage);

    return _this2;
  }
  /**
   * Differentiate this provider from other providers by providing an isIFrame property that always returns true.
   */


  var _proto = IFrameEthereumProvider.prototype;

  /**
   * Helper method that handles transport and request wrapping
   * @param method method to execute
   * @param params params to pass the method
   * @param requestId jsonrpc request id
   */
  _proto.execute = function execute(method, params, requestId) {
    try {
      var _this4 = this;

      var id = requestId ? requestId : getUniqueId();

      var payload = _extends({
        jsonrpc: JSON_RPC_VERSION,
        id: id,
        method: method
      }, typeof params === 'undefined' ? null : {
        params: params
      });

      var promise = new Promise(function (resolve, reject) {
        return _this4.completers[id] = {
          resolve: resolve,
          reject: reject
        };
      }); // Send the JSON RPC to the event source.

      _this4.eventTarget.postMessage(payload, _this4.targetOrigin); // Delete the completer within the timeout and reject the promise.


      setTimeout(function () {
        if (_this4.completers[id]) {
          _this4.completers[id].reject(new Error("RPC ID \"" + id + "\" timed out after " + _this4.timeoutMilliseconds + " milliseconds"));

          delete _this4.completers[id];
        }
      }, _this4.timeoutMilliseconds);
      return Promise.resolve(promise);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * EIP-1193 request interface to send request.
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#request
   * @param args request arguments
   * @param args.method method to send to the parent provider
   * @param args.params parameters to send
   */
  ;

  _proto.request = function request(_ref2) {
    var method = _ref2.method,
        params = _ref2.params;

    try {
      var _this6 = this;

      return Promise.resolve(_this6.execute(method, params)).then(function (response) {
        if ('error' in response) {
          throw new RpcError(response.error.code, response.error.message);
        } else {
          return response.result;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Depreciated. Backwards compatibility method for web3.
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#appendix-iii-legacy-provider-api
   * Send the JSON RPC and return the result.
   * @param method method to send to the parent provider
   * @param params parameters to send
   */
  ;

  _proto.send = function send(method, params) {
    try {
      var _this8 = this;

      return Promise.resolve(_this8.execute(method, params)).then(function (response) {
        if ('error' in response) {
          throw new RpcError(response.error.code, response.error.message);
        } else {
          return response.result;
        }
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Request the parent window to enable access to the user's web3 provider. Return accounts list immediately if already enabled.
   */
  ;

  _proto.enable = function enable() {
    try {
      var _this10 = this;

      if (_this10.enabled === null) {
        var promise = _this10.enabled = _this10.send('enable')["catch"](function (error) {
          // Clear this.enabled if it's this promise so we try again next call.
          // this.enabled might be set from elsewhere if, e.g. the accounts changed event is emitted
          if (_this10.enabled === promise) {
            _this10.enabled = null;
          } // Rethrow the error.


          throw error;
        });
      }

      return Promise.resolve(_this10.enabled);
    } catch (e) {
      return Promise.reject(e);
    }
  }
  /**
   * Depreciated. Backwards compatibility method for web3.
   * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md#appendix-iii-legacy-provider-api
   * @param payload payload to send to the provider
   * @param callback callback to be called when the provider resolves
   */
  ;

  _proto.sendAsync = function sendAsync(payload, callback) {
    try {
      var _this12 = this;

      var _temp3 = _catch(function () {
        return Promise.resolve(_this12.execute(payload.method, payload.params, payload.id)).then(function (result) {
          callback(null, result);
        });
      }, function (error) {
        callback(error, null);
      });

      return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  _proto.emitNotification = function emitNotification(result) {
    this.emit('notification', result);
  };

  _proto.emitConnect = function emitConnect() {
    // If the provider isn't enabled but it emits a connect event, assume that it's enabled and initialize
    // with an empty list of accounts.
    if (this.enabled === null) {
      this.enabled = Promise.resolve([]);
    }

    this.emit('connect');
  };

  _proto.emitClose = function emitClose(code, reason) {
    this.emit('close', code, reason);
  };

  _proto.emitChainChanged = function emitChainChanged(chainId) {
    this.emit('chainChanged', chainId);
  };

  _proto.emitNetworkChanged = function emitNetworkChanged(networkId) {
    this.emit('networkChanged', networkId);
  };

  _proto.emitAccountsChanged = function emitAccountsChanged(accounts) {
    this.enabled = Promise.resolve(accounts);
    this.emit('accountsChanged', accounts);
  };

  _createClass(IFrameEthereumProvider, [{
    key: "isIFrame",
    get: function get() {
      return true;
    }
    /**
     * Always return this for currentProvider.
     */

  }, {
    key: "currentProvider",
    get: function get() {
      return this;
    }
  }]);

  return IFrameEthereumProvider;
}(EventEmitter);

export { IFrameEthereumProvider, RpcError };
//# sourceMappingURL=iframe-provider.esm.js.map
