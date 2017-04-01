import _ from 'lodash';
import React from 'react'

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

export const getStatusNames = (addAll = false) => {
    let res = []
    if(addAll) res.push({id:'',name:'All states'})
    res.push({id:'new', name:'New', color:"#bbae09"})
    res.push({id:'inprogress',name:'In progress', color: "#9ED2DC"})
    res.push({id:'closed',name:'Closed', color: "#387397"})
    return res
}

export const resolveStatusName = (id, resolveAsWidget = false) => {
    const e = _.find(getStatusNames(), {id})
    if (!e) return {}
    if (!resolveAsWidget) return e.name
    return (
        <span style={{'background':e.color}}>{e.name}</span>
    )
}