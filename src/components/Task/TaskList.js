import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
import _ from 'lodash';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
//import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {darkBlack} from 'material-ui/styles/colors';
//import IconButton from 'material-ui/IconButton';
//import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
//import IconMenu from 'material-ui/IconMenu';
//import MenuItem from 'material-ui/MenuItem';
import Button from '../Button/Button'
import FormField from '../Form/FormField'

import {getStatusNames} from '../../helpers/entity'

class TaskList extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }


    init(){
        if (this.initted) return
        this.setState({filter:(window.localStorage.lastTaskFilter ? JSON.parse(window.localStorage.lastTaskFilter) : {}), sort:(window.localStorage.lastTaskSort ? window.localStorage.lastTaskSort : 'id')})
        this.initted =  true
    }
    componentWillReceiveProps(newProps) {
        this.init()

    }
    componentDidMount(){
        this.init()
    }

    handleOnClick(){
        const url = `/client/tasks/1`;
        this.context.router.push(url);
    }

    resolveProject(id) {
        const project = _.find(this.props.entity['project:list'].result, {id:id})
        return project? project['title'] : ''
    }

    handleOnFilter(){
        window.localStorage['lastTaskFilter'] = JSON.stringify(this.state.filter)
        window.localStorage['lastTaskSort'] = this.state.sort
        let origTasks = _.clone(this.getOriginalTasks())
        origTasks.splice(1,1)
        this.setState({filteredTasks:origTasks})
    }

    handleFilterChange(change){
        let filterChange = this.state
        filterChange[change.name] = change.value.target ? change.value.target.value : change.value
        this.setState({filter:filterChange})
        //console.log(filterChange, this.state.filter, )
    }

    handleSortChange(change){
        this.setState({sort:change})
    }

    filterProjects() {
        let res = [{id:0,name:'All websites'}]
        this.props.entity['project:list'].result.forEach((project)=>{
            res.push({id:project.id, name: project.title})
        })
        return res
    }

    filterState(){
        return getStatusNames(true)
    }
    sortBy(){
        return [{id:'id',name:'Date added'},{id:'lastupdate desc', name:'Last updated (desc)'},{id:'lastupdate',name:'Last updated (asc)'},{id:'name desc', name:'Name (desc)'},{id:'name',name:'Name (asc)'}]
    }

    renderFilter(){
        return (
            <div className="filterPanel">
                <div className="pull-left">
                    <FormField
                        className="pull-left filter-field"
                        name="filterByName"
                        floatingLabelText="Filter by title"
                        type="text"
                        value={this.state.filter.title}
                        onChange={(val) => this.handleFilterChange(
                            { value: val, name: 'title' }
                        )}
                    />
                    <FormField
                        className="pull-left filter-field"
                        name="filterByProject"
                        floatingLabelText="Filter by website"
                        type="select"
                        valueField="id"
                        textField="name"
                        data={this.filterProjects()}
                        value={this.state.filter.project}
                        onChange={(val) => this.handleFilterChange(
                            { value: val, name: 'project' }
                        )}
                    />
                    <FormField
                        className="pull-left filter-field"
                        name="filterByState "
                        floatingLabelText="Filter by state"
                        type="select"
                        valueField="id"
                        textField="name"
                        data={this.filterState()}
                        value={this.state.filter.state}
                        onChange={(val) => this.handleFilterChange(
                            { value: val, name: 'state' }
                        )}
                    />
                    <FormField
                        className="pull-left filter-field"
                        name="sortBy"
                        floatingLabelText="Sort by"
                        type="select"
                        valueField="id"
                        textField="name"
                        data={this.sortBy()}
                        value={this.state.sort}
                        onChange={(val) => this.handleSortChange( val)}
                    />

                </div>
                <div className="pull-right">
                    <Button
                        name="filter"
                        primary={true}
                        className={`btn-default`}
                        onClick={(val) => this.handleOnFilter()}
                        label="Filter"
                    />
                </div>
                <div style={{clear:'both'}}></div>

            </div>
        )
    }

    getOriginalTasks(){
        return this.props.entity && this.props.entity['task:list'] ? this.props.entity['task:list'].result : null
    }
    isShowingDetails(){
        return !this.props.taskId
    }


    render(){
        let entity = this.getOriginalTasks()
        const projects = this.props.entity && this.props.entity['project:list'] ? this.props.entity['project:list'].result : null
        if (!entity) return null
        if (!projects) return null

        if (this.state.filteredTasks) {
            entity = this.state.filteredTasks
        }


        return (
            <div>
                {this.renderFilter()}
                <Divider/>
                {this.props.taskId}
                <List>
                    {entity.map((item, index) => {
                        return <ListItem
                            className={(""+this.props.taskId) === (""+item.id) ? "current-task" : ""}
                            leftAvatar={<Avatar src="images/ok-128.jpg" />}
                            primaryText={item.title + ' | ' + this.resolveProject(item.project)}
                            onClick={(e) => this.handleOnClick()}
                            key={index}
                            secondaryText={
                                <p>
                                    <span style={{color: darkBlack}}>Assigned to: {item.assignee}</span><br/>
                                    <span style={{color: darkBlack}}>Status: {item.status}</span>
                                </p>
                            }
                            secondaryTextLines={2}
                        />
                    })}

                </List>
            </div>
        )
    }


}

const mapDispatchToProps = {
};

const mapStateToProps = (state) => ({
    entity: state.entity,
    general: state.general
});

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);
