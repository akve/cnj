import { combineReducers } from 'redux'
import location from './LocationReducers'
import auth from './AuthReducers'
import entity from './EntityReducers'
import general from './GeneralReducer'
import { reducer as reduxAsyncConnect } from 'redux-async-connect'

export const makeRootReducer = (asyncReducers) => {
    return combineReducers({
        reduxAsyncConnect,
        general,
        location,
        auth,
        entity,
        ...asyncReducers
    })
}

export const injectReducer = (store, { key, reducer }) => {
    if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

    store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
