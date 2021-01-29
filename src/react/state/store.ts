import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import { createHashHistory } from 'history'
import createRootReducer from './reducers'

import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
// import reducers from './reducers'

const history = createHashHistory()
const rootReducer = createRootReducer(history)

// const actionCreators = {
//   // ...counterActions,
//   ...routerActions
// }

// Redux DevTools Configuration
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//     // Options: http://extension.remotedev.io/docs/API/Arguments.html
//     actionCreators
//   })
//   : compose

const middleware = []
const enhancers = []

middleware.push(thunk)
const router = routerMiddleware(history)
middleware.push(router)

enhancers.push(applyMiddleware(...middleware))

// const enhancer = composeEnhancers(...enhancers)
const enhancer = composeWithDevTools(...enhancers)

export const store = createStore(rootReducer, {}, enhancer)

// export const store = createStore(reducers, {}, applyMiddleware(thunk))
