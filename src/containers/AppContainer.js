import React, { Component, PropTypes } from 'react'
import { ReduxAsyncConnect } from 'redux-async-connect'
import { hashHistory, Router, Route, IndexRedirect } from 'react-router' // IndexRoute,
import { Provider, connect } from 'react-redux'
import CoreLayout from './CoreLayout'
import ClientContainer from './ClientContainer'
import TasksList from './TasksList'
import TaskDetail from './TaskDetail'
import Login from '../components/Auth/Login'
import { loginUser } from '../actions/auth'
import { notify, clearNotification } from '../actions/general'
import _ from 'lodash'

import NotificationSystem from 'react-notification-system'

class AppContainer extends Component {
      static propTypes = {
        store  : PropTypes.object.isRequired
      }

      static childContextTypes = {
          growl: PropTypes.any.isRequired
      }

      _notificationSystem = null

    componentDidMount(){
        if (window.location.protocol === 'https:') {
            //TODO: workaround allows to make request from https to http-server
            //window.location.protocol = 'http:';
        }
        this._notificationSystem = this.refs.notificationSystem;
    }

    componentWillReceiveProps(newProps) {
        const oldNotification = _.result(this.props, 'general.notifications[0]')
        const newNotification = _.result(newProps, 'general.notifications[0]')
        const oldNotificationTimestamp = _.result(oldNotification, 'timestamp')
        const newNotificationTimestamp = _.result(newNotification, 'timestamp')
        const isNewNotification = newNotification && !_.isEqual(oldNotificationTimestamp, newNotificationTimestamp)

        if (isNewNotification) {
            const { message, ...opts } = newNotification.content

            this.props.clearNotification(newNotificationTimestamp)
            this.showNotification(message, opts)
        }

        _.forEach(newProps, (value, key) => {
            if (!_.isPlainObject(value)) { return }
            const { errorMessage } = value
            const oldErrorMessage = _.result(this.props[key], 'errorMessage')
            const isErrorChanged = errorMessage !== oldErrorMessage

            if (errorMessage && isErrorChanged && !_.find(this.props.general.notifications, ['content.message', errorMessage])) {
                this.props.notify(errorMessage, {
                    title: 'ERROR',
                    level: 'error'
                })
            }
        })
    }


    showNotification(text, options = {}) {
        this._notificationSystem.addNotification({
            message: text,
            level: options.level? options.level:'success',
            autoDismiss:options.autoDismiss === undefined ? 4 : options.autoDismiss,
            title: options.title ? options.title: null
        });
    }

    getChildContext = function() {
        return {
            growl: {
                appContainer: this,
                notify: function(text, options = {}){
                    this.appContainer.showNotification(text, options)
                }
            }
        };
    }


    shouldComponentUpdate () {
        return false
     }

  onModuleEnter(_, replaceState) {
      replaceState(`/universe/${_.params.module}/${_.params.entity}/list`)
  }

  onUniverseEnter(_, replaceState, callback) {
      if (this.store.getState().auth.isAuthenticated) {
          callback();
          return;
      }
      replaceState('/?error=UNAUTHORIZED');
      callback();
  }

    requireAuth = (nextState, replace) => {
        if(!this.props.isAuthenticated) {
            console.log('nextstate.pathname', nextState.location.pathname);
            replace({
                pathname: '/login',
                query: { return_to: nextState.location.pathname }
            })
        }
    };

    handleLoginClick = (creds) => {
        this.props.dispatch(loginUser(creds, this.context.router))
    };

  render () {
    const { store } = this.props;

    return (
      <Provider store={store}>
        <div className="fluid-container">
          <NotificationSystem ref="notificationSystem" />
          <Router history={hashHistory} render={(props) => <ReduxAsyncConnect {...props}/>}>
            <Route path="/" component={CoreLayout}>
              <IndexRedirect to="client/tasks" />
              <Route path="/login" component={Login} />
                <Route path="/register" component={Login} />

              <Route path="client" component={ClientContainer} onEnter={this.requireAuth} store={store}>
                <IndexRedirect to="/client/tasks" />
                <Route path="tasks" pathname="" component={TasksList}>
                    <Route path=":id" component={TaskDetail}/>
                </Route>

              </Route>
                {/*<Route path="page" component={Page} onEnter={requireCredentials}/>
              <Route path="error" component={ErrorPage}/>*/}
            </Route>
          </Router>
        </div>
      </Provider>
    )
  }
}

function mapStateToProps(state) {

    const { auth, location, general, uiModel } = state;
    const { isAuthenticated, errorMessage } = auth;

    return {
        isAuthenticated,
        errorMessage,
        location,
        general,
        uiModel
    }
}

const mapDispatchToProps = {
    notify,
    clearNotification
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
