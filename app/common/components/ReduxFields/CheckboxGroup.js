import React, {Component} from 'react';
import {Field} from "redux-form";
import PropTypes from 'prop-types';

import classNames from 'classnames';

export default class CheckboxGroup extends Component {

  static propTypes = {
    defaultValue: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
      ]),
    ),
    options: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })).isRequired
  };

  field = ({input, meta, options}) => {

    const {name, onChange} = input;
    const {touched, error} = meta;
    const inputValue = input.value;

    const checkboxes = options.map(({name, id}, index) => {
      const handleChange = (event) => {
        const arr = [...inputValue];
        if (event.target.checked) {
          arr.push(id);
        }
        else {
          arr.splice(arr.indexOf(id), 1);
        }
        return onChange(arr);
      };
      const checked = inputValue.includes(id);
      return (
        <div key={id} className="field__checkbox-container">
          <label className="field__checkbox-label">
            <input type="checkbox" name={`${name}[${index}]`} className="field__checkbox" value={id} id={id} checked={checked} onChange={handleChange} />
            <span className={classNames('field__fake-checkbox fas', { 'fa-check': checked })}></span>
            {name}
          </label>
         </div>
      );
    });

    return (
      <div>
        <div>{checkboxes}</div>
        {touched && error && <p className="error">{error}</p>}
      </div>
    );
  };

  render() {
    return <Field {...this.props} type="checkbox" component={this.field} />;
  }
}
