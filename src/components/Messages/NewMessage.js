import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
//import _ from 'lodash';
import FormField from '../Form/FormField'
import Button from '../Button/Button'
import {messageSubmit, loadEntity} from '../../actions/entity'
//import IconButton from 'material-ui/IconButton';

//import ActionHome from 'material-ui/svg-icons/action/home';

class NewMessage extends Component {

    state = {message: ""}

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }

    handleMessageChange(val) {
        this.setState({message:val.target.value})
    }

    handleOnSubmit(){
        const message = {message:this.state.message, from: "pas", sent: new Date()}
        const that = this
        this.props.messageSubmit(this.props.id, message).then(function(){
            that.setState({message:""})
            that.props.loadEntity(that.props.id,'task')
        })
    }

    render() {

        return (
            <div style={{width:'100%',height:'180px'}}>
                <div className="col-md-11" style={{'paddingLeft':0}}>
                <FormField
                    name="newMessage"
                    floatingLabelText="Write a reply"
                    type="text"
                    multiLine={true}
                    rows={3}
                    rowsMax={3}
                    value={this.state.message}
                    onChange={(val) => this.handleMessageChange( val)}
                    fullWidth={true}
                />
                </div>
                <div className="col-md-1" style={{'paddingLeft':0,'paddingTop':'30px'}}>
                    <Button
                     className="pull-left icon-button-send"
                     name="submit"

                     primary={true}
                     disabled={this.state.message === ""}
                     onClick={(val) => this.handleOnSubmit()}

                    ><i className="glyphicon glyphicon-circle-arrow-right icon-button-text"></i></Button>


                </div>
            </div>
        );
    }

}

const mapDispatchToProps = {
    loadEntity,
    messageSubmit
};
const mapStateToProps = (state) => ({
    entity: state.entity,
    general: state.general
});

export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);
