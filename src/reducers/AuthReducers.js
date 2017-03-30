import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT_SUCCESS
    //,
    //QUOTE_REQUEST, QUOTE_SUCCESS, QUOTE_FAILURE
} from '../actions/auth'

const initialState = () => ({
    isFetching: false,
    isAuthenticated: localStorage.getItem('id_token') ? true : false
})

function auth(state = initialState(), action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            /*const creds = action.body.split('&').reduce((prev, curr) => {
                const pair = curr.split('=');
                prev[pair[0]] = pair[1];
                return prev;
            }, {});*/

            return {
                ...state,
                creds : action.creds,
                isFetching: true,
                isAuthenticated: false
            };
        case LOGIN_SUCCESS:
            const { jwt } = action.response[0];

            if (jwt) {
                return {
                    ...state,
                    isFetching: false,
                    isAuthenticated: true,
                    id_token: action.response[0].jwt,
                    errorMessage: ''
                };
            }

            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                errorMessage: 'Incorrect creds'
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isFetching: false,
                isAuthenticated: false,
                message: action.response
            }
        case LOGOUT_SUCCESS:
            return initialState();
        default:
            return state
    }
}


export default auth
