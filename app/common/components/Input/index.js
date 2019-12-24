import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Tooltip from '@common/components/Tooltip';

import './styles.scss';

const Input = ({
  children,
  className,
  hasIcon,
  hasTooltip,
  iconClassName,
  inputClassName,
  label,
  tooltipText,
  tooltipTitle,
  wide,
  ...props,
}) => (
  <div
    className={
      classNames(className, {
        input: true,
        'input--wide': wide,
      })
    }
  >
    {label && (
      <div className="input__label">
        {label}
        {hasTooltip && (
          <Tooltip title={tooltipTitle}>
            {tooltipText}
          </Tooltip>
        )}
    </div>)}
    <div className="input__input-container">
      {hasIcon && (
        <i className={classNames('input__icon', iconClassName)} />
      )}
      <input
        type="text"
        className={classNames('input__input', inputClassName)}
        {...props}
      />
    </div>
    {children}
  </div>
);

Input.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hasIcon: PropTypes.bool,
  hasTooltip: PropTypes.bool,
  iconClassName: (props, propName, componentName) => {
    if (props.hasIcon === true && props[propName] === null) {
      return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`.`);
    }
    if (props.hasIcon === true && (props[propName] == undefined || typeof props[propName] !== 'string')) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`string\`.`);
    }
  },
  inputClassName: PropTypes.string,
  label: PropTypes.string,
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
  wide: PropTypes.bool,
};

Input.defaultProps = {
  children: null,
  className: '',
  hasIcon: false,
  hasTooltip: false,
  iconClassName: null,
  inputClassName: '',
  label: null,
  tooltipText: null,
  tooltipTitle: null,
  wide: false,
};

export default Input;
