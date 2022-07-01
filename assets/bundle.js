// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/detect-touch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var detectTouch = {
  /**
   * Init module
   */
  init: function init() {
    detectTouch.detect();
  },

  /**
   * Detect touch screen
   */
  detect: function detect() {
    if ("ontouchstart" in document.documentElement) {
      document.querySelector('body').classList.add('touch');
      window.isTouch = true;
    } else {
      document.querySelector('body').classList.add('no-touch');
      window.isTouch = false;
    }
  }
};
var _default = detectTouch;
exports.default = _default;
},{}],"utils/detect-breakpoint.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var detectBreakpoint = {
  /**
   * Init module
   */
  init: function init() {
    detectBreakpoint.initBreakpoints();
    detectBreakpoint.detect(true);
    window.addEventListener("resize", function (event) {
      detectBreakpoint.detect();
    });
  },
  initBreakpoints: function initBreakpoints() {
    window.breakpoints = window.breakpoints || {
      tablet: 600,
      desktop: 900,
      desktopLarge: 1200
    };
  },

  /**
   * Detect current breakpoint
   */
  detect: function detect(updateDom) {
    detectBreakpoint.updateMode(updateDom);

    if (detectBreakpoint.detectChange()) {
      detectBreakpoint.triggerEvent();
    }
  },

  /**
  * Update screen mode
  */
  updateMode: function updateMode() {
    var updateDom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (windowWidth < window.breakpoints.desktopLarge) {
      if (windowWidth < window.breakpoints.desktop) {
        if (windowWidth < window.breakpoints.tablet) {
          window.screenMode = 'mobile';
        } else {
          window.screenMode = 'tablet';
        }
      } else {
        window.screenMode = 'desktop';
      }
    } else {
      window.screenMode = 'desktop-large';
    }

    if (updateDom) {
      document.querySelector('body').setAttribute('data-screen-mode', window.screenMode);
    }
  },

  /**
  * Get current screen mode
  */
  getMode: function getMode() {
    return window.screenMode;
  },

  /**
   * Trigger breakpoint change event
   */
  triggerEvent: function triggerEvent() {
    detectBreakpoint.updateMode(true);
    var event = new CustomEvent('screen-breakpoint', {
      'detail': {
        'mode': detectBreakpoint.getMode()
      }
    });
    window.dispatchEvent(event);
  },

  /**
   * Detect breakpoint change
   */
  detectChange: function detectChange() {
    var mode = detectBreakpoint.getMode(),
        swap = window.screenSwapMode;

    if (mode === undefined && swap === undefined) {
      return true;
    }

    if (mode === 'mobile' && swap !== 'mobile') {
      window.screenSwapMode = 'mobile';
      return true;
    }

    if (mode === 'tablet' && swap !== 'tablet') {
      window.screenSwapMode = 'tablet';
      return true;
    }

    if (mode === 'desktop' && swap !== 'desktop') {
      window.screenSwapMode = 'desktop';
      return true;
    }

    if (mode === 'desktop-large' && swap !== 'desktop-large') {
      window.screenSwapMode = 'desktop-large';
      return true;
    }

    return false;
  }
};
var _default = detectBreakpoint;
exports.default = _default;
},{}],"utils/money.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init module
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.money = component;
    component.money_format = "${{amount}}";
    component.initMoneyFormat();
  },

  /**
  * MoneyFormat Shopify
   * 
   * ${{ amount }} - Default
   * ${{ amount_no_decimals }}
   * ${{ money_with_currency }}
   * ${{ money_without_trailing_zeros }}
   * ${{ money_without_currency  }}
   * 
  * @returns {undefined}
  */
  initMoneyFormat: function initMoneyFormat() {
    component.format = function (cents, format) {
      if (typeof cents == 'string') {
        cents = cents.replace('.', '');
      }

      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = format || this.money_format;

      function defaultOption(opt, def) {
        return typeof opt == 'undefined' ? def : opt;
      }

      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');

        if (isNaN(number) || number == null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);
        var parts = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents = parts[1] ? decimal + parts[1] : '';
        return dollars + cents;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;

        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;

        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;

        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
      }

      return formatString.replace(placeholderRegex, value);
    };
  }
};
var _default = component;
exports.default = _default;
},{}],"utils/handleize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init component
      * 
      * @return {undefined}
   */
  init: function init() {
    window.theme = window.theme || {};
    /**
     * Handleize a string
     * 
     * @global
     */

    window.theme.handleize = component.handleize;
  },

  /**
  * Handleize a string
   * 
   * @param {string} str Normal string.
   * @return {string} Handle.
  */
  handleize: function handleize(str) {
    // https://gist.github.com/tyteen4a03/3420a9e121d13b091343
    str = str.toLowerCase();
    var toReplace = ['"', "'", "\\", "(", ")", "[", "]"]; // For the old browsers

    for (var i = 0; i < toReplace.length; ++i) {
      str = str.replace(toReplace[i], "");
    }

    str = str.replace(/\W+/g, "-");

    if (str.charAt(str.length - 1) == "-") {
      str = str.replace(/-+\z/, "");
    }

    if (str.charAt(0) == "-") {
      str = str.replace(/\A-+/, "");
    }

    return str;
  }
};
var _default = component;
exports.default = _default;
},{}],"utils/escape.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init component
   */
  init: function init() {
    document.onkeydown = function (event) {
      event = event || window.event;
      var key = event.key || event.keyCode;

      if (key === 'Escape' || key === 'Esc' || key === 27) {
        var _event = new CustomEvent('escape', {
          'detail': {}
        });

        window.dispatchEvent(_event);
      }
    };
  }
};
var _default = component;
exports.default = _default;
},{}],"utils/file.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init component
      * 
      * @return {undefined}
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.file = component;
  },

  /**
  * Get file extension from an url
   * 
   * @param {string} url File URL.
   * @param {object} regex Regex with file extensions.
   * @return {string} File extension.
  */
  getExtension: function getExtension(url) {
    var regex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /\.(jpe?g|png|gif|bmp)/g;
    var fileExtension = '',
        m;

    while ((m = regex.exec(url)) !== null) {
      if (m.index === regex.lastIndex) regex.lastIndex++;
      fileExtension = m[0];
    }

    return fileExtension;
  }
};
var _default = component;
exports.default = _default;
},{}],"utils/debounce.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _this = void 0;

