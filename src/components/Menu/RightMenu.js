import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { NavItem} from 'react-bootstrap'
//import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { logoutUser } from '../../actions/auth'
import _ from 'lodash';
//import { Link } from 'react-router';
//import IconButton from 'material-ui/IconButton';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import './DynMenu.css'

class RightMenu extends Component {
    static propTypes = {
        isSidebar: PropTypes.bool,
        isMenuConfigs: PropTypes.bool
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired,
        };
    }

    state = { menu: [] }

    getAbsolutePathUrl(link) {
        return link.match('https') ? link : `/#/client${link}`;
    }

    componentWillMount() {
    }

    componentWillReceiveProps(newProps) {
    }

    handleLogout = () => {
        this.props.logoutUser(this.context.router);
    }

    render() {
        //const { menu } = this.state;
        return (
            <div className="right-small-menu sidebar dyn-menu">

                <ul className="nav nav-sidebar">
                    {this.renderStaticLinks()}
                </ul>
            </div>
        )
    }

    renderTooltip(text) {
        return (
            <Tooltip placement="left" className="in" id="tooltip-left">
                {text}
            </Tooltip>
        );
    }

    renderStaticLinks() {
        /*<IconButton
         iconClassName="muidocs-icon-custom-github" tooltip="bottom-right"
         tooltipPosition="bottom-right"
         />*/
        const links = [
            <OverlayTrigger placement="right" overlay={this.renderTooltip("Tasks")} key={1}>
                <NavItem eventKey={3} onClick={() => this.handleLogout()} key={3}>

                        <i className="glyphicon glyphicon-tasks"></i>

                </NavItem>
            </OverlayTrigger>
        ];

        return _.filter(links, _.identity);
    }

}

const mapDispatchToProps = {
    logoutUser,
}

const mapStateToProps = (state) => ({
    //counter : state.counter,
})

/* Selectors can compute derived data, allowing Redux to store the minimal possible state.
 Selectors are efficient. A selector is not recomputed unless one of its arguments change.
 Selectors are composable. They can be used as input to other selectors.
 https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(RightMenu);
