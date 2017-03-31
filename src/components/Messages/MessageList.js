import React, { Component } from 'react'; //PropTypes
import { connect } from 'react-redux';
//import _ from 'lodash';
import { loadEntity, loadEntityCount } from '../../actions/entity';

class MessageList extends Component {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
        //location: React.PropTypes.object.isRequired
    }

    init(){
        if (this.initted) return
        //this.props.loadEntity(this.props.id,'task')
        this.initted =  true
    }

    componentWillReceiveProps(newProps) {
        this.init()

    }
    componentDidMount(){
        this.init()
    }

    render() {
        const entity=this.props.entity['task:' + this.props.id]
        if (!entity || !entity.result) return null
        const messages = entity.result.messages
        return (
            <div className="message-list-internal">
                {messages.map((item, index) => {
                    return <Message message={item} key={index}/>
                })}
            </div>

        )
    }

}

class Message extends Component {
    render(){
        return (
            <div>{this.props.message.message}</div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