var component = {
  /**
   * Init component
   */
  init: function init() {
    /**
     * Debounce module api
     * 
     * @global
     */
    window.theme.debounce = component;
  },

  /**
   * Apply debounce.
   * 
   * @param {function} fn A function.
   * @param {int} waint A time to wait.
   * @returns {function} A function.
   */
  apply: function apply(fn, wait) {
    var t;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      clearTimeout(t);
      t = setTimeout(function () {
        return fn.apply(_this, args);
      }, wait);
    };
  }
};
var _default = component;
exports.default = _default;
},{}],"libs/serialize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init module
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.serialize = component;
  },

  /*!
      * Serialize all form data into a SearchParams string
      * (c) 2020 Chris Ferdinandi, MIT License, https://gomakethings.com
      * @param  {Node}   form The form to serialize
      * @return {String}      The serialized form data
      */
  serializeForm: function serializeForm(form) {
    var arr = [];
    Array.prototype.slice.call(form.elements).forEach(function (field) {
      if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;

      if (field.type === 'select-multiple') {
        Array.prototype.slice.call(field.options).forEach(function (option) {
          if (!option.selected) return;
          arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(option.value));
        });
        return;
      }

      if (['checkbox', 'radio'].indexOf(field.type) > -1 && !field.checked) return;
      arr.push(encodeURIComponent(field.name) + '=' + encodeURIComponent(field.value));
    });
    return arr.join('&');
  }
};
var _default = component;
exports.default = _default;
},{}],"components/cart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var component = {
  /**
   * Init module
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.cart = component;
    component.labels = {
      empty: 'Shopping cart. You do not have any item in your cart.',
      oneitem: 'Shopping cart. You have just one item in your cart.',
      manyItems: 'Shopping cart. You have {{ qty }} items in your cart.'
    };

    component._updateMinicartLabels();

    component._initStandAloneButtons(); //component._initAddToCartForms();

  },

  /**
   * Init stand alone add to cart button
   */
  _initStandAloneButtons: function _initStandAloneButtons() {
    var buttons = document.querySelectorAll('[data-cart-add]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        var button = event.target;
        button.setAttribute('disabled', true);
        component.add(button.dataset.cartAdd, button.dataset.cartAddQty, button.dataset.cartAddProp).then(function (result) {
          button.removeAttribute('disabled');
        });
      });
    });
  },

  /**
   * Reload minicart data
   */
  _reloadMinicart: function _reloadMinicart() {
    return new Promise(function (resolve, reject) {
      fetch('/cart.js', {
        credentials: 'same-origin'
      }).then(function (response) {
        return response.json();
      }).then(function (cart) {
        component._setCartQuantity(cart.item_count);

        resolve(cart);
      }).catch(function (error) {
        console.log(error);
      });
    });
  },

  /**
   * Update cart quantity counters
   */
  _setCartQuantity: function _setCartQuantity(quantity) {
    document.querySelectorAll('[data-minicart-count]').forEach(function (counter) {
      counter.innerText = quantity;
      counter.dataset.minicartCount = quantity;
    });
  },

  /**
   * Get cart quantity
   */
  getCartQuantity: function getCartQuantity() {
    var count = document.querySelector('[data-minicart-count]');

    if (count) {
      return parseInt(count.dataset.minicartCount);
    } else {
      return 0;
    }
  },

  /**
   * Add a product to the cart by parameters
   */
  add: function add(id, qty, properties) {
    return new Promise(function (resolve, reject) {
      // Create the request
      var request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
          id: id,
          quantity: qty
        })
      }; // Make a request

      fetch('/cart/add.js', request).then(function (response) {
        return response.json();
      }).then(function (json) {
        if (json.status && json.status !== 200) {
          var error = new Error(json.description);
          error.isFromServer = true;
          throw error;
        }

        component._afterAddToCart(0);

        resolve(true);
      }).catch(function (error) {
        reject(error);
      });
    });
  },

  /**
   * Update a product to the cart by parameters
   */
  update: function update(id, qty, properties) {
    return new Promise(function (resolve, reject) {
      // Create the request
      var request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
          id: id,
          quantity: qty
        })
      }; // Make a request

      fetch('/cart/change.js', request).then(function (response) {
        return response.json();
      }).then(function (json) {
        if (json.status && json.status !== 200) {
          var error = new Error(json.description);
          error.isFromServer = true;
          throw error;
        }

        resolve(true);
      }).catch(function (error) {
        reject(error);
      });
    });
  },

  /**
   * Add a product to the cart by form data
   */
  addByForm: function addByForm(form) {
    return new Promise(function (resolve, reject) {
      // Check if the serialize function is available
      if (typeof window.theme.serialize != 'undefined') {
        // Create the request
        var request = {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: window.theme.serialize.serializeForm(form)
        }; // Make a request

        fetch('/cart/add.js', request).then(function (response) {
          return response.json();
        }).then(function (json) {
          if (json.status && json.status !== 200) {
            var error = new Error(json.description);
            error.isFromServer = true;
            throw error;
          }

          var qty_added = form.querySelector("input[name='quantity']");

          if (qty_added) {
            component._enableIconAnimation().then(function () {
              component._afterAddToCart(qty_added.value).then(function () {
                component._disableIconAnimation();
              });
            });
          }

          resolve(true);
        }).catch(function (error) {
          reject(error);
        });
      } else {
        reject(false);
      }
    });
  },

  /**
   * Enable Mini Cart Animation
   */
  _enableIconAnimation: function _enableIconAnimation() {
    return new Promise(function (resolve, reject) {
      var toggle = document.querySelector('[data-minicart-toggle]');
      var miniCartCount = toggle.querySelector('[data-minicart-count]');
      setTimeout(function () {
        toggle.classList.add('start_animation');
        setTimeout(function () {
          miniCartCount.innerText = 'Item Added';
          setTimeout(function () {
            resolve(true);
          }, 2000);
        }, 200);
      }, 300);
    });
  },

  /**
   * Disable Mini Cart Animation
   */
  _disableIconAnimation: function _disableIconAnimation() {
    var toggle = document.querySelector('[data-minicart-toggle]');
    toggle.classList.remove('start_animation');
  },

  /**
   * After add to cart
   * 
   * @param {integer} qty_added Product quantity added to the cart.
   */
  _afterAddToCart: function _afterAddToCart(qty_added) {
    return new Promise(function (resolve, reject) {
      component._reloadMinicart().then(function (cart) {
        component._updateMinicartLabels();

        window.theme.mini_cart._openMinicart(qty_added);

        resolve(true);
      });
    });
  },

  /**
   * Update minicart labels for web accessibility
   */
  _updateMinicartLabels: function _updateMinicartLabels() {
    var quantity = component.getCartQuantity();
    document.querySelectorAll('[data-minicart-toggle]').forEach(function (toggle) {
      if (quantity > 0) {
        if (quantity == 1) {
          toggle.setAttribute('aria-label', component.labels.oneitem);
        } else {
          toggle.setAttribute('aria-label', component.labels.manyItems.replace('{{ qty }}', quantity));
        }
      } else {
        toggle.setAttribute('aria-label', component.labels.empty);
      }
    });
  },
  _validateFieldRequired: function _validateFieldRequired(form) {
    var fields = form.querySelectorAll("[required]");
    var foundError = false;

    var _iterator = _createForOfIteratorHelper(fields),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var field = _step.value;
        foundError = field.validity.valueMissing;

        if (foundError) {
          field.classList.add("invalid");
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return foundError;
  }
};
var _default = component;
exports.default = _default;
},{}],"components/mini-cart.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Mini Cart
 *
 * @module mini-cart
 * @version 1.0.0
 */
