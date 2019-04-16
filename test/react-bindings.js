const { createElement } = require('react')
const test = require('tape')
const { composeBundlesRaw, createSelector } = require('redux-bundler')
const render = require('react-dom/server').renderToStaticMarkup
const { connect, Provider } = require('../')

const getStore = composeBundlesRaw({
  name: 'numberBundle',
  reducer: (state = 0, { type, payload }) => {
    if (type === 'INCREMENT') {
      return state + 1
    }
    if (type === 'DECREMENT') {
      return state - 1
    }
    return state
  },
  selectNumber: state => state.numberBundle,
  selectIsPositive: createSelector('selectNumber', number => number > 0)
})

const Page = ({ number }) => createElement('div', null, number)

const Connected = connect(
  'selectNumber',
  Page
)

const base = store =>
  createElement(Provider, { store }, createElement(Connected))

test('react bindings', t => {
  const store = getStore()
  const component = base(store)

  t.deepEqual(store.subscriptions.watchedSelectors, {})
  t.equal(render(component), '<div>0</div>', 'should be zero in a div')
  t.deepEqual(store.subscriptions.watchedValues, { number: 0 })
  store.dispatch({ type: 'INCREMENT' })
  t.deepEqual(store.subscriptions.watchedValues, { number: 1 })
  t.deepEqual(store.subscriptions.watchedSelectors, { selectNumber: 1 })
  t.equal(render(component), '<div>1</div>', 'should now be 1 in a div')

  t.end()
})

test('react component displayName', t => {
  const ConnClass = connect(class MyClass {})
  const ConnDisplayName = connect(class Class { static get displayName() { return 'DispName' } })
  const ConnAnon = connect(() => {})

  t.equal(Connected.displayName, 'Page', 'should be Page')
  t.equal(ConnClass.displayName, 'MyClass', 'should be MyClass')
  t.equal(ConnDisplayName.displayName, 'DispName', 'should be DispName')
  t.equal(ConnAnon.displayName, '', 'should be empty')

  t.end()
})
