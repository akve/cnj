import React, { Component } from 'react'
import $ from 'jquery';
//import DynamicElement from 'components/DynamicElement'
// import './theme/css/new-age.css';

export default class DynMainWrapper extends Component {
    componentWillMount() {
        const { theme } = this.props;
        const themePath = `themes/${theme}.css`;

        if (theme) {
            $('.dynamic-theme').attr('href', themePath);
        }
    }

    componentWillReceiveProps(newProps) {
        const { theme } = this.props;

        if (theme !== newProps.theme) {
            const themePath = newProps.theme && `themes/${newProps.theme}.css`;

            $('.dynamic-theme').attr('href', themePath);
        }
    }

    render() {
        return (
            // <div className="dyn-main-wrapper row">
            <div className="dyn-main-wrapper">
                {this.props.children}
            </div>
        );
    }
}