var component = {
  /**
   * Init module
   * 
   * @returns {undefined}
   */
  init: function init() {
    /** @global */
    window.theme.mini_cart = component;
    component.target = document.querySelector("[data-mini-cart]");
    if (!component.target) return null;

    component._checkAttributeDisabled();

    component._initCloseEvents();

    component.initFocusTrap();

    component._initOpenEvents();

    component._initHoverEvent();
  },

  /**
   * start to listen the click button to close minicart
      * 
      * @returns {undefined}
   */
  _initCloseEvents: function _initCloseEvents() {
    // Close minicart when click on overlay
    document.querySelector('[data-minicart-close]').addEventListener('click', function (event) {
      event.preventDefault();

      component._closeMinicart();
    }); // Close minicart when click on close button

    document.querySelectorAll('[data-minicart-close-button]').forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        event.preventDefault();

        component._closeMinicart();
      });
    }); // Close minicart on press escape

    window.addEventListener('escape', function (event) {
      component._closeMinicart();
    });
  },

  /**
   * hide minicart
      * 
      * @returns {undefined}
   */
  _closeMinicart: function _closeMinicart() {
    component.disableFocusTrap();
    document.querySelector('body').classList.remove('active-mini-cart'); //document.querySelector('[data-mini-cart-product-added-message]').classList.remove('active');
    // We need to use set time out to avoid issues with minicart animation

    setTimeout(function () {
      component.target.classList.remove("active");
      component.target.setAttribute('aria-hidden', 'true');
      component.disableOverlay();
    }, 50);
  },

  /**
   * check if the mini cart has a dataset data-minicart-disabled-for-mobile
      * 
      * @returns {boolean} button has the data attribute or not.
   */
  _checkAttributeDisabled: function _checkAttributeDisabled() {
    if (window.screenMode == 'mobile') {
      var openButton = document.querySelector('[data-minicart-toggle]');

      if (openButton.hasAttribute('data-minicart-disabled-for-mobile')) {
        component.disableMiniCartForMobile = true;
      } else {
        component.disableMiniCartForMobile = false;
      }
    } else {
      component.disableMiniCartForMobile = false;
    }
  },

  /**
   * open minicart when clicking on bag
      * 
      * @returns {undefined}
   */
  _initOpenEvents: function _initOpenEvents() {
    var openButton = document.querySelectorAll('[data-minicart-toggle]');
    openButton.forEach(function (btn) {
      btn.addEventListener('click', function (event) {
        //Do not open mini cart for mobile that has data-minicart-disabled-for-mobile attribute
        component._checkAttributeDisabled();

        if (!component.disableMiniCartForMobile) {
          event.preventDefault();

          component._openMinicart(0);
        }
      });
    });
  },

  /**
   * open mini cart when hovering on the cart icon
      * 
      * @returns {undefined}
   */
  _initHoverEvent: function _initHoverEvent() {
    var openCart = document.querySelectorAll('[data-minicart-toggle],[data-mini-cart]');
    var closeCart = document.querySelector('[data-mini-cart]');
    openCart.forEach(function (element) {
      hoverintent(element, function () {
        if (closeCart != element) {
          component._openMinicart(0);
        }
      }, function () {
        if (element == closeCart) {
          component._closeMinicart();
        }
      });
    });
  },

  /**
   * show minicart
      * 
   * @param {integer} qty_added Product quantity added to the cart.
      * @returns {undefined}
   */
  _openMinicart: function _openMinicart(qty_added) {
    //Do not open mini cart for mobile that has data-minicart-disabled-for-mobile attribute
    component._checkAttributeDisabled();

    if (!component.disableMiniCartForMobile) {
      var quantity = window.theme.cart.getCartQuantity();

      if (quantity > 0) {
        component._updateMinicartData(qty_added);

        document.querySelector('body').classList.add('active-mini-cart'); //document.querySelector('[data-mini-cart-product-added-message]').classList.add('active');
        // We need to use set time out to avoid issues with minicart animation

        setTimeout(function () {
          component._updateFreeShippingBar();

          component.target.classList.add("active");
          component.target.setAttribute('aria-hidden', 'false');
          component.activeFocusTrap();
          component.enableOverlay();
        }, 50);
      }
    }
  },

  /**
   * load all products in cart
      * 
   * @param {integer} qty_added Product quantity added to the cart.
      * @returns {undefined}
   */
  _updateMinicartData: function _updateMinicartData(qty_added) {
    fetch('/cart.js', {
      credentials: 'same-origin'
    }).then(function (response) {
      return response.json();
    }).then(function (cart) {
      component._loadItems(cart, qty_added);
    }).catch(function (error) {
      console.log(error);
    });
  },

  /**
   * Enable minicart overlay
      * 
      * @returns {undefined}
   */
  enableOverlay: function enableOverlay() {
    document.querySelector('[data-minicart-close]').classList.add('active');
    document.querySelector('[data-minicart-close]').focus();
  },

  /**
   * Disable minicart overlay
   * 
   * @returns {undefined}
   */
  disableOverlay: function disableOverlay() {
    document.querySelector('[data-minicart-close]').classList.remove('active');
  },

  /**
   * Update product added message
   * 
   * @param {integer} qty_added Product quantity added to the cart.
   * @param {integer} id Product ID of product added to the cart.
   * @returns {undefined}
   */
  _updateProductAddedMessage: function _updateProductAddedMessage(qty_added, id) {
    var message = component.target.querySelector('[data-mini-cart-product-added-message]');
    if (!message) return false;

    if (qty_added == 0) {
      message.innerHTML = "";
      message.classList.remove("active");
    } else if (qty_added == 1) {
      message.innerHTML = "<span>You added 1 product to your bag!</span>";
      message.classList.add("active");
    } else {
      message.innerHTML = "<span>You added " + qty_added + " products to your bag!</span>";
      message.classList.add("active");
    }
  },

  /**
   * load all html products 
   * 
   * @param {integer} cart Cart object.
   * @param {integer} qty_added Product quantity added to the cart.
   * @returns {undefined}
   */
  _loadItems: function _loadItems(cart, qty_added) {
    //component._updateProductAddedMessage(qty_added);
    if (cart.item_count > 0) {
      var div_items = document.querySelector('[data-mini-cart-items]');

      if (div_items) {
        var list_items = "";
        cart.items.forEach(function (item) {
          var html_items = miniCartTemplate.mini_cart_items_layout;
          var image_src = ""; // Products Image

          if (item.featured_image) {
            image_src = item.featured_image.url.replace(".jpg", "_150x150.jpg").replace(".png", "_150x150.png");
          } else {
            image_src = "http://via.placeholder.com/150x150.png";
          }

          html_items = html_items.replace(/{{itemImageSrc}}/g, image_src);
          var random_number = Math.floor(Math.random() * 10000) + 1;
          html_items = html_items.replace(/{{randomNumber}}/g, random_number); // Products Title

          if (item.product_title) {
            var item_url = item.url;
            var item_title = item.product_title;
            html_items = html_items.replace(/{{itemUrl}}/g, item_url);
            html_items = html_items.replace(/{{itemTitle}}/g, item_title);
          }

          var html_options = ""; // Variant Title

          if (item.options_with_values) {
            item.options_with_values.forEach(function (options) {
              html_options += "<div class='mini-cart__item-options'>" + options.name + " : " + options.value + "</div>";
            });
          } // Product properties


          if (Object.keys(item.properties).length) {
            for (var property in item.properties) {
              html_options += "<div class='mini-cart__item-options'>" + property + " : " + item.properties[property] + "</div>";
            }
          }

          html_items = html_items.replace(/{{itemOptions}}/g, html_options);
          var item_id = item.id;
          html_items = html_items.replace(/{{itemID}}/g, item_id); // Variant Price

          if (item.final_line_price) {
            var item_price = window.theme.money.format(item.final_line_price);
            html_items = html_items.replace(/{{itemPrice}}/g, item_price);
          } // Variant quantity


          var item_quantity = item.quantity;
          html_items = html_items.replace(/{{itemQuantity}}/g, item_quantity);
          list_items += html_items;
        });

        if (list_items) {
          div_items.innerHTML = list_items; //Init all input quantity events

          window.theme.quantity_selector.load(); //Listen when update the input quantity

          component._initListenQuantity(); //Update count icon


          window.theme.cart._setCartQuantity(cart.item_count); //Update all prices inside minicart


          component._uploadAllMinicartPrices(cart); //Set the height proportional to the footer


          var footer = document.querySelector("[data-minicart-footer]"); //var message = document.querySelector("[data-mini-cart-product-added-message]");
          // var free_shipping = document.querySelector("[data-minicart-free-shipping-bar]");
          // var sum = footer.offsetHeight + free_shipping.offsetHeight;
          // div_items.style.height = "calc(100vh - " + (sum + 107) + "px)";
          //Init the event when delete a product

          component._initListenTrashButton();
        }
      }
    } else {
      component._closeMinicart(); //Update count icon


      window.theme.cart._setCartQuantity(0);
    }
  },

  /**
   * Listen when update the input quantity
      * 
      * @returns {undefined}
   */
  _initListenQuantity: function _initListenQuantity() {
    component.target.querySelectorAll('[data-cart-page-item-id]').forEach(function (element) {
      element.addEventListener('change', function (event) {
        var productId = event.target.dataset.cartPageItemId;

        if (productId) {
          component._updateMiniCart(productId, event.target.value);
        }
      });
    });
  },

  /**
   * Update the minicart
      * 
      * @returns {undefined}
   */
  _updateMiniCart: function _updateMiniCart(id, qty) {
    return new Promise(function (resolve, reject) {
      // Create the request
      var request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;'
        },
        body: JSON.stringify({
          id: id,
          quantity: qty
        })
      }; // Make a request

      fetch('/cart/change.js', request).then(function (response) {
        return response.json();
      }).then(function (json) {
        if (json.status && json.status !== 200) {
          var error = new Error(json.description);
          error.isFromServer = true;
          throw error;
        }

        component._updateFreeShippingBar();

        component._updateMinicartData(0);

        component._checkAvailabilityStock(id, qty);

        resolve(true);
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    });
  },

  /**
   * Update the progress bar (Free Shipping App)
      * 
      * @return {undefined}
   */
  _updateFreeShippingBar: function _updateFreeShippingBar() {
    if (typeof window.updateFSPB != 'undefined') {
      window.updateFSPB();
    }
  },

  /**
   * check if product has unavailability stock
      * 
      * @returns {undefined}
   */
  _checkAvailabilityStock: function _checkAvailabilityStock(id, qty_added) {
    var message = component.target.querySelector('[data-error-message]');
    if (!message) return false;
    fetch('/cart.js', {
      credentials: 'same-origin'
    }).then(function (response) {
      return response.json();
    }).then(function (cart) {
      cart.items.forEach(function (item) {
        if (id == item.id) {
          if (qty_added > item.quantity) {
            message.innerHTML = "";
            message.append("All " + item.quantity + " " + item.title + " are in your cart.");
            message.classList.add("active");
            var input = document.querySelector('[data-cart-page-item-id=\"' + item.id + '\"]');

            if (input) {
              input.value = item.quantity;
            }
          } else {
            message.innerHTML = "";
            message.classList.remove("active");
          }
        }
      });
    }).catch(function (error) {
      console.log(error);
    });
  },

  /**
   * Listen when click in remove item
      * 
      * @returns {undefined}
   */
  _initListenTrashButton: function _initListenTrashButton() {
    document.querySelectorAll('[data-minicart-remove-item]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        var productId = element.dataset.minicartVariantId;

        if (productId) {
          component._updateMiniCart(productId, 0);
        }
      });
    });
  },

  /**
   * Upload all components inside minicart as prices, numbers, etc
      * 
   * @param {cart} cart A cart object.
   * @param {id} id A cart id.
      * @returns {undefined}
   */
  _uploadAllMinicartPrices: function _uploadAllMinicartPrices(cart, id) {
    if (id) {
      cart.items.forEach(function (item) {
        if (id == item.id) {
          var total_per_product = window.theme.money.format(item.final_line_price);
          document.querySelectorAll("[data-minicart-item-id='" + item.id + "']").forEach(function (element) {
            //Updating price item inside minicart
            element.innerText = total_per_product;
          });
        }
      });
    } // Updating total at the top


    var total1 = document.querySelector("[data-mini-cart-total1]");

    if (total1) {
      total1.innerHTML = "Order Total: <strong>" + window.theme.money.format(cart.total_price) + "</strong>";
    } // Updating total at the bottom


    var total2 = document.querySelector("[data-minicart-total2]");

    if (total2) {
      total2.innerHTML = "Order Total: <strong class='test'>" + window.theme.money.format(cart.total_price) + "</strong>";
    } // Updating subtotal


    var subtotal = document.querySelector("[data-minicart-subtotal]");

    if (subtotal) {
      subtotal.innerHTML = window.theme.money.format(cart.items_subtotal_price);
    }
    /* Updating shipping
    var shipping = document.querySelector("[data-minicart-shipping]");
    shipping.innerHTML = "Shipping: <strong>UPS International $5.00</strong>";
    */

  },

  /**
   * Init minicart focus trap
      * 
      * @returns {undefined}
   */
  initFocusTrap: function initFocusTrap() {
    component.focusTrap = focusTrap.createFocusTrap(component.target, {
      clickOutsideDeactivates: true
    });
  },

  /**
   * Ative minicart focus trap
      * 
      * @returns {undefined}
   */
  activeFocusTrap: function activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  },

  /**
   * Disable minicart focus trap
      * 
      * @returns {undefined}
   */
  disableFocusTrap: function disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/accordion.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Accordion
 *
 * @module accordion
 */
