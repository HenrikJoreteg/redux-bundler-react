(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.reduxBundlerReact = {}),global.react));
}(this, (function (exports,react) {
  var CONTEXT_TYPES = {
    store: function () {}
  };
  var Provider = /*@__PURE__*/(function (Component) {
    function Provider () {
      Component.apply(this, arguments);
    }

    if ( Component ) Provider.__proto__ = Component;
    Provider.prototype = Object.create( Component && Component.prototype );
    Provider.prototype.constructor = Provider;

    Provider.prototype.getChildContext = function getChildContext () {
      return {
        store: this.props.store
      };
    };

    Provider.prototype.render = function render () {
      return react.Children.only(this.props.children);
    };

    return Provider;
  }(react.Component));
  Provider.childContextTypes = CONTEXT_TYPES;
  var connect = function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var Comp = args.slice(-1)[0];
    var strings = args.length > 1 ? args.slice(0, -1) : [];
    var actionCreators = [];
    var keysToWatch = [];
    strings.forEach(function (str) {
      if (str.slice(0, 6) === 'select') {
        keysToWatch.push(str);
        return;
      }

      if (str.slice(0, 2) === 'do') {
        actionCreators.push(str);
        return;
      }

      throw Error(("CanNotConnect " + str));
    });

    var Connect = /*@__PURE__*/(function (Component) {
      function Connect(props, context) {
        var this$1 = this;

        Component.call(this, props, context);
        var store = context.store;
        this.state = store.select(keysToWatch);
        this.unsubscribe = store.subscribeToSelectors(keysToWatch, this.setState.bind(this));
        this.actionCreators = {};
        actionCreators.forEach(function (name) {
          this$1.actionCreators[name] = function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            if (store.action) {
              return store.action(name, args);
            }

            return store[name].apply(store, args);
          };
        });
      }

      if ( Component ) Connect.__proto__ = Component;
      Connect.prototype = Object.create( Component && Component.prototype );
      Connect.prototype.constructor = Connect;

      Connect.prototype.componentWillUnmount = function componentWillUnmount () {
        this.unsubscribe();
      };

      Connect.prototype.render = function render () {
        return react.createElement(Comp, Object.assign({}, this.props, this.state, this.actionCreators));
      };

      return Connect;
    }(react.Component));

    Connect.contextTypes = CONTEXT_TYPES;
    Connect.displayName = 'connect(' + (Comp.displayName || Comp.name) + ')';
    return Connect;
  };

  exports.Provider = Provider;
  exports.connect = connect;

})));
//# sourceMappingURL=index.umd.js.map
