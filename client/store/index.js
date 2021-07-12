import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import auth from './auth'
import { tripDataReducer } from './tripData'
import { userTripsReducer  } from './userTripsData'
import { userTripReducer  } from './userTripData'

const reducer = combineReducers({
   auth,
   tripDataReducer,
   userTripsReducer,
   userTripReducer })
 
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './auth'
