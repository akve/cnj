
import {
    PUSH_NOTIFICATION,
    CLEAR_NOTIFICATION
} from '../actions/general'
import _ from 'lodash'

const initialState = {
    shouldUpdateModel: false,
    notifications: []
}

export default function general(state = initialState, action) {
    if (action.type === 'LOGOUT_SUCCESS') {
        return initialState;
    }

    let notifications;

    switch (action.type) {
        case PUSH_NOTIFICATION:
            notifications = _.cloneDeep(state.notifications)

            notifications.push({
                timestamp: Date.now(),
                content: action.notification
            })

            return {
                ...state,
                notifications
            }
        case CLEAR_NOTIFICATION:
            notifications = _.cloneDeep(state.notifications)

            notifications.shift()

            return {
                ...state,
                notifications
            }
        default:
            return state;
    }
}
