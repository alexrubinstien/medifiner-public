import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Input from '@common/components/Input';

import './styles.scss';

const FormInput = ({
  hasIcon,
  iconClassName,
  input,
  label,
  meta,
  ...props
}) => (
  <div className="field">
    <Input
      wide
      id={input.name}
      autoComplete="off"
      label={label}
      {...props}
      {...input}
      inputClassName={classNames('field__input', { 'field__input--error': (meta.touched && meta.error) })}
      hasIcon={hasIcon}
      iconClassName={iconClassName}
    />
    {(meta.touched && meta.error) && (
      <div className="field__error">
        {meta.error}
      </div>
    )}
  </div>
);

FormInput.propTypes = {
  hasIcon: PropTypes.bool,
  iconClassName: (props, propName, componentName) => {
    if (props.hasIcon === true && props[propName] === null) {
      return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`.`);
    }
    if (props.hasIcon === true && (props[propName] == undefined || typeof props[propName] !== 'string')) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`string\`.`);
    }
  },
  input: PropTypes.shape({}).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    touched: PropTypes.bool,
  }).isRequired,
};

FormInput.defaultProps = {
  hasIcon: false,
  iconClassName: null,
  label: null,
};

export default FormInput;
