import { createElement, Component, Children } from 'react'

const CONTEXT_TYPES = {
  store: () => {}
}

export class Provider extends Component {
  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    return Children.only(this.props.children)
  }
}

Provider.childContextTypes = CONTEXT_TYPES

export const connect = (...args) => {
  const Comp = args.slice(-1)[0]
  const strings = args.length > 1 ? args.slice(0, -1) : []
  const actionCreators = []
  const keysToWatch = []
  strings.forEach(str => {
    if (str.slice(0, 6) === 'select') {
      keysToWatch.push(str)
      return
    }
    if (str.slice(0, 2) === 'do') {
      actionCreators.push(str)
      return
    }
    throw Error(`CanNotConnect ${str}`)
  })

  class Connect extends Component {
    constructor(props, context) {
      super(props, context)
      const store = context.store
      this.state = store.select(keysToWatch)
      this.unsubscribe = store.subscribeToSelectors(
        keysToWatch,
        this.setState.bind(this)
      )
      this.actionCreators = {}
      actionCreators.forEach(name => {
        this.actionCreators[name] = (...args) => {
          if (store.action) {
            return store.action(name, args)
          }
          return store[name](...args)
        }
      })
    }

    componentWillUnmount() {
      this.unsubscribe()
    }

    render() {
      return createElement(
        Comp,
        Object.assign({}, this.props, this.state, this.actionCreators)
      )
    }
  }
  Connect.contextTypes = CONTEXT_TYPES
  Connect.displayName = 'connect(' + (Comp.displayName || Comp.name) + ')'
  return Connect
}
