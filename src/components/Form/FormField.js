import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
// import { DropdownButton, MenuItem } from 'react-bootstrap';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton } from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';

export default class FormField extends Component {
    static propsTypes = {
        label: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.any,
        name: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        checked: PropTypes.bool,
        data: PropTypes.array,
        defaultTitle: PropTypes.string,
        labelClassName: PropTypes.string,
        labelInside: PropTypes.string
    }

    static defaultProps = {
        type: 'text'
    }

    state = { value: this.props.value }

    componentWillReceiveProps(newProps) {
        const { type, value } = newProps;

        if (type === 'checkbox') {
            this.setState({ value });
        }
    }

    chooseInput(type) {
        switch (type) {
            case 'checkbox':
                return this.renderCheckbox();
            case 'select':
                return this.renderSelect();
            case 'radio':
                return this.renderRadio();
            case 'number':
                return this.renderNumber();
            default:
                return this.renderText();
        }
    }

    render() {
        const { label, type, labelClassName, className, name, required } = this.props;

        return (
            <div className={`form-group form-field ${className}`}>
                {label &&
                <label
                    htmlFor={name}
                    className={labelClassName + (required ? ' required-field':'')}
                >
                    {label}
                </label>
                }
                {this.chooseInput(type)}
            </div>
        );
    }

    renderText() {
        return <TextField
            id={this.props.name}
            {..._.omit(this.props, 'className', 'labelInside')}
        />
    }

    renderRadio() {
        return <RadioButton
            onCheck={this.props.onChange}
            {..._.omit(this.props, 'className', 'onChange')}
        />
    }

    renderCheckbox() {
        //const { type, value } = this.props;
        const dynamicProps = {};

        Object.assign(dynamicProps, {
            onCheck: this.handleCheckboxChange,
            checked: this.state.value
        });

        return <Checkbox
            {...dynamicProps}
            {..._.omit(this.props, 'className', 'value', 'labelClassName')}
        />
    }

    renderNumber() {
        return <TextField
            {..._.omit(this.props, 'className', 'labelInside')}
        />
    }

    renderSelect() {
        const {
            name: id,
            value,
            data,
            renderItem,
            disabled,
            defaultTitle,
            autoComplete,
            valueField,
            textField,
            floatingLabelText
        } = this.props;
        //if (this.props.name == "lookup-warehouse" ) debugger
        const customProps = { id, disabled, value : _.isObject(value) ? value[valueField] : value, floatingLabelText, hintStyle:{'color':'#FF0000'} };

        if (defaultTitle) {
            customProps.hintText = defaultTitle;
        }


        return autoComplete
            ? this.renderAutoComplete()
            : <SelectField
            onChange={this.handleSelectChange}
            {...customProps}
        >
            {data && data.map((item, index) => {
                let _value;
                let _label;

                if (_.isObject(item)) {
                    _value = valueField ? item[valueField] : item;
                    _label = textField ? item[textField] : item;
                } else {
                    _value = _label = item;
                }

                return <MenuItem
                    value={_value}
                    key={index}
                    primaryText={renderItem? null :  _label}
                    children={renderItem ? renderItem(item) : null}
                />
            })}
        </SelectField>
    }

    renderAutoComplete() {
        const {
            data,
            defaultValue,
            valueField,
            textField,
            filter
        } = this.props;
        const containsFilter = (queryText, key) => {
            console.log(queryText, key);
            return key.includes(queryText)
        }
        const modFilter = filter === 'contains' ? containsFilter : filter
        // const mappedData = data.map(item => )
        const dataSourceConfig = {
            text: textField,
            value: valueField
        }
        const omittedProps = [
            'data',
            'filter',
            'valueField',
            'textField',
            'autoComplete',
            'defaultValue'
        ]

        return <AutoComplete
            searchText={defaultValue + ''}
            dataSource={data}
            filter={modFilter}
            dataSourceConfig={dataSourceConfig}
            {..._.omit(this.props, omittedProps)}
        />
    }

    handleSelectChange = (e, index, value) => {
        this.props.onChange(value);
    }

    handleCheckboxChange = (e) => {
        const { name } = e.target; //value,
        const newValue = !this.state.value;
        this.setState({ value: newValue });
        this.props.onChange({
            target: {
                name,
                value: newValue
            }
        });
    }
}
