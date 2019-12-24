import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Field,
  formValueSelector,
  reduxForm,
  change as changeFieldValue,
} from 'redux-form';
import { sort as ramdaSort } from "ramda";
import globalSelectors from '@selectors/global';
import providersSelectors from '@selectors/providers';
import { updateForm } from '@actions/global';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';

import Button from '@common/components/Button';
import CheckboxGroup from '@common/components/ReduxFields/CheckboxGroup';
import Loader from '@common/components/Loader';
import Select from '@common/components/ReduxFields/Select';
import _ from "lodash";

import { getActiveOptions } from '@routes/FindMedication/utils/options';
import { required } from '@app/utils/validators';

import Tooltip from '@common/components/Tooltip';

import '@routes/FindMedication/styles/SearchForm.scss';

import { bindActionCreators } from 'redux';

const Geocoder = dynamic(import('@common/components/ReduxFields/Geocoder'), {
  ssr: false,
});


class SimpleSearch extends Component {
  componentDidMount() {
    const {
      advancedForm,
      formChanged,
      query,
    } = this.props;

    this.clearSearch = this.clearSearch.bind(this);
    if (formChanged && advancedForm && !_.isEmpty(advancedForm)) {
      this.setDefaultValuesBasedOnAdvancedForm(advancedForm)
     } else {
      this.setDefaultValues()
    }
    updateForm(false);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.drugTypes !== this.props.drugTypes) {
      this.findEquivalentMedication()
    }

    if (prevProps.medId !== this.props.medId) {
      const { options, drugTypes, medId, dosage } = this.props;
      const activeOptions = getActiveOptions(options, drugTypes);
      if (medId && activeOptions && activeOptions.medicationDosages && activeOptions.medicationDosages[medId]) {
        if(!activeOptions.medicationDosages[medId].find(option => option.value === dosage)){
          this.props.changeFieldValue("simpleSearch", "dosage", null);
        }
      } else {
        this.props.changeFieldValue("simpleSearch", "dosage", null)
      }
    }
  }

  setDefaultValuesBasedOnAdvancedForm(advancedForm){
    _.forEach(advancedForm, (value, key) => {
      if (key === 'meds') {
        if (!_.isEmpty(value[0])) {
          if (value[0].medId !== 'all') {
            this.props.changeFieldValue('simpleSearch', 'medId', value[0].medId);
            if (!_.isEmpty(value[0].dosages)) {
              this.props.changeFieldValue('simpleSearch', 'dosage', value[0].dosages[0]);
            }
          }
        }
      } else {
        this.props.changeFieldValue('simpleSearch', key, value);
      }
    });
  }

  setDefaultValues = () => {
    this.props.changeFieldValue('simpleSearch', 'drugTypes', [1, 2]);
    this.props.changeFieldValue('simpleSearch', 'searchArea', 5);
  }

  clearSearch = () => {
    this.props.reset();
    this.setDefaultValues();
  }

  findEquivalentMedication() {
    const { drugTypes, medId, options } = this.props;
    const activeOptions = getActiveOptions(options, drugTypes);
    if (activeOptions && activeOptions.medicationNames) {
      for(const medicationName of activeOptions.medicationNames){
        if(medicationName.equivalentMedicationNameIds.indexOf(medId) > -1){
          this.props.change('medId', medicationName.id);
        }
      }
    } else {
      this.props.change('medId', null);
    }
  }

  getMedicationDosages(dosages){
    if(!dosages) return dosages;
    return ramdaSort((a, b) => {
      const valueA = parseInt(a.name);
      const valueB = parseInt(b.name);
      if(valueA === NaN) return 1;
      if(valueB === NaN) return -1;
      return valueA - valueB;
    }, dosages);
  }

  detectEmptyDosagesForSelectedMedication(medId, activeOptions){
    const {
      options,
    } = this.props;

    let hasEmptyDosages = false

    if(medId && activeOptions && activeOptions.medicationNames){
      let equivalentMedicationNameIds = [];

      for(const medicationName of activeOptions.medicationNames){
        if(medicationName.id == medId){
          if(medicationName.dosages.length == 0){
            hasEmptyDosages = true
          }
          equivalentMedicationNameIds = medicationName.equivalentMedicationNameIds;
        }
      }

      for(const option of options.options){
        for(const medicationName of option.medicationNames){
          if(equivalentMedicationNameIds.indexOf(medicationName.id) > -1){
            if(medicationName.dosages.length == 0){
              hasEmptyDosages = true
            }
          }
        }
      }
    }
    return hasEmptyDosages
  }

  render() {
    const {
      drugTypes,
      handleSubmit,
      loading,
      medId,
      options,
      valid,
    } = this.props;

    const activeOptions = getActiveOptions(options, drugTypes)
    const hasEmptyDosages = this.detectEmptyDosagesForSelectedMedication(medId, activeOptions)

    return (
      <form
        className="search-form"
        onSubmit={handleSubmit}
      >
      <div>
        <p className="search-form__text">
          Edit the fields below to define your search
        </p>
        </div>

        <div className="search-form__fields-row">
          <div className="search-form__field-container">
            <Field
              hasTooltip
              tooltipText="Antiviral drugs approved for flu treatment and prevention include oseltamivir (also known as Tamiflu&reg;), zanamivir (also known as Relenza&reg;), and baloxavir marboxil (also known as XOFLUZA&trade;)"
              tooltipTitle="Medication"
              name="medId"
              label="Medication"
              options={activeOptions.medicationNames ? activeOptions.medicationNames : []}
              placeholder="Select Your Medication"
              component={Select}
              validate={required}
            />
          </div>
          <div className="search-form__field-container">
            <Field
              hasTooltip
              tooltipText="The specified dosage can be found on your prescription, e.g., 75mg capsule (pill)."
              tooltipTitle="Dosage"
              name="dosage"
              label="Dosage"
              isDisabled={!medId}
              options={(activeOptions && activeOptions.medicationDosages && medId) ? this.getMedicationDosages(activeOptions.medicationDosages[medId]) : []}
              placeholder={medId ? 'Select Your Dosage' : 'Select Your Medication first'}
              component={Select}
              validate={required}
            />
          </div>
          <div className="search-form__field-container search-form__field-container--address">
            <Field
              //hasIcon
              autoComplete="off"
              autocomplete="off"
              name="geolocation"
              label="Near this Location"
              placeholder="Enter Address or Zip Code"
              //iconClassName="fas fa-crosshairs"
              value="hello"
              component={Geocoder}
              validate={required}
            />
          </div>
          <div className="search-form__field-container search-form__field-container--area">
            <Field
              name="searchArea"
              label="Search Area"
              options={[{
                label: '1 mile',
                value: 1,
              }, {
                label: '5 miles',
                value: 5,
              }, {
                label: '10 miles',
                value: 10,
              }, {
                label: '25 miles',
                value: 25,
              }, {
                label: '50 miles',
                value: 50,
              }]}
              component={Select}
              validate={required}
            />
          </div>
          <div className="search-form__field-container search-form__field-container--wide">
            {options.medicationTypes && (
              <div className="field">
                <div className="field__label">
                  Narrow by
                  <Tooltip title="Narrow by">Generic medicines use the same active ingredients as brand-name medicines and work the same way, so they have the same risks and benefits as the brand-name medicines. Generic medicines tend to cost less than brand-name medicines.</Tooltip>
                </div>
                <div className="field__checkboxes field__checkboxes--space-between">
                  <CheckboxGroup
                    defaultValue={options.medicationTypes}
                    name="drugTypes"
                    options={options.medicationTypes}
                    validate={required}
                  ></CheckboxGroup>
                </div>
                {hasEmptyDosages && (
                  <p className='field__error'>Currently, only the brand-name drugs for Baloxavir and Zanamivir are available within the US market.<br />Selecting only 'Generic' for these medications will not display any results.</p>
                )}
               </div>
            )}
          </div>
        </div>
        <div className="search-form__button-container">
          {loading && (<Loader className="loader__push_left" />)}
          {!loading && (
            <div>
              <div>
                <Button
                  type="submit"
                  disabled={!valid}
                >
                  Search for medication
                </Button>
              </div>
              <div>
                <a onClick={this.clearSearch}>Clear all search fields</a>
              </div>
            </div>
          )}
        </div>
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  changeFieldValue,
  updateForm,
}, dispatch);