var component = {
  /**
   * Init component
   * 
   * @return {boolean|undefined}
   */
  init: function init() {
    component.target = document.querySelectorAll('[data-accordion]');
    if (!component.target) return false;
    component.target.forEach(function (accordion) {
      component.loadAttributes(accordion);
    });
    document.querySelectorAll('[data-accordion-heading]').forEach(function (item) {
      if (typeof item.dataset.accordionHover != 'undefined') {
        hoverintent(item, function () {
          component.initEvents(item, false);
        }, function () {});
      }

      item.addEventListener('click', function (event) {
        event.preventDefault();
        component.initEvents(item, true);
      });
    });
  },

  /**
  * Init Events
  * 
  * @param {item} item A data-accordion-heading object (accordion object)
  * @return {undefined}
  */
  initEvents: function initEvents(item, close) {
    component.closeAllItems(item.parentElement.parentElement, item); // We need to use a promisse to avoid issues with accordion

    component.toggle(item, close).then(function (newContentHeight) {
      component.applyMaxHeightOnParent(item.parentElement.parentElement, item, newContentHeight);
    });
  },

  /**
   * Load accordion attributes
   * 
   * @param {object} accordion A accordion object.
   * @return {undefined}
   */
  loadAttributes: function loadAttributes(accordion) {
    accordion.classList.add('accordion');
    var id = Math.floor(Math.random() * 1000);
    accordion.querySelectorAll('[data-accordion-heading]').forEach(function (heading, index) {
      id = id + '_' + index;
      heading.parentElement.classList.add('accordion__item');
      heading.classList.add('accordion__heading');
      heading.setAttribute('aria-expanded', 'false');
      heading.setAttribute('aria-controls', 'accordion__content' + id);
      heading.id = 'accordion__heading__' + id;
      heading.nextElementSibling.classList.add('accordion__content');
      heading.nextElementSibling.classList.add('hidden');
      heading.nextElementSibling.setAttribute('role', 'region');
      heading.nextElementSibling.setAttribute('aria-labelledby', 'accordion__heading__' + id);
      heading.nextElementSibling.id = 'accordion__content__' + id;
    });
  },

  /**
  * Init Accordion toggle
   * 
   * @param {object} heading A accordion object.
   * @returns {Promise} Promise object represents a number.
  */
  toggle: function toggle(heading, close) {
    return new Promise(function (resolve, reject) {
      var content = heading.nextElementSibling;

      if (heading && content) {
        var container = heading.parentElement;

        if (container.classList.contains('active') && close) {
          // Close Accordion
          container.classList.remove('active');
          content.style.maxHeight = null;
          heading.setAttribute('aria-expanded', 'false'); // We need to use set time out to avoid issues with accordion animation

          setTimeout(function () {
            content.classList.add('hidden');
          }, 500);
        } else {
          // Open Accordion
          container.classList.add('active');
          content.classList.remove('hidden');
          content.style.maxHeight = content.scrollHeight + "px";
          heading.setAttribute('aria-expanded', 'true');
        }

        resolve(content.scrollHeight);
      }
    });
  },

  /**
   * Change the parent max-height (submenu)
   * @param {object} parent A data-accordion-content (accordion object)
   * @param {object} item A data-accordion-heading object (accordion object)
   * @param {integer} newContentHeight A data-accordion-content height
   * @return {undefined}
   */
  applyMaxHeightOnParent: function applyMaxHeightOnParent(parent, item, newContentHeight) {
    var hasClass = parent.querySelector('.global-menu__submenu');

    if (hasClass) {
      hasClass.classList.remove('global-menu__submenu');
    }

    if (typeof parent.dataset.accordionSubmenu != 'undefined') {
      if (parent.classList.contains('accordion__content')) {
        var isOpen = item.getAttribute('aria-expanded');

        if (isOpen == 'true') {
          item.classList.add('global-menu__submenu'); //const childHeight = parent.querySelector('[data-accordion-content]').scrollHeight;

          parent.style.maxHeight = parent.scrollHeight + newContentHeight + "px";
        } else {
          item.classList.remove('global-menu__submenu');
        }
      }
    }
  },

  /**
   * Close all items
   * 
   * @param {object} accordion An accordion object.
   * @return {undefined}
   */
  closeAllItems: function closeAllItems(accordion, item) {
    if (typeof accordion.dataset.accordionAutoClose != 'undefined') {
      if (!item.parentElement.classList.contains('active')) {
        if (typeof accordion.dataset.accordionSubmenu != 'undefined') {
          accordion.querySelectorAll('[data-accordion-submenu] .active [data-accordion-heading][data-menu-level2]').forEach(function (heading) {
            component.toggle(heading, true);
          });
        } else {
          accordion.querySelectorAll('[data-accordion] .active [data-accordion-heading]').forEach(function (heading) {
            component.toggle(heading, true);
          });
        }
      }
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/quantity-selector.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init module
      * 
      * @return {boolean|undefined}
   */
  init: function init() {
    window.theme = window.theme || {};
    window.theme.quantity_selector = component;
    component.load();
  },
  load: function load() {
    component.target = document.querySelectorAll('[data-quantity-selector]');
    if (!component.target) return false;
    component.target.forEach(function (element) {
      if (!element.classList.contains('active')) {
        element.querySelector('[data-quantity-selector-minus]').addEventListener('click', function (event) {
          event.preventDefault();
          var input = event.target.parentElement.querySelector('input');
          component.decrease(input);
        });
        element.querySelector('[data-quantity-selector-plus]').addEventListener('click', function (event) {
          event.preventDefault();
          var input = event.target.parentElement.querySelector('input');
          component.increase(input);
        });
        element.classList.add('active');
      }
    });
  },

  /**
  * Decrease input value
   * 
   * @param {input} input A input for the quantity selector.
  */
  decrease: function decrease(input) {
    var value = parseInt(input.value);

    if (value > 0) {
      value--;
      input.value = value;
      var event = new CustomEvent('change', {
        'detail': input
      });
      input.dispatchEvent(event);
    }
  },

  /**
  * Increase input value
   * 
   * @param {input} input A input for the quantity selector.
  */
  increase: function increase(input) {
    var value = parseInt(input.value);
    value++;
    input.value = value;
    var event = new CustomEvent('change', {
      'detail': input
    });
    input.dispatchEvent(event);
  }
};
var _default = component;
exports.default = _default;
},{}],"components/modal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Modal
 *
 * @module modal
 * @version 1.0.0
 */
