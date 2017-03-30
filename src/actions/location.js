export const LOCATION_CHANGE = 'LOCATION_CHANGE'

export function locationChange (location = '/') {
    return {
        type : LOCATION_CHANGE,
        payload : location
    }
}

export const updateLocation = ({ dispatch }) => {
    return (nextLocation) => dispatch(locationChange(nextLocation))
}
