import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import RaisedButton from 'material-ui/RaisedButton'
import getClassNameMap from '../../helpers/getClassNameMap'

export default class Button extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        label: PropTypes.string,
        className: PropTypes.string
    }

    render() {
        const { className} = this.props; //, label, onClick, children
        const { customProps, className: modClassName } = getClassNameMap('button', className);

        return <RaisedButton
            onClick={this.handleClick}
            className={modClassName}
            {...customProps}
            {..._.omit(this.props, ['className', 'onClick'])}
        />
    }

    handleClick = (e) => {
        const { onClick } = this.props;

        e.target.name = this.props.name;
        onClick && onClick(e);
    }
}
