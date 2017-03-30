import { CALL_API } from '../middlewares/api';

// There are three possible states for our login
// process and we need actions for each of them
export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILURE = 'LOGIN_FAILURE'

// Three possible states for our logout process as well.
// Since we are using JWTs, we just need to remove the token
// from localStorage. These actions are more useful if we
// were calling the API to log the user out
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE'

import {
    LOCAL_STORAGE_ID_TOKEN,
    LOCAL_STORAGE_MODEL_ID,
    LOCAL_STORAGE_BASIC_TOKEN
} from '../helpers/constants'

function requestLogout() {
    return {
        type: LOGOUT_REQUEST,
        isFetching: true,
        isAuthenticated: false
    }
}

function receiveLogout() {
    return {
        type: LOGOUT_SUCCESS,
        isFetching: false,
        isAuthenticated: false
    }
}

// Calls the API to get a token and
// dispatches actions along the way
export function loginUser(creds, router) {

    const base64 = btoa(creds.username + ':' + creds.password)
    console.log(base64)
    return {
        [CALL_API]: {
            endpoint: 'jwt',
            method: 'GET',
            headers: {
                "Authorization" : "Basic " + base64
            },
            //body: `username=${creds.username}&password=${creds.password}`,
            creds,
            types: [ LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE ]
        }
    };
}

// Logs the user out
export function logoutUser(router) {
    return dispatch => {
        localStorage.removeItem(LOCAL_STORAGE_ID_TOKEN);
        localStorage.removeItem(LOCAL_STORAGE_MODEL_ID);
        localStorage.removeItem(LOCAL_STORAGE_BASIC_TOKEN);
        dispatch(requestLogout())
        dispatch(receiveLogout())
        if (router) {
            router.push('/login');
        }
    }
}