const formSelector = formValueSelector('simpleSearch');
const advancedFormSelector = formValueSelector('advancedSearch');
const mapStateToProps = state => ({
  advancedForm: advancedFormSelector(state, 'meds', 'dosages', 'drugTypes', 'geolocation', 'searchArea'),
  dosage: formSelector(state, 'dosage'),
  drugTypes: formSelector(state, 'drugTypes'),
  formChanged: globalSelectors.getFormStatus(state),
  medId: formSelector(state, 'medId'),
  query: providersSelectors.getParams(state),
});

SimpleSearch.propTypes = {
  advancedForm: PropTypes.shape({}),
  change: PropTypes.func.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formChanged: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  dosage: PropTypes.number,
  loading: PropTypes.bool.isRequired,
  medId: PropTypes.number,
  options: PropTypes.shape({
    medicationTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })),
    options: PropTypes.arrayOf(PropTypes.shape({
      medicationDosages: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })),
        PropTypes.object,
      ]),
      medicationNames: PropTypes.arrayOf(PropTypes.shape({
        dosages: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
        })),
        equivalentMedicationNameIds: PropTypes.arrayOf(
          PropTypes.number.isRequired,
        ),
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })),
      medicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })),
    })),
  }).isRequired,
  updateForm: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired,
};

SimpleSearch.defaultProps = {
  advancedForm: null,
  dosage: null,
  medId: null,
};

const SimpleSearchConnect = connect(mapStateToProps, mapDispatchToProps)(SimpleSearch);

export default reduxForm({
  destroyOnUnmount: false,
  form: 'simpleSearch',
})(SimpleSearchConnect);
