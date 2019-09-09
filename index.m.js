import { createElement, Component, Children } from 'react';

var CONTEXT_TYPES = {
  store: function () {}
};
var Provider = /*@__PURE__*/(function (Component$$1) {
  function Provider () {
    Component$$1.apply(this, arguments);
  }

  if ( Component$$1 ) Provider.__proto__ = Component$$1;
  Provider.prototype = Object.create( Component$$1 && Component$$1.prototype );
  Provider.prototype.constructor = Provider;

  Provider.prototype.getChildContext = function getChildContext () {
    return {
      store: this.props.store
    };
  };

  Provider.prototype.render = function render () {
    return Children.only(this.props.children);
  };

  return Provider;
}(Component));
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

  var Connect = /*@__PURE__*/(function (Component$$1) {
    function Connect(props, context) {
      var this$1 = this;

      Component$$1.call(this, props, context);
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

    if ( Component$$1 ) Connect.__proto__ = Component$$1;
    Connect.prototype = Object.create( Component$$1 && Component$$1.prototype );
    Connect.prototype.constructor = Connect;

    Connect.prototype.componentWillUnmount = function componentWillUnmount () {
      this.unsubscribe();
    };

    Connect.prototype.render = function render () {
      return createElement(Comp, Object.assign({}, this.props, this.state, this.actionCreators));
    };

    return Connect;
  }(Component));

  Connect.contextTypes = CONTEXT_TYPES;
  Connect.displayName = 'connect(' + (Comp.displayName || Comp.name) + ')';
  return Connect;
};

export { Provider, connect };
//# sourceMappingURL=index.m.js.map
