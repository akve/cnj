import React, { Component, PropTypes } from 'react'
import Button from '../Button/Button'

export default class Logout extends Component {

    render() {
        const { onLogoutClick } = this.props

        return <Button
                onClick={() => onLogoutClick()}
                className="btn-primary"
                label="Logout"
            />
    }

}

Logout.propTypes = {
    onLogoutClick: PropTypes.func.isRequired
}
