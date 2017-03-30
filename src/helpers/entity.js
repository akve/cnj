import _ from 'lodash';
import {
    TRANSITION_VIEW,
    TRANSITION_MODIFY,
    TRANSITION_CREATE,
    TRANSITION_EDIT,
    TRANSITION_DELETE
} from './constants'

export const findEntity = (universe, moduleName, entityName) => {
    let result = null;

    universe.universe.forEach(module => {
        if (module.name === moduleName) {
            module.entities.forEach(entity => {
                if (entity.name === entityName) {
                    result = entity;
                }
            });
        }
    });

    return result;
}

export const isModify = (transition) => ['modify', 'edit'].includes(transition);

export const isTransition = name => [
    TRANSITION_EDIT,
    TRANSITION_CREATE,
    TRANSITION_MODIFY,
    TRANSITION_DELETE
].includes(name);

export const isView = (transition) => ['main', 'view'].includes(transition);

export const getTransitionName = (transition) => {
    switch (transition) {
        case 'modify':
        case 'edit':
            return TRANSITION_MODIFY;
        case 'view':
        case 'main':
            return TRANSITION_VIEW;
        case 'create':
            return TRANSITION_CREATE;
        case 'delete':
            return TRANSITION_DELETE;
        default:
    }
}
