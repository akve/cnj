import _ from 'lodash'
import {
    ENTITY_REQUEST,
    ENTITY_SUCCESS,
    ENTITY_FAILURE,
    UPDATE_ENTITY_REQUEST,
    UPDATE_ENTITY_SUCCESS,
    UPDATE_ENTITY_FAILURE,
    CHANGE_ENTITY,
    ENTITY_COUNT_REQUEST,
    ENTITY_COUNT_SUCCESS,
    ENTITY_COUNT_FAILURE,
    DELETE_ENTITY_SUCCESS,
    UPDATE_LAST_ENTITY,
    CREATE_ENTITY_REQUEST,
    CREATE_ENTITY_SUCCESS,
    CREATE_ENTITY_FAILURE,
    calcStoreKey
} from '../actions/entity'

const initialState = {
    isFetching: false,
    entity: {},
    errorMessage: null
}

function entity(state = initialState, action) {
    if (action.type === 'LOGOUT_SUCCESS') {
        return initialState;
    }

    if (action instanceof Error) {
        return state;
    }

    if ([
        ENTITY_REQUEST,
        ENTITY_SUCCESS,
        ENTITY_FAILURE,
        UPDATE_ENTITY_REQUEST,
        UPDATE_ENTITY_SUCCESS,
        UPDATE_ENTITY_FAILURE,
        ENTITY_COUNT_REQUEST,
        ENTITY_COUNT_SUCCESS,
        ENTITY_COUNT_FAILURE,
        DELETE_ENTITY_SUCCESS,
        CHANGE_ENTITY,
        UPDATE_LAST_ENTITY,
        CREATE_ENTITY_FAILURE,
        CREATE_ENTITY_SUCCESS,
        CREATE_ENTITY_REQUEST
    ].indexOf(action.type) <0) return state;

    var key = calcStoreKey(action.entity);

    var entityState = state[key] ? Object.assign({}, state[key]) : {};
    var newState = Object.assign({}, state);

    let entity;

    switch (action.type) {
        case ENTITY_REQUEST:
        case UPDATE_ENTITY_REQUEST:
            entityState.isFetching = true;
            entityState.entity = action.entity;
            break;
        case ENTITY_SUCCESS:
            entity = _.omit(action.entity, 'silent');

            const response = action.response;

            entityState.isFetching = false;
            entityState.errorMessage = '';
            entityState.entity = entity;

            if (!action.entity.silent) {
                newState.lastEntity = entity;
            }

            entityState.result = response;
            entityState.loaded = new Date();
            entityState.universe = response;
            break;
        case ENTITY_FAILURE:
            entityState.isFetching = false;
            entityState.errorMessage = action.error;
            break;
        case UPDATE_ENTITY_SUCCESS:
            entityState.isFetching = false;
            entityState.errorMessage = '';
            entityState.loaded = new Date();
            entityState.result = action.response;

            Object.assign(entityState.universe[0], action.body);
            break;
        case UPDATE_ENTITY_FAILURE:
            entityState.errorMessage = action.error
            break;
        case CHANGE_ENTITY:
            entityState.entity = action.entity;
            newState.lastEntity = action.entity;
            break;
        case ENTITY_COUNT_REQUEST:
            entityState.isFetching = true;
            break;
        case ENTITY_COUNT_SUCCESS:
            entityState.isFetching = false;
            entityState.totalCount = _.result(action.response, 'count');
            break;
        case ENTITY_COUNT_FAILURE:
            entityState.isFetching = false;
            entityState.errorMessage = action.response;
            break;
        case DELETE_ENTITY_SUCCESS:
            if (_.result(action, 'entity.action') === 'list') {
              _.remove(entityState.result, { id: action.response[0].id });
              _.remove(entityState.universe, { id: action.response[0].id });
            }
            break;
        case UPDATE_LAST_ENTITY:
            entity = action.entity;

            newState.lastEntity = entity;
            entityState.entity = entity;
            break;
        case CREATE_ENTITY_REQUEST:
            entityState.isFetching = true;
            break;
        case CREATE_ENTITY_SUCCESS:
            entityState.isFetching = false;
            entityState.errorMessage = action.response[0].status || '';
            break;
        default:
            return state;
    }

    if (!action.entity.silent) {
        newState[key] = entityState;
    }

    return newState;
}


export default entity
