import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Field,
  FieldArray,
  formValueSelector,
  reduxForm,
  change as changeFieldValue,
} from 'redux-form';
import { sort as ramdaSort } from 'ramda';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import globalSelectors from '@selectors/global';
import providersSelectors from '@selectors/providers';
import { updateForm } from '@actions/global';
import { getActiveOptions } from '@routes/FindMedication/utils/options';

import Button from '@common/components/Button';
import CheckboxGroup from '@common/components/ReduxFields/CheckboxGroup';
import Loader from '@common/components/Loader';
import Tooltip from '@common/components/Tooltip';
import Select from '@common/components/ReduxFields/Select';

import { required } from '@app/utils/validators';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import '@routes/FindMedication/styles/SearchForm.scss';

const Geocoder = dynamic(import('@common/components/ReduxFields/Geocoder'), {
  ssr: false,
});

class AdvancedSearch extends Component {
  constructor(props) {
    super(props);

    this.renderMedications = this.renderMedications.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  componentDidMount() {
    const { simpleForm, formChanged, query, } = this.props;

    if (simpleForm && !_.isEmpty(simpleForm) && formChanged) {
      this.setDefaultValuesBasedOnSimpleForm(simpleForm)
    } else {
      this.setDefaultValues()
    }
  }

  setDefaultValuesBasedOnSimpleForm(simpleForm){
    _.forEach(simpleForm, (value, key) => {
      if (key !== 'medId' || key !== 'dosage') {
        this.props.changeFieldValue('advancedSearch', key, value);
      }
    });

    // why this? because we need the drugtypes checkboxes to kick in and set the activeOptions to the right value before setting
    // up a medication entry otherwise option might not match the medication we're trying to set
    var that = this;
    setTimeout(function(){
      that.props.changeFieldValue('advancedSearch', 'meds', [{ medId: simpleForm['medId'], dosages: [simpleForm['dosage']] }]);
    }, 75)

    updateForm(false);
  }


  setDefaultValues(){
    this.props.changeFieldValue('advancedSearch', 'drugTypes', [1, 2]);
    this.props.changeFieldValue('advancedSearch', 'meds', [{ medId: null, dosages: [] }]);
    this.props.changeFieldValue('advancedSearch', 'searchArea', 5);
  }

  clearSearch = () => {
    this.props.reset();
    this.setDefaultValues();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.medIds && prevProps.medIds !== this.props.medIds) {
      this.changeMedicationDosage(prevProps.medIds);
    }

    if (prevProps.drugTypes !== this.props.drugTypes) {
      this.findEquivalentMedication();
    }
  }

  // on drugType update match new medication
  // name with equivalent medication names
  findEquivalentMedication() {
    const { drugTypes, medIds, options } = this.props;
    if(medIds){
      const activeOptions = getActiveOptions(options, drugTypes);
      if(Object.keys(activeOptions).length === 0){
        for(let index=0; index < medIds.length; index++){
            this.props.change(`meds[${index}].medId`, null);
        }
        return;
      }
      if (activeOptions && activeOptions.medicationNames) {
        for(var index=0; index<medIds.length; index++){
          const medId = medIds[index];
          let medFound = false;
          for(const medicationName of activeOptions.medicationNames){
            if(medicationName.equivalentMedicationNameIds.indexOf(medId.medId) > -1){
                this.props.change(`meds[${index}].medId`, medicationName.id);
                medFound = true;
            }
          }
          if(!medFound){
            this.props.change(`meds[${index}].medId`, null);
          }
        }
      }
    }
  }

