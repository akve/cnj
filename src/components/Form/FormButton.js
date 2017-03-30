import React, { Component, PropTypes } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import getClassNameMap from '../../helpers/getClassNameMap'

export default class FormButton extends Component {
    static propTypes = {
        onClick: PropTypes.func,
        label: PropTypes.string.isRequired,
        className: PropTypes.string,
        style: PropTypes.any,
        type: PropTypes.string
    }

    static defaultProps = {
        type: 'submit'
    }

    render() {
        const { className, label, type, style } = this.props;
        const { customProps, className: modClassName } = getClassNameMap('button', className);
        const dynProps = {
            ...customProps,
            type,
            style,
            className: modClassName,
            onClick: this.handleClick
        }

        return type === 'submit'
            ? <RaisedButton
                {...dynProps}
                label={label}
            />
            : <input
                {...dynProps}
                value={label}
            />
    }

    handleClick = (e) => {
        const { onClick } = this.props;

        onClick && onClick(e);
    }
}