var component = {
  /**
   * Init component
   * 
   * @returns {boolean|undefined}
   */
  init: function init() {
    component.target = document.querySelectorAll('[data-modal]');
    if (!component.target) return false;
    component.target.forEach(function (item) {
      component.initEvents(item);
    });
  },

  /**
  * Init modal events   
  * 
  * @param {item} item A modal object.
  * @returns {undefined}
  */
  initEvents: function initEvents(item) {
    var name = item.dataset.modalName;
    var btnClose = item.querySelector('[data-modal-close]');
    var btnsOpen = document.querySelectorAll('[data-modal-open=' + name + ' ]');

    if (btnsOpen) {
      btnsOpen.forEach(function (btn) {
        btn.classList.add('with-modal'); // Open modal when click on btn open

        btn.addEventListener('click', function (event) {
          event.preventDefault();
          component.open(item);
        });
      }); // Close modal when click on btn close

      btnClose.addEventListener('click', function (event) {
        event.preventDefault();
        component.close(item);
      }); // Close modal when click on overlay

      item.addEventListener('click', function (event) {
        if (event.target == item) {
          component.close(item);
        }
      }); // Close modal on press escape

      window.addEventListener('escape', function (event) {
        event.preventDefault();
        component.close(item, event);
      });
    }
  },

  /**
  * Open modal
   * 
   * @param {item} item A modal object.
   * @returns {undefined}
  */
  open: function open(item) {
    item.classList.add('active');
    item.setAttribute('aria-hidden', 'false');
    document.querySelector('body').classList.add('modal-active');
    setTimeout(function () {
      component.initFocusTrap(item);
      component.activeFocusTrap();
      item.querySelector('[data-modal-close]').focus();
    }, 100);
  },

  /**
  * Close modal 
   * 
   * @param {item} item A modal object.
   * @returns {undefined}
  */
  close: function close(item) {
    item.classList.remove('active');
    item.setAttribute('aria-hidden', 'true');
    document.querySelector('body').classList.remove('modal-active');
    component.disableFocusTrap();
  },

  /**
   * Init modal focus trap
      * 
      * @returns {undefined}
   */
  initFocusTrap: function initFocusTrap(item) {
    component.focusTrap = focusTrap.createFocusTrap(item, {
      clickOutsideDeactivates: true
    });
  },

  /**
   * Ative modal focus trap
      * 
      * @returns {undefined}
   */
  activeFocusTrap: function activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  },

  /**
   * Disable modal focus trap
      * 
      * @returns {undefined}
   */
  disableFocusTrap: function disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/search-bar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Search Bar
 *
 * @module search-bar
 */
