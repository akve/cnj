import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
//import _ from 'lodash';
import {resolveStatusName} from '../../helpers/entity'

import confirm from '../../helpers/confirm'

class TaskView extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }

    resolveProjectName (id){
        let res = ""
        if (!this.props.entity['project:list'] || !this.props.entity['project:list'].result) return res
        this.props.entity['project:list'].result.forEach((project)=>{
            if (project.id === id) res = project.title
        })
        return res
    }

    resolveStatus(id){
        return resolveStatusName(id, true)
    }

    openProjectModification(){

    }

    closeTask(){
        confirm('Are you sure to close the task?').then(()=>{
            console.log("OK")
        },()=>{
            console.log("Skip")
        })
    }


    render() {
        if (!this.props.task) return null
        const task = this.props.task
        return (
            <div>
                <h3>Task: {task.title}</h3>
                <ul className="plain-view-fields">
                    <li>
                        <label>Ref #</label>
                        {task.id}
                    </li>
                    <li><label>Website</label>
                        <a title="Edit project" onClick={(v)=>this.openProjectModification()}>{this.resolveProjectName(task.project)}</a>
                    </li>
                    <li>
                        <label>Status</label>
                        {this.resolveStatus(task.status)}
                        {task.status !== 'closed' &&
                            <div>
                            <a onClick={(v)=>this.closeTask()} className="btn btn-default">Close task</a>
                            </div>
                        }
                    </li>
                    <li>
                        <label>Billed hours</label>
                        TBD
                    </li>
                </ul>
            </div>

        );
    }

}

const mapDispatchToProps = {
};

const mapStateToProps = (state) => ({
    entity: state.entity,
    general: state.general
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskView);
