# redux-bundler-react

![](https://img.shields.io/npm/dm/redux-bundler-react.svg)![](https://img.shields.io/npm/v/redux-bundler-react.svg)![](https://img.shields.io/npm/l/redux-bundler-react.svg)

Bindings for redux-bundler to React

## install

```
npm install redux-bundler-react
```

## example / docs

Similar to [react-redux](https://github.com/reactjs/react-redux) this has two exports, `Provider` and `connect`.

`Provider` puts the store into the `context` so that connected components can get access to it:

```js
import { connect, Provider } from 'redux-bundler-react'
import getStore from './bundles'
import AppRoot from './app-root'

export default () => (
  <Provider store={getStore()}>
    <AppRoot />
  </Provider>
)
```

`connect` works a bit differently for redux-bundler than you may be used to. You pass it the string names of the selectors and action creators you want to grab from the store. The last argument should always be the component itself.

```js
import { connect } from 'redux-bundler-react'

const MyComponent = ({ myValue, myOtherValue, doInitiateSignIn }) => (
  <div onClick={doInitiateSignIn}>
    {myValue} {myOtherValue}
  </div>
)

// Here we use `connect()` to specify which selector values and action creators
// that we want to use.
// Note that it is quite inexpensive to connect many components since the diffing
// happens outside of the component entirely.
// If you try to connect something that doesn't exist, it will error at runtime
// for easier debugging
export default connect(
  'selectMyValue',
  'selectMyOtherValue',
  'doInitiateSignIn',
  MyComponent
)
```

## credits

Thanks to @developit and @marvinroger for getting this going.

## changelog

- `1.2.0` - Fix display name wrapping and decorate with "connect": `connect(WrappedComponent)`.
- `1.1.1` - Fixed publishing issue.
- `1.1.0` - Pass through display name of wrapped component. Thanks [@aulneau](https://github.com/aulneau)!
- `1.0.1` - Support `store.action` method if available for easier support for running in a worker. Thanks [@huygn](https://github.com/huygn)
- `1.0.0` - Initial publish

## license

[MIT](http://mit.joreteg.com/)
