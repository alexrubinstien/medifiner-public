import React from 'react';
import {
  Field,
  reduxForm,
} from 'redux-form';
import PropTypes from 'prop-types';

import Button from '@common/components/Button';
import Input from '@common/components/ReduxFields/Input';
import Textarea from '@common/components/ReduxFields/Textarea';

import { required } from '@app/utils/validators';

import '@common/styles/modal.scss';

const PharmacyInterestFields = ({ handleSubmit }) => (
  <form
    className="modal"
    onSubmit={handleSubmit}
  >
    <p className="modal__title">
      Pharmacy Contact Form
    </p>
    <p className="modal__text">
      If you are a representative for a pharmacy that is interested in participating in the MedFinder program, fill out the following form and we will be in touch shortly.
    </p>
    <div className="modal__row">
      <div className="modal__column">
        <Field
          name="representativeName"
          label="Representative Name"
          component={Input}
          validate={required}
        />
      </div>
      <div className="modal__column">
        <Field
          name="email"
          type="email"
          label="Email Address"
          component={Input}
          validate={required}
        />
      </div>
    </div>
    <div className="modal__row">
      <div className="modal__column">
        <Field
          name="pharmacyName"
          label="Pharmacy Name"
          component={Input}
          validate={required}
        />
      </div>
      <div className="modal__column">
        <Field
          name="pharmacyAddress"
          label="Pharmacy Address"
          component={Input}
          validate={required}
        />
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
);

PharmacyInterestFields.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'pharmacyInterest',
})(PharmacyInterestFields);
