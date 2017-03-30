export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION'
export const CLEAR_NOTIFICATION = 'CLEAR_NOTIFICATION'

export function notify(message, options={}) {
    return {
        type: PUSH_NOTIFICATION,
        notification: { ...options, message }
    }
}

export function clearNotification(id) {
    return {
        type: CLEAR_NOTIFICATION,
        payload: { id }
    }
}