  changeMedicationDosage(prevMedications) {
    const { medIds } = this.props;
    medIds.forEach((medication, index) => {
      if (medication.medId && medication.medId !== prevMedications[index].medId) {
        if (medication.medId === 'all') {
          this.props.change(`meds[${index}].dosages`, []);
        } else {
          let activeOptions = getActiveOptions(this.props.options, this.props.drugTypes);
          if(activeOptions && activeOptions.medicationDosages && activeOptions.medicationDosages[medication.medId]) {
            const dosageOptions = activeOptions.medicationDosages[medication.medId]
            const selectedDosages = medication.dosages
            if(!(dosageOptions && selectedDosages)) return;
            const dosageOptionValues = dosageOptions.map(dosageOption => dosageOption.value)
            if(!selectedDosages.some(selectedDosage => !dosageOptionValues.includes(selectedDosage))) {
              this.props.change('medIds', index, 'dosages', selectedDosages);
            } else {
              this.props.change(`meds[${index}].dosages`, null);
            }
          }
        }
      }
    });
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

  detectEmptyDosagesForSelectedMedication(medIds, activeOptions){
    const {
      options,
    } = this.props;

    let hasEmptyDosages = false

    if(medIds && activeOptions && activeOptions.medicationNames){
      medIds = medIds.map(o => o.medId)

      let equivalentMedicationNameIds = [];

      for(const medicationName of activeOptions.medicationNames){
        if(medIds.indexOf(medicationName.id) > -1){
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

  renderMedications({ fields }) {
    const {
      drugTypes,
      medIds,
      options,
    } = this.props;


    let activeOptions = getActiveOptions(options, drugTypes);
    const selectedMedIds = medIds ? medIds.map((medId) => medId.medId).filter((medId) => medId) : []
    return (
      <div>
        {fields.map((field, index) => {
          const currentMedId = medIds[index] ? medIds[index].medId : null
          const optionId = activeOptions && activeOptions.medicationNames ? activeOptions.medicationNames[index].id : null;
          const otherSelectedMedIds = selectedMedIds.filter((selectMedId) => selectMedId != currentMedId)
          let medicationNames = activeOptions.medicationNames ? activeOptions.medicationNames.filter((medName) => {
            return otherSelectedMedIds.indexOf(medName.id) == -1 || medName.id == currentMedId;
          }) : []
          if (index === 0 && fields.length === 1) {
            medicationNames = [
              ...medicationNames,
              {
                label: 'Select All',
                value: 'all',
              },
            ];
          }

          let dosagePlaceholder = currentMedId ? 'Select Your Dosage' : 'Select Your Medication first';
          if (medIds[0].medId === 'all') {
            dosagePlaceholder = 'All dosages';
          }

          return (
            <div
              key={index}
              className="search-form__fields-row"
            >
              <div className="search-form__field-group">
                <div className="search-form__field-container">
                  <Field
                    hasTooltip
                    tooltipText="Antiviral drugs approved for flu treatment and prevention include oseltamivir (also known as Tamiflu&reg;), zanamivir (also known as Relenza&reg;), and baloxavir marboxil (also known as XOFLUZA&trade;)"
                    tooltipTitle="Medication"
                    name={`${field}.medId`}
                    label="Medication"
                    options={medicationNames}
                    placeholder="Select Your Medication"
                    component={Select}
                    validate={required}
                  />
                </div>
                <div className="search-form__field-container">
                  <Field
                    hasTooltip
                    isMulti
                    tooltipText="The specified dosage can be found on your prescription, e.g., 75mg capsule (pill)."
                    tooltipTitle="Dosage"
                    name={`${field}.dosages`}
                    label="Dosage"
                    isDisabled={!currentMedId || currentMedId == 'all'}
                    options={(activeOptions && activeOptions.medicationDosages && currentMedId) ? this.getMedicationDosages(activeOptions.medicationDosages[currentMedId]) : []}
                    placeholder={dosagePlaceholder}
                    component={Select}
                    validate={required}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {medIds && medIds[0].medId !== 'all' && (
          <div className="search-form__fields-row">
            {(fields.length > 1) && (
              <div className="search-form__remove-medication">
                <div className="search-form__remove-button-container">
                  <button
                    type="button"
                    className="search-form__remove-medication-button"
                    onClick={() => fields.pop()}
                  >
                    <i className="far fa-trash-alt search-form__remove-medication-icon" />
                    Remove last medication
                  </button>
                </div>
              </div>
            )}
            {(activeOptions.medicationNames && activeOptions.medicationNames.length > fields.length) && (
              <div className="search-form__add-medication">
                <button
                  type="button"
                  className="search-form__add-medication-button"
                  onClick={() => fields.push({})}
                >
                  <i className="fas fa-plus-circle search-form__add-medication-icon" />
                  Add another medication
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  render() {
    const {
      drugTypes,
      handleSubmit,
      loading,
      medIds,
      options,
      valid,
    } = this.props;

    const activeOptions = getActiveOptions(options, drugTypes);
    const hasEmptyDosages = this.detectEmptyDosagesForSelectedMedication(medIds, activeOptions)

    return (
      <form
        className="search-form"
        onSubmit={handleSubmit}
      >
        <p className="search-form__text">
          Start by choosing your medication and then add the prescribed dosage level.
          <br />
          You can search for up to 2 different drugs at the same time.
        </p>
        <FieldArray
          rerenderOnEveryChange
          name="meds"
          component={this.renderMedications}
        />
        <div className="search-form__fields-row">
          <div className="search-form__field-container search-form__field-container--address">
            <Field
              //hasIcon
              autoComplete="off"
              autocomplete="off"
              name="geolocation"
              label="Near this Location"
              placeholder="Enter Address or Zip Code"
              //iconClassName="fas fa-crosshairs"
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
            {options.medicationTypes && options.medicationTypes.length && (
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

const formSelector = formValueSelector('advancedSearch');
const simpleFormSelector = formValueSelector('simpleSearch');
const mapStateToProps = state => ({
  drugTypes: formSelector(state, 'drugTypes'),
  formChanged: globalSelectors.getFormStatus(state),
  medIds: formSelector(state, 'meds'),
  query: providersSelectors.getParams(state),
  simpleForm: simpleFormSelector(state, 'medId', 'dosage', 'drugTypes', 'geolocation', 'searchArea'),
  values: formSelector(state, 'drugTypes', 'geolocation', 'searchArea'),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  changeFieldValue,
  updateForm,
}, dispatch);

AdvancedSearch.propTypes = {
  change: PropTypes.func.isRequired,
  drugTypes: PropTypes.arrayOf(
    PropTypes.number
  ),
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
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
          PropTypes.number.isRequired
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
  values: PropTypes.shape({}),
  simpleForm: PropTypes.shape({}),
  valid: PropTypes.bool.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  formChanged: PropTypes.bool.isRequired,
  updateForm: PropTypes.func.isRequired,
};

AdvancedSearch.defaultProps = {
  medIds: null,
  values: null,
  simpleForm: null,
};

const AdvancedSearchConnect = connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch);

export default reduxForm({
  destroyOnUnmount: false,
  form: 'advancedSearch',
})(AdvancedSearchConnect);
