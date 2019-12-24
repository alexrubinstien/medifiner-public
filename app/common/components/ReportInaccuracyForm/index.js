import React, { Component } from 'react';
import {
  Field,
  reduxForm,
} from 'redux-form';
import PropTypes from 'prop-types';

import Button from '@common/components/Button';
import Input from '@common/components/ReduxFields/Input';
import Textarea from '@common/components/ReduxFields/Textarea';
import Select from '@common/components/ReduxFields/Select';

import { required } from '@app/utils/validators';

import '@common/styles/modal.scss';
import './styles.scss';

class ReportInaccuracyForm extends Component {
  render() {
    const {
      handleSubmit,
      medications
    } = this.props;

    return(
      <form
        className="modal"
        onSubmit={handleSubmit}
      >
        <p className="modal__title">
          Report Inaccuracy
        </p>
        <p className="modal__text"></p>
        <div className="modal__row">
          <div className="modal__column">
            <Field
              label="Pharmacy Information"
              name="providerName"
              type="text"
              placeholder="Pharmacy Name"
              component={Input}
              validate={required}
            />
            <Field
              name="providerAddress"
              type="text"
              placeholder="Pharmacy Address"
              component={Input}
              validate={required}
            />
          </div>
          <div className="modal__column">
            <Field
              name="medicationName"
              label="Medication"
              options={medications.map(medication => ({
                label: medication.name,
                value: medication.name,
              }))}
              placeholder="Select Your Medication"
              component={Select}
              validate={required}
            />
          </div>
        </div>
        <div className="modal__row">
          <div className="modal__column">
            <Field
              name="email"
              type="email"
              label="Email Address"
              placeholder="Enter Email Address"
              component={Input}
              validate={required}
            />
          </div>
          <div className="modal__column">
            <Field
              name="dateVisitedPharmacy"
              label="Date Visited Pharmacy"
              component={Input}
              validate={required}
              type="date" />
          </div>
        </div>
        <Field
          isOptional
          rows={5}
          name="additionalComments"
          label="Additional Comments "
          placeholder="Enter Comments"
          component={Textarea}
        />
        <div className="modal__button-container">
          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    )
  }
}

ReportInaccuracyForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  medications: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    medications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  })).isRequired
};

export default reduxForm({
  form: 'reportInaccuracy',
})(ReportInaccuracyForm);
