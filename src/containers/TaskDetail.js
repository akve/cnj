import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
//import _ from 'lodash';
import { loadEntity, loadEntityCount } from '../actions/entity';

import SplitPane from 'react-split-pane'

class TaskDetail extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }


    componentWillReceiveProps(newProps) {
        console.log("D", newProps.params)
    }

    render() {
        return (
        <div className="task-detail-wrapper">
            <SplitPane split="vertical" minSize={50} defaultSize={100}>
                <div>Messaging</div>
                <div>Task details</div>
            </SplitPane>
        </div>

        );
    }

}

const mapDispatchToProps = {
    loadEntity,
    loadEntityCount
};
const mapStateToProps = (state) => ({
    entity: state.entity,
    general: state.general
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
