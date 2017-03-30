import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { LOCAL_STORAGE_ID_TOKEN, LOCAL_STORAGE_BASIC_TOKEN } from '../../helpers/constants'
import FormField from '../Form/FormField'
import FormButton from '../Form/FormButton'
import { loginUser } from '../../actions/auth';

class Login extends Component {
    static propTypes = {
        errorMessage: PropTypes.string
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.object.isRequired,
        };
    }

    state = { errorMessage: null }

    componentWillMount() {
        const { auth } = this.props;

        if(auth.isAuthenticated) {
            this.context.router.replace('universe')
        }
    }

    componentWillReceiveProps(newProps) {
        const { auth } = newProps;
        const errorMessage = _.result(auth, 'errorMessage');

        if (errorMessage) {
            this.setState({ errorMessage });
        }
    }

    render() {
        const { errorMessage } = this.state

        return (
            <div className="login-screen">
                <h2>Log in</h2>
                <form onSubmit={this.handleSubmit}>
                    <FormField
                        name='username'
                        ref='username'
						floatingLabelText="Login"
                        labelInside={true}
						type="text"
                        style={{ marginRight: '5px' }}
                    />
                    <FormField
                        name='password'
                        ref='password'
						floatingLabelText="Password"
                        labelInside={true}
                        type='password'
                        style={{ marginRight: '5px' }}
                    />

                    <FormButton
                        name="submit"
                        label="Login"
                        style={{marginTop:'20px'}}
                        className="btn-primary"
                    />
                </form>
                {errorMessage &&
                    <p style={{color:'red'}}>{errorMessage}</p>
                }
            </div>
        )
    }

    handleSubmit = (event) => {
        event.preventDefault();

        const { target } = event
        const username = target.username
        const password = target.password
        const creds = { username: username.value.trim(), password: password.value.trim() }

        this.props.dispatch(loginUser(creds, this.context.router))
            .then((data) => {
                if (data.error) {

                    this.setState({ errorMessage : data.error });
                    return;

                } else {
                    this.setState({ errorMessage : null });
                }
            //if (data.)
                const { router } = this.context;
                const { jwt } = data.response[0];

                if (jwt) {
                    localStorage.setItem(LOCAL_STORAGE_BASIC_TOKEN, btoa(creds.username + ':' + creds.password));
                    localStorage.setItem(LOCAL_STORAGE_ID_TOKEN, jwt);

                    if (router) {
                        router.push(this.context.router.location.query.return_to || '/universe');
                    }
                }
            }).catch((e) => {
                console.log("!!", e)

                //console.log(e);
        });
    }
}

const mapStateToProps = (state, ownProps) => ({
    auth: state.auth
});


export default connect(mapStateToProps)(Login)
