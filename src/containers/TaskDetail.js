import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
//import _ from 'lodash';
import { loadEntity, loadEntityCount } from '../actions/entity';

import SplitPane from 'react-split-pane'
import MessageList from '../components/Messages/MessageList'
import NewMessage from '../components/Messages/NewMessage'
import TaskView from '../components/Task/TaskView'

class TaskDetail extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }

    init(){
        if (this.initted) return
        this.props.loadEntity(this.props.params.id,'task')
        this.initted =  true
    }

    componentWillReceiveProps(newProps) {
        this.init()

    }
    componentDidMount(){
        this.init()
    }

    getTask(){
        return this.props.entity['task:' + this.props.params.id] ? this.props.entity['task:' + this.props.params.id].result : null
    }

    render() {
        return (
        <div className="task-detail-wrapper">
            <SplitPane split="vertical" minSize={'10%'} defaultSize={'50%'}>
                <div style={{height:'100%'}}>
                    <div className="message-list">
                        <MessageList id={this.props.params.id}/>
                    </div>
                    <div className="new-message">
                        <NewMessage id={this.props.params.id}/>
                    </div>
                </div>
                <div>
                    <TaskView task={this.getTask()}/>
                </div>
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
