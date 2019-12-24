import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import ReactSelect, { components } from 'react-select';

import Tooltip from '@common/components/Tooltip';

import './styles.scss';

const IndicatorSeparator = () => null;

const DropdownIndicator = props => components.DropdownIndicator && (
  <components.DropdownIndicator {...props}>
    <i
      className={classNames('fas', {
        'fa-angle-down': !props.selectProps.menuIsOpen,
        'fa-angle-up': props.selectProps.menuIsOpen,
      })}
    />
  </components.DropdownIndicator>
);

const ValueContainer = (props) => {
  const {
    isMulti,
    selectProps,
  } = props;
  const {
    isDisabled,
    placeholder,
    value,
  } = selectProps;
  let MultiValue = null;
  if (isMulti) {
    if (value.length < 1) {
      MultiValue = () => (
        <components.Placeholder {...props} key="placeholder" isDisabled={isDisabled}>
          {placeholder}
        </components.Placeholder>
      );
    } else {
      let valueText = '';
      if (value.length > 1) {
        valueText = `${value.length} options selected`;
      } else {
        const valueObj = value[0] || {};
        valueText = valueObj.label;
      }
      MultiValue = () => (
        <div className="select__multi-value">
          {valueText}
        </div>
      );
    }
  }

  return (
    <div className="select__value-container">
      {isMulti ? <MultiValue /> : props.children[0]}
      {props.children[1]}
    </div>
  );
};

const Option = (props) => {
  if (props.isMulti) {
    const {
      children,
      innerProps,
      isSelected,
    } = props;

    return (
      <div
        {...innerProps}
        className={classNames('select__multi-option')}
      >
        <span className={classNames('select__multi-option-checkbox', { 'select__multi-option-checkbox--is-selected': isSelected })}>
          {isSelected && <i className="fas fa-check" />}
        </span>
        {children}
      </div>
    );
  }

  return (
    <components.Option {...props} />
  );
};

class FormSelect extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(option) {
    const {
      input,
      isMulti,
    } = this.props;
    let fieldValue;

    if (isMulti) {
      fieldValue = option.map(o => o.value);
    } else {
      fieldValue = option.value;
    }

    input.onChange(fieldValue);    
  }

  componentWillMount() {
    const {
      input,
      initialValues,
    } = this.props;

    if(initialValues && initialValues.value){
      input.value = initialValues.value
    }
  }

  getSelectValue() {
    const {
      input,
      isMulti,
      options,
    } = this.props;

    if (isMulti) {
      return input.value && input.value.map(inputValue => options.find(option => option.value === inputValue)).filter(value => value);
    }

    return (options || []).find(option => option.value === input.value) || null;
  }

  render() {
    const {
      fieldClassName,
      hasTooltip,
      input,
      label,
      meta,
      options,
      tooltipText,
      tooltipTitle,
      ...props
    } = this.props;

    return (
      <div className={classNames('field', fieldClassName)}>
        <div className="field__label">
          {label}
          {hasTooltip && (
            <Tooltip title={tooltipTitle}>
              {tooltipText}
            </Tooltip>
          )}
        </div>
        <ReactSelect
          backspaceRemovesValue={false}
          isSearchable={false}
          isClearable={false}
          id={input.name}
          label={label}
          hideSelectedOptions={false}
          {...props}
          {...input}
          className="select"
          classNamePrefix="select"
          value={this.getSelectValue()}
          onChange={this.onChange}          
          options={options}
          closeMenuOnSelect={!props.isMulti}
          blurInputOnSelect={false}
          components={{
            DropdownIndicator,
            IndicatorSeparator,
            Option,
            ValueContainer,
          }}
          onBlur={() => {
            setTimeout(() => {
              input.onBlur();
            });
          }}
        />
        {(meta.touched && meta.error) && (
          <div className="field__error">
            {meta.error}
          </div>
        )}
      </div>
    );
  }
}

FormSelect.propTypes = {
  fieldClassName: PropTypes.string,
  hasTooltip: PropTypes.bool,
  initialValues: PropTypes.shape({}),
  input: PropTypes.shape({}).isRequired,
  isMulti: PropTypes.bool,
  label: PropTypes.string.isRequired,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    touched: PropTypes.bool,
  }).isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  })).isRequired,
  tooltipText: (props, propName, componentName) => {
    if (props.hasTooltip === true && props[propName] === null) {
      return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`.`);
    }
    if (props.hasTooltip === true && (props[propName] == undefined || typeof props[propName] !== 'string')) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`string\`.`);
    }
  },
  tooltipTitle: (props, propName, componentName) => {
    if (props.hasTooltip === true && props[propName] === null) {
      return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`.`);
    }
    if (props.hasTooltip === true && (props[propName] == undefined || typeof props[propName] !== 'string')) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`string\`.`);
    }
  },
};

FormSelect.defaultProps = {
  fieldClassName: null,
  hasTooltip: false,
  isMulti: false,
  options: [],
  tooltipText: null,
  tooltipTitle: null,
};

export default FormSelect;
