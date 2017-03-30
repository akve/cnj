import { LOCATION_CHANGE } from '../actions/location';

const initialState = null;

export default function location (state = initialState, action) {
    if (action.type === 'LOGOUT_SUCCESS') {
        return initialState;
    }

    switch (action.type) {
        case LOCATION_CHANGE:
            const newLocation = Object.assign(action.payload, {
                prevPath: state
            });

            return Object.assign({}, state, newLocation);
        default:
            return state;
    }
}
