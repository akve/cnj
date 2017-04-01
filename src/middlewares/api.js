import config from '../config'
import _ from 'lodash'

const BASE_URL = config.server_base

export function callApi({ endpoint, method, body, headers}) { // { endpoint, authenticated, method, body, headers}
    // let token = localStorage.getItem('id_token') || null
    if (!headers) headers = {}
    if (!headers.Authorization) {
        if (window.localStorage.id_token) {
            headers["Authorization"] = "Bearer " + window.localStorage.id_token
        } else {
            if (window.localStorage.basic_token) {
                headers["Authorization"] = "Basic " + window.localStorage.basic_token
            }
        }
    }

    //if (config.dev) {
        headers["Content-Type"] = "application/json";
    //}

    const cfg = {
        method,
        headers,
        body: typeof body === 'string' ? body : JSON.stringify(body)
    };

    console.log('FETCH: ', BASE_URL + endpoint, cfg);

    function handleErrors(response) {
        console.log("HE",response.ok, response)
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    return fetch(BASE_URL + endpoint, cfg)
        .then(handleErrors)
        .then((data) => {

            return data.json()
        }).catch(err => {
            console.log(err)
            return Promise.reject(err)
        })
}

export const CALL_API = Symbol('Call API')

export default store => next => action => {
    if (!action) { return; }

    const callAPI = action[CALL_API]

    // So the middleware doesn't get applied to every single action
    if (typeof callAPI === 'undefined') {
        return next(action)
    }

    let { types, ...rest } = callAPI // let { types, authenticated, ...rest } = callAPI

    const [ requestType, successType, errorType ] = types

    next({ type: requestType, ...rest });

    // Passing the authenticated boolean back in our data will let us distinguish between normal and secret quotes
    return callApi(callAPI).then(
        response =>
            next({
                ...rest,
                response,
                type: successType
            }),
        error => next({
            ...rest,
            error: error.message || 'There was an error.',
            type: errorType
        })
    )
}
