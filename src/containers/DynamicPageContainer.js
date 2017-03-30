import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SinglePartRenderer from '../components/Entity/SinglePartRenderer';
import { loadEntity, calcStoreKey, loadEntityCount, deleteEntity } from '../actions/entity';
import update from 'react-addons-update';
//import EntityModal from '../components/DynamicPage/EntityModal';
import { didUpdateModel, updateModel } from '../actions/model'
import { findEntity } from '../helpers/entity';

class DynamicPage extends Component {

    static childContextTypes = {
        form: PropTypes.object.isRequired,
        isPlainView: PropTypes.bool.isRequired,
        modelType: PropTypes.string.isRequired,
        deleteEntity: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired
    }

    state = {
        data: {},
        entityConfigs: {},
        fields: {},
        openModal: false,
        totalDataSize: null,
        isTotalDataSizeFetching: false,
        errorMessage: null
    }

    getChildContext = function() {
        return {
            form: this,
            isPlainView: true,
            modelType: 'pages',
            deleteEntity: this.handleDeleteEntity,
            location: this.props.location
        };
    }

    getData() {
        return this.state.data;
    }

    registerField(name, widget) {
        this.setState(update(this.state, {
            fields: { [name]: {$set: widget} }
        }));
    }

    unregisterField(name) {
        this.setState(update(this.state, {
            fields: { [name]: {$set: null} }
        }));
    }

    handleChildrenData = (_data) => {
        const { field, data } = _data;

        if (field === 'dataList') {
            this.setState({ entityConfigs: data });
            this.props.loadEntity('list', data.module, data.entity, 'list', this.props.universe);
            this.props.loadEntityCount({
                module: data.module,
                entityName: data.entity,
                id: 'list'
            });
        }
    }

    handlePageChange(index, pageSize) {
        const { module, entity } = this.state.entityConfigs;
        this.props.loadEntity('list', module, entity, 'list', this.props.universe, { offset: index, limit: pageSize });
    }

    componentWillReceiveProps(newProps) {
        const newEntity = _.result(newProps, 'entity');
        const oldEntity = _.result(this.props, 'entity');
        const isEntityChanged = !_.isEqual(newEntity, oldEntity);
        const isModelUpdating = !this.props.general.shouldUpdateModel && newProps.general.shouldUpdateModel;

        if (isEntityChanged) {
            const { entity, module } = this.state.entityConfigs;
            const currEntity = _.result(newEntity, `${module}:${entity}:list`);
            const entitiesList = _.result(currEntity, 'result');
            const entitiesCount = _.result(currEntity, 'totalCount');
            const entityError = currEntity ? currEntity.errorMessage : newProps.uiModel.errorMessage;

            if (entityError) {
                this.setState({ errorMessage: entityError });
            } else {
                if (this.state.errorMessage) {
                    this.setState({ errorMessage: null });
                }
            }

            const entityDefinition = findEntity(this.props.universe, module, entity);

            if (entityDefinition) {
                const transitionPredicate = item => item.category !== "create";
                const { transitions } = entityDefinition;
                const allowedTransitions = transitions.filter(transitionPredicate);
                const createTransitions = transitions.filter(item => item.category === 'create');

                if (entitiesList) {
                    this.setState(update(this.state, {
                        data: {
                            dataList: {$set: {
                                allowedTransitions,
                                createTransitions,
                                list: entitiesList,
                                dataTotalSize: entitiesCount
                            }}
                        }
                    }));
                }
            }
        }

        if (isModelUpdating) {
            this.handleSaveUiModel();
        }
        //
        // const entityConfigs = _.result(this.state, 'data.entityConfigs');
        //
        // if (entityConfigs) {
        //     this.loadData({...entityConfigs, id: 'list'});
        // }
    }

    render() {
        const pages = _.result(this.props, 'uiModel.model.pages');
        const currPage = _.find(pages, { link: `/pages/${this.props.params.page}` });
        const { errorMessage } = this.state;

        if (!currPage) { return null; }

        const { title } = currPage;

        return (
            <div className="dynamic-page">
                {this.renderBreadcrumbs(title)}

                <h2>{title}</h2>

                {errorMessage
                    ? errorMessage
                    : <ViewPartRenderer
                        view={currPage}
                        data={this.state.data}
                        isForm={false}
                        canModify={this.props.uiModel.showUiPanel}
                    ></ViewPartRenderer>
                }
            </div>
        );
    }

    renderBreadcrumbs(title) {
        return <ol className="breadcrumb">
            <li>
                {title}
            </li>
        </ol>
    }

    handleSaveUiModel() {
        this.props.didUpdateModel();
        this.props.updateModel(this.props.uiModel.model);
    }

    handleDeleteEntity = (data, transition) => {
        const { entity, module } = this.state.entityConfigs;
        const keyEntity = {
            module,
            entityName: entity,
            id: 'list'
        };

        this.props.deleteEntity(data, keyEntity, transition);
    }

    loadData(keyEntity) {
        if (keyEntity) {
            const { entity } = this.props;
            const entityData = entity[calcStoreKey({
                entityName: keyEntity.entityName,
                id: 'list'
            })];
            const isTotalDataSizeChanged = !_.isEqual(entityData.totalCount, this.state.totalDataSize);

            if (isTotalDataSizeChanged && !_.isNil(entityData.totalCount)) {
                const dataList = {...this.state.data.dataList, dataTotalSize: entityData.totalCount };
                this.setState(update(this.state, {
                    data: { dataList: {$set: dataList} }
                }));
            }

            if (entityData && !entity.isFetching) {
                if (_.isNil(entityData.totalCount) && !this.state.isTotalDataSizeFetching) {
                    this.props.loadEntityCount({
                        module: keyEntity.moduleName,
                        entityName: keyEntity.entityName,
                        id: keyEntity.id
                    });
                    this.setState({ isTotalDataSizeFetching: true });
                }

                const { totalDataSize } = this.state;
                if (entityData.totalCount !== totalDataSize) {
                    this.setState({
                        totalDataSize: entityData.totalCount,
                        isTotalDataSizeFetching: false
                    });
                }
            }
        }
    }
}


class ViewPartRenderer extends Component {

    render() {
        return (
            <SinglePartRenderer view={this.props.view} isPage={true} isForm={false} canModify={this.props.canModify}>
                {_.isArray(this.props.view.children) && this.props.view.children.map((child, index) =>
                    <ViewPartRenderer key={index} view={child} isPage={true} isForm={false} canModify={this.props.canModify}/>
                )}
            </SinglePartRenderer>
        );
    }
}

const mapDispatchToProps = {
    loadEntity,
    loadEntityCount,
    didUpdateModel,
    updateModel,
    deleteEntity
};
const mapStateToProps = (state) => ({
    uiModel: state.uiModel,
    universe: state.universe,
    entity: state.entity,
    general: state.general
});

export default connect(mapStateToProps, mapDispatchToProps)(DynamicPage);