var component = {
  /**
   * Init module
   * 
   * @returns {undefined}
   */
  init: function init() {
    component.target = document.querySelector('[data-search-bar-header]');
    if (!component.target) return false;
    component.initFocusTrap();
    component.initToggle();
  },

  /**
   * Init toggle buttons
   * 
   * @returns {undefined}
   */
  initToggle: function initToggle() {
    // Open button
    document.querySelectorAll('[data-search-open]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        component.enableOverlay();
        component.open();
      });
    }); // Close button

    component.target.querySelector('[data-search-close]').addEventListener('click', function (event) {
      event.preventDefault();
      component.close();
    }); // Close search bar when click on the overlay

    component.target.querySelectorAll('[data-search-overlay-close]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        component.close();
      });
    }); // Close search on window resize

    window.addEventListener('screen-breakpoint', function (event) {
      component.close();
    }); // Close search on press escape

    window.addEventListener('escape', function (event) {
      component.close();
    });
  },

  /**
   * Open search bar
   * 
   * @returns {undefined}
   */
  open: function open() {
    document.querySelector('.site-header').classList.add('search-active');
    component.target.classList.add('active');
    document.querySelector('[data-search-input]').focus();
    component.openStatus = true;
    component.activeFocusTrap();
  },

  /**
   * Close search bar
   * 
   * @returns {undefined}
   */
  close: function close() {
    component.disableFocusTrap();
    document.querySelector('.site-header').classList.remove('search-active');
    component.target.classList.remove('active');
    component.disableOverlay();

    if (component.openStatus) {
      document.querySelector('[data-search-open]').focus();
    }

    component.openStatus = false;
  },

  /**
   * Init search bar focus trap
   * 
   * @returns {undefined}
   */
  initFocusTrap: function initFocusTrap() {
    component.focusTrap = focusTrap.createFocusTrap(component.target, {
      allowOutsideClick: true
    });
  },

  /**
   * Disable search bar focus trap
   * 
   * @returns {undefined}
   */
  disableFocusTrap: function disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  },

  /**
   * Ative search bar focus trap
   * 
   * @returns {undefined}
   */
  activeFocusTrap: function activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  },

  /**
  * Enable global overlay
   * 
   * @return {undefined}
  */
  enableOverlay: function enableOverlay() {
    var overlay = component.target.querySelector('[data-search-overlay-close]');

    if (overlay) {
      overlay.classList.add('active');
    }
  },

  /**
  * Disable global overlay
   * 
   * @return {undefined}
  */
  disableOverlay: function disableOverlay() {
    var overlay = component.target.querySelector('[data-search-overlay-close]');

    if (overlay) {
      overlay.classList.remove('active');
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/variant.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Variant
 *
 * @module variant
 */
var component = {
  /**
   * Init component
   * 
   * @return {boolean|undefined}
   */
  init: function init() {
    /**
     * Variant module api
     * 
     * @global
     */
    window.theme.variant = component;
  },

  /**
   * Trigger variant change with data
   * 
   * @public
   * @method
   * @name triggerVariantChange
   * @param {integer} variantId Variant id.
   * @param {object} product Product data.
   * @fires variant-change
   * @returns {object} Event variant-change.
   */
  triggerVariantChange: function triggerVariantChange(variantId, product) {
    var event = new CustomEvent('variant-change', {
      'detail': {
        variantId: variantId,
        variant: component.getVariant(variantId, product),
        product: product
      }
    });
    window.dispatchEvent(event);
    return event;
  },

  /**
   * Get variant data
   * 
   * @public
   * @method
   * @name getVariant
   * @param {integer} variantId Variant id.
   * @param {object} product Product data.
   * @returns {object} Variant data.
   */
  getVariant: function getVariant(variantId, product) {
    var variantData = null;
    product.variants.forEach(function (variant) {
      if (variant.id == variantId) variantData = variant;
    });
    return variantData;
  }
};
var _default = component;
exports.default = _default;
},{}],"components/tooltip.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var component = {
  /**
   * Init component
   * 
   * @returns {boolean|undefined}
   */
  init: function init() {
    component.target = document.querySelectorAll('[data-tooltip]');
    if (!component.target) return false;
    component.target.forEach(function (tooltip) {
      component._initEvents(tooltip);
    });
  },

  /**
  * Start to listen the click button
   * 
   * @param {object} tooltip A tooltip object.
   * @returns {undefined}
  */
  _initEvents: function _initEvents(tooltip) {
    if (tooltip) {
      var container = tooltip.querySelector('[data-tooltip-items]');
      tooltip.querySelector('[data-tooltip-link]').addEventListener('click', function (event) {
        event.preventDefault(); //If it is already activated

        if (tooltip.classList.contains("active")) {
          container.classList.remove("active");
          tooltip.classList.remove("active");
          document.body.classList.remove("tooltip-open"); //disable focus trap

          component._disableFocusTrap(); //disable overlay


          component._disableOverlay(tooltip);
        } else {
          //init tooltip focus trap
          component._initFocusTrap(tooltip); //active tooltip focus trap


          component._activeFocusTrap(); //focus tooltip element


          tooltip.focus();

          if (container) {
            //add active classes
            container.classList.add("active");
            tooltip.classList.add("active");
            document.body.classList.add("tooltip-open");
          } //enable page overlay


          component._enableOverlay(tooltip);
        }
      }); // Close icons div on press escape

      window.addEventListener('escape', function (event) {
        event.preventDefault();

        if (container) {
          container.classList.remove("active");
          tooltip.classList.remove("active");
          document.body.classList.remove("tooltip-open");
        } //disable focus trap


        component._disableFocusTrap(); //disable overlay


        component._disableOverlay(tooltip);
      }); // Close tooltip when click on overlay

      tooltip.querySelector('[data-tooltip-close]').addEventListener('click', function (event) {
        event.preventDefault();

        if (container) {
          container.classList.remove("active");
          tooltip.classList.remove("active");
          document.body.classList.remove("tooltip-open");
        } //disable focus trap


        component._disableFocusTrap(); //disable overlay


        component._disableOverlay(tooltip);
      });
    }
  },

  /**
  * Enable tooltip overlay
   * 
   * @param {object} tooltip A tooltip object.
   * @returns {undefined}
  */
  _enableOverlay: function _enableOverlay(tooltip) {
    tooltip.querySelector('[data-tooltip-close]').classList.add('active');
    tooltip.querySelector('[data-tooltip-close]').focus();
  },

  /**
  * Disable tooltip overlay
   * 
  * @param {object} tooltip A tooltip object.
  * @returns {undefined}
  */
  _disableOverlay: function _disableOverlay(tooltip) {
    tooltip.querySelector('[data-tooltip-close]').classList.remove('active');
  },

  /**
  * Init tooltip focus trap
   * 
   * @param {object} currently_tooltip A tooltip object.
   * @returns {undefined}
  */
  _initFocusTrap: function _initFocusTrap(currently_tooltip) {
    //Disable the last element with docus trap enabled
    if (component.focusTrap) {
      component._disableFocusTrap();
    }

    component.target.forEach(function (tooltip) {
      if (currently_tooltip == tooltip) {
        component.focusTrap = focusTrap.createFocusTrap(currently_tooltip, {
          clickOutsideDeactivates: true
        });
      }
    });
  },

  /**
  * Active tooltip focus trap
   * 
   * @returns {undefined}
  */
  _activeFocusTrap: function _activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  },

  /**
  * Disable tooltip focus trap
   * 
   * @returns {undefined}
  */
  _disableFocusTrap: function _disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/popup.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Popup
 *
 * @module popup
 */
var component = {
  /**
   * Init module
   * 
   * @returns {boolean|undefined}
   */
  init: function init() {
    component.target = document.querySelector("[data-popup]");
    if (!component.target) return false;

    component._initCloseEvents();

    component._open();
  },

  /**
  * start to listen the click button to close popup
   * @returns {undefined}
  */
  _initCloseEvents: function _initCloseEvents() {
    document.querySelector('[data-popup-close]').addEventListener('click', function (event) {
      event.preventDefault();

      component._close();
    });
  },

  /**
   * Close popup
   * 
   * @returns {undefined}
   */
  _close: function _close() {
    component.disableFocusTrap();
    setTimeout(function () {
      component.target.classList.remove("active");
      component.target.setAttribute('aria-hidden', 'true');
    }, 50);
  },

  /**
   * Open popup
   * 
   * @returns {undefined}
   */
  _open: function _open() {
    setTimeout(function () {
      component.target.classList.add("active");
      component.target.setAttribute('aria-hidden', 'false');
      component.activeFocusTrap();
    }, 50);
  },

  /**
   * Init popup focus trap
   * 
   * @returns {undefined}
   */
  initFocusTrap: function initFocusTrap() {
    component.focusTrap = focusTrap.createFocusTrap(component.target, {
      clickOutsideDeactivates: true
    });
  },

  /**
   * Ative popup focus trap
   * 
   * @returns {undefined}
   */
  activeFocusTrap: function activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  },

  /**
   * Disable popup focus trap
   * 
   * @returns {undefined}
   */
  disableFocusTrap: function disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"components/swatches.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Swatches
 *
 * @module swatches
 */
