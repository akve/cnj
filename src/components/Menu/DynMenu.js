import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { logoutUser } from '../../actions/auth'
import _ from 'lodash';
import { Link } from 'react-router';

import './DynMenu.css'

class DynMenu extends Component {
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
        const { menu } = this.state;
        return  this.renderNavbar(menu);
    }

    renderMenuItem(item, index) {
        if (item.isGroup) {
            return (
                <NavDropdown
                    key={index}
                    eventKey={index}
                    title={item.title}
                    id="basic-nav-dropdown"
                >
                    {item.children.map((menuitem, mindex) => {
                        if (menuitem.children) {
                            return this.renderMenuItem(menuitem, mindex);
                        }

                        return <MenuItem
                            key={mindex}
                            eventKey={mindex}
                            href={this.getAbsolutePathUrl(menuitem.link)}
                        >
                            {menuitem.title}
                        </MenuItem>
                    })}
                </NavDropdown>
            )
        } else {
            return <NavItem
                        key={index}
                        eventKey={index}
                        href={this.getAbsolutePathUrl(item.link)}
                    >
                        {item.title}
                    </NavItem>;
        }
    }

    renderNavbar(menu) {
        return (
            <div className="dyn-menu">
                {menu &&
                <Navbar >
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="client">Codingninjas</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav>
                            {menu.map((item, index) =>
                                this.renderMenuItem(item,index)
                            )}
                        </Nav>
                        <Nav pullRight> {/*pullRight*/}
                            {this.renderStaticLinks()}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                }
                {this.props.children}
            </div>
        )
    }

    renderStaticLinks() {
        const links = [

            <NavItem eventKey={3} onClick={() => this.handleLogout()} key={3}>Logout</NavItem>
        ];

        return _.filter(links, _.identity);
    }

}

const mapDispatchToProps = {
    logoutUser
}

const mapStateToProps = (state) => ({
    //counter : state.counter,
})

/* Selectors can compute derived data, allowing Redux to store the minimal possible state.
 Selectors are efficient. A selector is not recomputed unless one of its arguments change.
 Selectors are composable. They can be used as input to other selectors.
 https://github.com/reactjs/reselect    */

export default connect(mapStateToProps, mapDispatchToProps)(DynMenu);
