import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { loadEntity, loadEntityCount } from '../actions/entity';

import {List, ListItem} from 'material-ui/List';
//import Divider from 'material-ui/Divider';
//import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
//import IconButton from 'material-ui/IconButton';
//import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
//import IconMenu from 'material-ui/IconMenu';
//import MenuItem from 'material-ui/MenuItem';

/*const iconButtonElement = (
    <IconButton
        touch={true}

    >
        <MoreVertIcon color={grey400} />
    </IconButton>
);

const rightIconMenu = (
    <IconMenu iconButtonElement={iconButtonElement}>
        <MenuItem>Reply</MenuItem>
        <MenuItem>Forward</MenuItem>
        <MenuItem>Delete</MenuItem>
    </IconMenu>
);
*/
class TasksList extends Component {
    static defaultProps = {
        location: PropTypes.object
    }

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }

    init(){
        if (this.initted) return
        console.log("!")
        this.props.loadEntity('list','task')
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

     /*ListExampleMessages = () => (
    <div >

            <List>
                <Subheader>Today</Subheader>
                <ListItem
                    leftAvatar={<Avatar src="images/ok-128.jpg" />}
                    primaryText="Brunch this weekend?"
                    onClick={(e) => this.handleOnClick()}
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Brendan Lim</span> --
                            I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/kolage-128.jpg" />}
                    primaryText={
                        <p>Summer BBQ&nbsp;&nbsp;<span style={{color: lightBlack}}>4</span></p>
                    }
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>to me, Scott, Jennifer</span> --
                            Wish I could come, but I&apos;m out of town this weekend.
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
                    primaryText="Oui oui"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Grace Ng</span> --
                            Do you have Paris recommendations? Have you ever been?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/kerem-128.jpg" />}
                    primaryText="Birdthday gift"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Kerem Suer</span> --
                            Do you have any ideas what we can get Heidi for her birthday? How about a pony?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
                    primaryText="Recipe to try"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Raquel Parrado</span> --
                            We should eat this: grated squash. Corn and tomatillo tacos.
                        </p>
                    }
                    secondaryTextLines={2}
                />
            </List>
            <List>
                <Subheader>Today</Subheader>
                <ListItem
                    leftAvatar={<Avatar src="images/ok-128.jpg" />}
                    rightIconButton={rightIconMenu}
                    primaryText="Brendan Lim"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Brunch this weekend?</span><br />
                            I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/kolage-128.jpg" />}
                    rightIconButton={rightIconMenu}
                    primaryText="me, Scott, Jennifer"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Summer BBQ</span><br />
                            Wish I could come, but I&apos;m out of town this weekend.
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
                    rightIconButton={rightIconMenu}
                    primaryText="Grace Ng"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Oui oui</span><br />
                            Do you have any Paris recs? Have you ever been?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/kerem-128.jpg" />}
                    rightIconButton={rightIconMenu}
                    primaryText="Kerem Suer"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Birthday gift</span><br />
                            Do you have any ideas what we can get Heidi for her birthday? How about a pony?
                        </p>
                    }
                    secondaryTextLines={2}
                />
                <Divider inset={true} />
                <ListItem
                    leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
                    rightIconButton={rightIconMenu}
                    primaryText="Raquel Parrado"
                    secondaryText={
                        <p>
                            <span style={{color: darkBlack}}>Recipe to try</span><br />
                            We should eat this: grated squash. Corn and tomatillo tacos.
                        </p>
                    }
                    secondaryTextLines={2}
                />
            </List>
    </div>
);*/

    isShowingDetails(){
        return this.props.location.pathname !== "/client/tasks"
    }

    renderList(){
        const entity = this.props.entity && this.props.entity['task:list'] ? this.props.entity['task:list'].result : null
        if (!entity) return
        return (
            <div>
                <span>Filter...</span>
                <List>
                    {entity.map((item, index) => {
                        return <ListItem
                            leftAvatar={<Avatar src="images/ok-128.jpg" />}
                            primaryText={item.title}
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

    render() {
        console.log(this.props.location)
        //var currentRouteName = this.context.router.getCurrentPathname();
        //console.log("ONRENDER in tasks", currentRouteName)
        return (
            <div className="fluid-container">
                <div className={this.isShowingDetails() ? 'tasks-list tasks-list-half' : 'tasks-list'}>
                    {this.renderList()}
                </div>
                {this.props.children}
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

export default connect(mapStateToProps, mapDispatchToProps)(TasksList);