var component = {
  /**
   * Init component
   * 
   * @returns {undefined}
   */
  init: function init() {
    component.initOptions({
      imageSize: '70',
      imageExtension: 'png',
      divisor: '/'
    });
    /**
     * Swatches module api
     * 
     * @global
     */

    window.theme.swatches = component;
  },

  /**
   * Init component options.
   * 
   * @param {object} options Object options.
   * @returns {object} Object options.
   */
  initOptions: function initOptions(options) {
    component.options = options;

    if (typeof window.theme.swatches != 'undefined' && typeof window.theme.swatches.options != 'undefined') {
      component.options = _objectSpread(_objectSpread({}, component.options), window.theme.swatches.options);
    }

    return component.options;
  },

  /**
   * Get product swatches.
   * 
   * @param {object} product Product data.
   * @param {string} optionName Product option name.
   * @returns {Array} Product swatches array.
   */
  getSwatches: function getSwatches(product, optionName) {
    var swatches = [],
        option = component.getProductOptionByName(product, optionName);

    if (option) {
      var productSwatches = component.getSwatchImagesFromProduct(product);
      option.values.forEach(function (value) {
        var item = {
          "value": value
        };
        var variant = component.getVariantByOptionValue(product, option, value);

        if (variant) {
          item.image_id = variant.image_id;
          var image = component.getVariantImage(product, variant);

          if (image && image.alt) {
            // Format alt and convert char code 160 to 32
            var alt = image.alt.toLowerCase().trim().replace(/\s+/g, " ");

            if (productSwatches[alt]) {
              var src = image.src,
                  ext = window.theme.file.getExtension(src);
              item.src = src.replace(new RegExp(ext + '$'), '_' + component.options.imageSize + 'x' + ext);
            } else {
              item.src = component.getSwatchSrcFromFiles(option.name, value);
            }
          } else {
            item.src = component.getSwatchSrcFromFiles(option.name, value);
          }
        }

        swatches.push(item);
      });
    }

    return swatches;
  },

  /**
   * Get variant image.
   * 
   * @param {object} product Product data.
   * @param {object} variant Product variant data.
   * @returns {object} Variant image object.
   */
  getVariantImage: function getVariantImage(product, variant) {
    if (product.images) {
      return product.images.find(function (item) {
        return item.id == variant.image_id;
      });
    }
  },

  /**
   * Get product variant by option and value.
   * 
   * @param {object} product Product data.
   * @param {object} option Product option data.
   * @param {string} value Option value.
   * @returns {Array} Array with varaint data.
   */
  getVariantByOptionValue: function getVariantByOptionValue(product, option, value) {
    return product.variants.find(function (item) {
      return item['option' + option.position] == value;
    });
  },

  /**
   * Get product option by option name.
   * 
   * @param {object} product Product data.
   * @param {string} optionName Option name.
   * @returns {Array} Array with a product option with its values.
   */
  getProductOptionByName: function getProductOptionByName(product, optionName) {
    return product.options.find(function (item) {
      return item.name.toUpperCase() == optionName.toUpperCase();
    });
  },

  /**
   * Get swatch images from product level.
   * 
   * @param {object} product Product data.
   * @returns {Array} Array with swatch images from a product.
   */
  getSwatchImagesFromProduct: function getSwatchImagesFromProduct(product) {
    var swatches = [];

    if (product.images) {
      product.images.forEach(function (image) {
        if (image.alt) {
          var alt = image.alt.toLowerCase();

          if (alt.includes('swatch')) {
            var key = '';
            alt.split(component.options.divisor).forEach(function (label, index) {
              if (index < 2) {
                label = label.trim();

                if (index == 0) {
                  key = label;
                } else {
                  key = key + ' ' + component.options.divisor + ' ' + label;
                }
              }
            });
            swatches[key] = image;
          }
        }
      });
    }

    return swatches;
  },

  /**
   * Get a custom image swatch src from Shopify files.
   * 
   * @param {string} name Variant option title.
   * @param {string} value Variant option value.
   * @returns {string} Swatch image url from Shopify Files.
   */
  getSwatchSrcFromFiles: function getSwatchSrcFromFiles(name, value) {
    value = component.formatString(value);
    name = component.formatString(name);

    if (value == 'medium') {
      value = value + '_default';
    }

    if (typeof window.theme.file_url != 'undefined') {
      return window.theme.file_url.replace('files/?', 'files/swatch_-_' + name + '_-_' + value + '_' + component.options.imageSize + 'x.' + component.options.imageExtension + '?');
    } else {
      return '';
    }
  },

  /**
   * Format string.
   * 
   * @param {string} string Simple string.
   * @returns {string} Formated string.
   */
  formatString: function formatString(string) {
    return string.replace(/ /g, '_').toLowerCase();
  }
};
var _default = component;
exports.default = _default;
},{}],"components/product.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Product
 *
 * @module product
 */
var component = {
  /**
   * Init component
   * 
   * @returns {undefined}
   */
  init: function init() {
    /**
     * Product module api
     * 
     * @global
     */
    window.theme.product = component;
  },

  /**
   * Load product object by handle.
   * 
   * @public
   * @method
   * @name loadProduct
   * @todo Implement a test for this function.
   * @param {string} handle Product handle.
   * @param {string} extended Extend product data.
   * @returns {Promise} Promise object represents a product.
   */
  loadProduct: function loadProduct(handle, extended) {
    return new Promise(function (resolve, reject) {
      var cache = component.getCache(handle);

      if (cache) {
        if (!cache.extended && extended) {
          component.request(handle, extended).then(function (product) {
            resolve(product);
          });
        } else {
          resolve(cache);
        }
      } else {
        component.request(handle, extended).then(function (product) {
          resolve(product);
        });
      }
    });
  },

  /**
   * Make a request to get product data.
   * 
   * @public
   * @method
   * @name request
   * @todo Implement a test for this function.
   * @param {string} handle Product handle.
   * @param {string} extended Extend product data.
   * @returns {Promise} Promise object represents a product.
   */
  request: function request(handle, extended) {
    return new Promise(function (resolve, reject) {
      var url = extended ? '/products/' + handle + '?view=json' : '/products/' + handle + '.json';
      fetch(url).then(function (resp) {
        return resp.json();
      }).then(function (data) {
        if (data.product) {
          data = component.normalizeData(data);
          component.cache(data.product);
          resolve(data.product);
        } else {
          reject(data);
        }
      });
    });
  },

  /**
   * Normalize product data.
   * 
   * @private
   * @method
   * @name normalizeData
   * @todo Implement a test for this function.
   * @param {object} data Request data.
   * @returns {object} Normalized data.
   */
  normalizeData: function normalizeData(data) {
    // Fix options
    if (data.options_with_values) {
      data.product.options = data.options_with_values;
    } // Add options by name


    if (data.options_by_name) {
      data.product.options_by_name = data.options_by_name;
    } // Add extended flag


    if (data.extended) {
      data.product.extended = true;
    } // Fix images


    if (data.product.extended) {
      data.product.images = data.product.media;
    }

    return data;
  },

  /**
   * Check if a product has variants.
   * 
   * @public
   * @method
   * @name hasVariants
   * @param {object} product Product data.
   * @returns {boolean} Product has variants or not.
   */
  hasVariants: function hasVariants(product) {
    if (product.options.length == 1 && product.options[0].values.length == 1) {
      return false;
    } else {
      return true;
    }
  },

  /**
   * Chace a product data.
   * 
   * @private
   * @method
   * @name request
   * @param {object} product Product data.
   * @returns {boolean}
   */
  cache: function cache(product) {
    if (product.handle) {
      sessionStorage.setItem(product.handle, JSON.stringify(product));
      return true;
    } else {
      return false;
    }
  },

  /**
   * Get product from cache.
   * 
   * @private
   * @method
   * @name request
   * @param {string} handle Product handle.
   * @param {string} extended Extend product data.
   * @returns {Promise} Promise object represents a product.
   */
  getCache: function getCache(handle) {
    return JSON.parse(sessionStorage.getItem(handle));
  },

  /**
   * Check if the product is coming soon
   * 
   * @private
   * @method
   * @name isComingSoon
   * @param {object} product Product data.
   * @returns {boolean}
   */
  isComingSoon: function isComingSoon(product) {
    var result = false,
        productEvent = window.shopEvents[window.theme.handleize(product.vendor)];

    if (typeof productEvent != 'undefined') {
      if (productEvent.status == 'coming-soon') {
        result = true;
      }
    }

    return result;
  }
};
var _default = component;
exports.default = _default;
},{}],"components/filter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Filter
 *
 * @module filter
 */
