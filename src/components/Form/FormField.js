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

    render() {
        const { type} = this.props;

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

    renderText() {
        return <TextField
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

    renderDefaultInput() {
        const { type, value } = this.props;
        const dynamicProps = {};


        if (type === 'checkbox') {
            Object.assign(dynamicProps, {
				onCheck: this.props.onChange ? this.props.onChange : this.handleCheckboxChange,
                //onChange: this.handleCheckboxChange,
                checked: this.props.checked === undefined ? this.state.value : this.props.checked
            });

            return <Checkbox
                {...dynamicProps}
                {..._.omit(this.props, 'className', 'value')}

            />
        } else {
            const val = _.isNull(value) ? '' : value;

            Object.assign(dynamicProps, {
                value: val
            });
        }

        return (
            <input
                className="form-control"
               {..._.omit(this.props, 'label', 'className', 'value', 'labelClassName')}
               {...dynamicProps}
           />
        );
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
        const customProps = { id, disabled, value, floatingLabelText };

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

                    if (_.isPlainObject(item)) {
                        _value = valueField ? item[valueField] : item;
                        _label = textField ? item[textField] : item;
                    } else {
                        _value = _label = item;
                    }

                    return <MenuItem
                        value={_value}
                        key={index}
                        primaryText={!renderItem && _label}
                        children={renderItem && renderItem(item)}
                    />
                })}
            </SelectField>
    }

    renderAutoComplete() {
        const {
            data,

            valueField,
            textField,
            filter
        } = this.props;
        const containsFilter = (queryText, key) => key.includes(queryText)
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
            'autoComplete'
        ]

        return <AutoComplete
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
