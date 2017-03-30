import { CALL_API } from '../middlewares/api';
import { findEntity } from '../helpers/entity';
import _ from 'lodash';
export const ENTITY_REQUEST = 'ENTITY_REQUEST'
export const ENTITY_SUCCESS = 'ENTITY_SUCCESS'
export const ENTITY_FAILURE = 'ENTITY_FAILURE'
export const UPDATE_ENTITY_REQUEST = 'UPDATE_ENTITY_REQUEST'
export const UPDATE_ENTITY_SUCCESS = 'UPDATE_ENTITY_SUCCESS'
export const UPDATE_ENTITY_FAILURE = 'UPDATE_ENTITY_FAILURE'
export const CHANGE_ENTITY = 'CHANGE_ENTITY'
export const ENTITY_COUNT_REQUEST = 'ENTITY_COUNT_REQUEST'
export const ENTITY_COUNT_SUCCESS = 'ENTITY_COUNT_SUCCESS'
export const ENTITY_COUNT_FAILURE = 'ENTITY_COUNT_FAILURE'
export const CREATE_ENTITY_REQUEST = 'CREATE_ENTITY_REQUEST'
export const CREATE_ENTITY_SUCCESS = 'CREATE_ENTITY_SUCCESS'
export const CREATE_ENTITY_FAILURE = 'CREATE_ENTITY_FAILURE'
export const DELETE_ENTITY_REQUEST = 'DELETE_ENTITY_REQUEST'
export const DELETE_ENTITY_SUCCESS = 'DELETE_ENTITY_SUCCESS'
export const DELETE_ENTITY_FAILURE = 'DELETE_ENTITY_FAILURE'
export const UPDATE_LAST_ENTITY = 'UPDATE_LAST_ENTITY'

export function calcStoreKey({entityName, id}) {
    if (!entityName || !id) {
        console.error('Invalid data');
    }
    return entityName + ":" + id;
}

export function updateLastEntity(id, entityName, action) {
    return {
        type: UPDATE_LAST_ENTITY,
        entity: {
            id,
            action,
            entityName
        }
    }
}

export function loadEntity(idOrList, entityName, additionalOptions = {offset:0, limit:10}) {
    const requestedEntity = { id:idOrList, entityName };


    let endpoint;
    //let props;

    if (idOrList === 'list') {
        endpoint = entityName + "s";
        //props = additionalOptions;
    } else {
        endpoint = entityName + "/" + idOrList;
        //props = { id: idOrList };
    }

    return {
        [CALL_API]: {
            entity: requestedEntity,
            endpoint: endpoint, //+ '?' + props,
            method: 'GET',
            types: [ 'ENTITY_REQUEST', 'ENTITY_SUCCESS', 'ENTITY_FAILURE' ]
        }
    };
}

export function updateEntity(id, data, keyEntity) {

    return {
        [CALL_API]: {
            body : data,
            endpoint: keyEntity,
            entity: keyEntity,
            method: "PUT",
            types: [ UPDATE_ENTITY_REQUEST, UPDATE_ENTITY_SUCCESS, UPDATE_ENTITY_FAILURE ]
        }
    };
}

export function changeEntity(entity) {
    return {
        type: CHANGE_ENTITY,
        entity
    }
}

export function loadEntityCount(entity) {
    return {
        [CALL_API]: {
            entity,
            endpoint: `${entity.module}/${entity.entityName}/count`,
            method: 'GET',
            types: [ ENTITY_COUNT_REQUEST, ENTITY_COUNT_SUCCESS, ENTITY_COUNT_FAILURE ]
        }
    };
}

export function createEntity(data, keyEntity, universe) {
    const entity = findEntity(universe, keyEntity.module, keyEntity.entityName);
    const transition = _.find(entity.transitions, { name: keyEntity.action });
    const bodyAllowedKeys = Object.keys(transition.requestBody);
    const body = _.pick(data, bodyAllowedKeys);

    for (let key in body) {
        if (body[key] && body[key].id) {
            body[key] = body[key].id
        }
    }

    return {
        [CALL_API]: {
            body,
            endpoint: transition.invocationUrl.replace('/', ''),
            method: transition.invocationVerb,
            entity: keyEntity,
            types: [ CREATE_ENTITY_REQUEST, CREATE_ENTITY_SUCCESS, CREATE_ENTITY_FAILURE ]
        }
    }
}

export function deleteEntity(data, keyEntity, transition) {
    const { invocationUrl, invocationVerb } = transition;

    return {
        [CALL_API]: {
            endpoint: invocationUrl.replace('/', ''),
            method: invocationVerb,
            entity: keyEntity,
            body: data,
            types: [ DELETE_ENTITY_REQUEST, DELETE_ENTITY_SUCCESS, DELETE_ENTITY_FAILURE ]
        }
    }
}