var component = {
  /**
   * Init component
   * 
   * @returns {boolean|undefined}
   */
  init: function init() {
    component.target = document.querySelector('[data-filter]');
    if (!component.target) return false;
    component.closeFilter();
    component.initFocusTrap();
    component.initEvents();
  },

  /**
   * Init Events
   * 
   * @returns {undefined}
   */
  initEvents: function initEvents() {
    // Open button
    document.querySelector('[data-button-filter]').addEventListener('click', function (event) {
      event.preventDefault();
      component.openFilter();
    }); // Close button

    document.querySelectorAll('[data-filter-close]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        event.preventDefault();
        component.closeFilter();
      });
    }); // Close on window resize

    window.addEventListener('screen-breakpoint', function (event) {
      component.closeFilter();
    }); // Close on mouse over

    hoverintent(component.target, function () {}, function () {
      component.closeFilter();
    }); // Close filters on press escape

    window.addEventListener('escape', function (event) {
      component.closeFilter();
    }); // Check the option on enter key press

    document.querySelectorAll('[data-filter-input-option], [data-filter-checkbox-option]').forEach(function (element) {
      element.addEventListener('keypress', function (event) {
        event = event || window.event;
        var key = event.key || event.keyCode;

        if (key === 'Enter' || key === 13) {
          element.checked = !element.checked;
        }
      });
    }); // Selection control for list items

    document.querySelectorAll('[data-filter-list-option-link]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        var group = element.parentNode.parentNode.dataset.filterGroup;
        var items = document.querySelectorAll('[data-filter-group="' + group + '"] li');
        items.forEach(function (item) {
          item.classList.remove('selected');
        });
        element.parentNode.classList.add('selected');
      });
    }); // Sort by

    document.querySelectorAll('[data-sort-by-cards-item]').forEach(function (element) {
      element.addEventListener('click', function (event) {
        var group = element.dataset.filterGroup;
        var items = document.querySelectorAll('[data-filter-group="' + group + '"]');
        items.forEach(function (item) {
          if (item != element && item.checked) {
            item.checked = false;
          }
        });
      });
      element.addEventListener('keypress', function (event) {
        event = event || window.event;
        var key = event.key || event.keyCode;

        if (key === 'Enter' || key === 13) {
          element.click();
        }
      });
    });
  },

  /**
   * Open filter
   * 
   * @returns {undefined}
   */
  openFilter: function openFilter() {
    component.target.classList.remove('hidden');
    component.target.setAttribute('aria-hidden', 'false'); // We need to use set time out to avoid issues with filter animation

    setTimeout(function () {
      component.target.classList.add('active');
      component.target.querySelector('[data-filter-close]').focus();
      component.activeFocusTrap();
    }, 50);
  },

  /**
   * Close filter
   * 
   * @returns {undefined}
   */
  closeFilter: function closeFilter() {
    component.target.classList.remove("active");
    component.target.setAttribute('aria-hidden', 'true');
    component.disableFocusTrap(); // We need to use set time out to avoid issues with filter animation

    setTimeout(function () {
      component.target.classList.add('hidden');
    }, 700);
  },

  /**
   * Init Focus Trap
   * 
   * @returns {undefined}
   */
  initFocusTrap: function initFocusTrap() {
    component.focusTrap = focusTrap.createFocusTrap(component.target, {
      clickOutsideDeactivates: true
    });
  },

  /**
   * Disable Focus Trap
   * 
   * @returns {undefined}
   */
  disableFocusTrap: function disableFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.deactivate();
    }
  },

  /**
   * Active Focus Trap
   * 
   * @returns {undefined}
   */
  activeFocusTrap: function activeFocusTrap() {
    if (component.focusTrap) {
      component.focusTrap.activate();
    }
  }
};
var _default = component;
exports.default = _default;
},{}],"libs/medium-zoom.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * Medium Zoom Lib
 *
 * @module medium-zoom
 *  @version 1.0.0
 * 
 */
var component = {
  /**
   * Init module
      * @returns {undefined}
   */
  init: function init() {
    document.querySelectorAll('[data-zoomable] img').forEach(function (element) {
      var zoom = mediumZoom(element);
      element.addEventListener('click', function (event) {
        zoom.toggle();
      });
    });
  }
};
var _default = component;
exports.default = _default;
},{}],"app.js":[function(require,module,exports) {
"use strict";

var _detectTouch = _interopRequireDefault(require("./utils/detect-touch"));

var _detectBreakpoint = _interopRequireDefault(require("./utils/detect-breakpoint"));

var _money = _interopRequireDefault(require("./utils/money"));

var _handleize = _interopRequireDefault(require("./utils/handleize"));

var _escape = _interopRequireDefault(require("./utils/escape"));

var _file = _interopRequireDefault(require("./utils/file"));

var _debounce = _interopRequireDefault(require("./utils/debounce"));

var _serialize = _interopRequireDefault(require("./libs/serialize"));

var _cart = _interopRequireDefault(require("./components/cart"));

var _miniCart = _interopRequireDefault(require("./components/mini-cart"));

var _accordion = _interopRequireDefault(require("./components/accordion"));

var _quantitySelector = _interopRequireDefault(require("./components/quantity-selector"));

var _modal = _interopRequireDefault(require("./components/modal"));

var _searchBar = _interopRequireDefault(require("./components/search-bar"));

var _variant = _interopRequireDefault(require("./components/variant"));

var _tooltip = _interopRequireDefault(require("./components/tooltip"));

var _popup = _interopRequireDefault(require("./components/popup"));

var _swatches = _interopRequireDefault(require("./components/swatches"));

var _product = _interopRequireDefault(require("./components/product"));

var _filter = _interopRequireDefault(require("./components/filter"));

var _mediumZoom = _interopRequireDefault(require("./libs/medium-zoom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//  Global theme variables
//  _____________________________________________

/**
 * Main theme object
 * 
 * @global
 */
window.theme = window.theme || {};
/**
 * Theme scripts to load programmatically
 * 
 * @global
 */

window.theme.script = window.theme.script || {};
/**
 * Shopify file url
 * 
 * @global
 */

window.theme.file_url = window.theme.file_url || {};
/**
 * Current product data - Only available on product page
 * 
 * @global
 */

window.theme.currentProduct = window.theme.currentProduct || {}; //
//  Utils
//  _____________________________________________

_detectTouch.default.init();

_detectBreakpoint.default.init();

_money.default.init();

_escape.default.init();

_file.default.init();

_debounce.default.init();

_handleize.default.init(); //
//  Libs
//  _____________________________________________


_serialize.default.init();

_mediumZoom.default.init(); //
//  Components
//  _____________________________________________


_cart.default.init();

_miniCart.default.init();

_quantitySelector.default.init();

_modal.default.init();

_searchBar.default.init();

_accordion.default.init();

_variant.default.init();

_tooltip.default.init();

_popup.default.init();

_product.default.init();

_swatches.default.init();

_filter.default.init();
},{"./utils/detect-touch":"utils/detect-touch.js","./utils/detect-breakpoint":"utils/detect-breakpoint.js","./utils/money":"utils/money.js","./utils/handleize":"utils/handleize.js","./utils/escape":"utils/escape.js","./utils/file":"utils/file.js","./utils/debounce":"utils/debounce.js","./libs/serialize":"libs/serialize.js","./components/cart":"components/cart.js","./components/mini-cart":"components/mini-cart.js","./components/accordion":"components/accordion.js","./components/quantity-selector":"components/quantity-selector.js","./components/modal":"components/modal.js","./components/search-bar":"components/search-bar.js","./components/variant":"components/variant.js","./components/tooltip":"components/tooltip.js","./components/popup":"components/popup.js","./components/swatches":"components/swatches.js","./components/product":"components/product.js","./components/filter":"components/filter.js","./libs/medium-zoom":"libs/medium-zoom.js"}]},{},["app.js"], null)
//# sourceMappingURL=/bundle.js.map