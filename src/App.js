import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
//import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
// import './theme/css/new-age.css';
import './App.css';
import {createIronStore} from './store'
import AppContainer from './containers/AppContainer'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

injectTapEventPlugin();

const initialState = window.___INITIAL_STATE__
const store = createIronStore(initialState)

class App extends Component {


    componentDidMount() {
        this._onInitialUrlReceive()
    }

    _onInitialUrlReceive = (url) => {
        window.document.getElementById("preloader").style.display = "none"
        if (url) {
            this.setState({ initialUrl: url });
        }
    };

  render() {
    return (
        <MuiThemeProvider>
            <AppContainer store={store}  />
        </MuiThemeProvider>
    );
  }
}

export default App;
