import React, { Component, PropTypes } from 'react'
import { asyncConnect } from 'redux-async-connect';
import DynMenu from '../components/Menu/DynMenu'
import RightMenu from '../components/Menu/RightMenu'

import DynMainWrapper from '../components/DynMainWrapper'

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux'
import { logoutUser } from '../actions/auth'
//import _ from 'lodash';
//import {callApi} from '../middlewares/api'
//import { notify } from '../actions/general'

//let pollId;
//const oldUniverse = require('../test.universe.json');

class ClientContainer extends Component {
    static defaultProps = {
        location: PropTypes.object
    }

    menuPanelData = []

    state = {
        isModelCreated: false,
        universeDifferences: []
    }

    isLoading(){
        return false
    }

    getRouteName() {
        return this.props.location.pathname.replace('/client/', '').split('/')[0];
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired
        };
    }

    handleLogout = () => {
        this.props.logoutUser(this.context.router);
    }

    componentWillMount() {
        this.initializeMenuPanelData(this.props);
    }

    componentWillReceiveProps(newProps) {
        this.initializeMenuPanelData(newProps);
    }

    componentWillUnmount() {
        //clearTimeout(pollId);
    }

    initializeMenuPanelData(props) {
    }


    render() {
        console.log('RENDER')
        const props = this.props;
        //const routeName = props.location.pathname.replace('/universe/', '').split('/')[0];
        const theme = ''
        return (

            <div className="fluid-container">

                {this.isLoading() &&
                <div style={{margin: 'auto', textAlign: 'center'}}>

                    Loading Client Interface...<br/>
                    <img src="/img/loader-big.gif" role="presentation"/>

                </div>
                }

                {!this.isLoading() &&
                <DynMainWrapper theme={theme}>
                    <DynMenu/>
                    <div className="content">
                        <RightMenu/>
                        <div className="content-right">

                            {props.children}
                        </div>

                    </div>
                </DynMainWrapper>
                }
            </div>
        )
    }

    /*handleClick(event) {
     this.props.changeLayout(this.props.currentLayout == "menu-on-side" ? "menu-on-top": "menu-on-side")
     }*/
}

const mapDispatchToProps = {
    //    changeLayout : changeLayout,
    logoutUser
}

const mapStateToProps = (state) => ({
    //counter : state.counter,
    entity: state.entity
})

const asynced = asyncConnect([{
    deffered: true,
    promise: ({store: {dispatch, getState}}) => {
        return new Promise((resolveReal, reject)=>{
            //dispatch(universeUiLoad(true, {}));
            resolveReal()
        });
    }
}])(ClientContainer)
const connected = connect(mapStateToProps, mapDispatchToProps)(asynced);
export default DragDropContext(HTML5Backend)(connected)
