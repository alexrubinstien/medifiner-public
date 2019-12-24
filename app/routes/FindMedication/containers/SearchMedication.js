import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import SimpleSearchForm from '@routes/FindMedication/components/SimpleSearchForm';

import {
  updateForm,
} from '@actions/global';

import {
  findProviders,
  saveRequest,
} from '@actions/providers';

import {
  fetchOptions,
} from '@actions/options'

import globalSelectors from '@selectors/global';
import optionsSelectors from '@selectors/options';

import '@routes/FindMedication/styles/SearchMedication.scss';
import AdvancedSearchForm from '@app/routes/FindMedication/components/AdvancedSearchForm';
import { change as changeFieldValue } from 'redux-form';
import Router from 'next/router';

class SearchMedication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formType: props.formType,
      loading: false,
    };

    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchOptions()
  }

  onSearchTypeChange(type) {
    this.props.updateForm(true);
    this.setState({
      formType: type,
    }, () => {
      Router.replace({
        pathname: '/find-medication',
        query: { search: type },
      });
    });
  }

  onSearchSubmit(values) {
    const {
      formType,
    } = this.state;

    this.props.saveRequest(values);
    this.setState({
      loading: true,
    });

    // query_params:
    //     - med_ids: list of MedicaitonName ids
    //     - dosages: list of dosage ids
    //     - localization: list of 2 coordinates (must be int or float)
    //     - distance: int, in miles
    let dosages = [];
    let med_ids = [];

    if(formType === 'simple'){
      if (values.medId) {
        med_ids.push(values.medId);
      }

      if (values.dosage) {
        dosages.push(values.dosage);
      }
    }else{
      if (values.meds) {
        for (const med of values.meds) {
          med_ids.push(med.medId);
          for (const dosage of med.dosages) {
            dosages.push(dosage);
          }
        }
      }
    }

    values = {
      med_ids,
      dosages,
      localization: `${values.geolocation.coordinates[1]},${values.geolocation.coordinates[0]}`,
      distance: values.searchArea,
    };

    this.props.findProviders(values)
      .then((responseData) => {
        this.setState({
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    const {
      basicInfo,
      options,
    } = this.props;

    const {
      formType,
      loading,
    } = this.state;

    return (
      <div className="search-medication">
        <h2 className="search-medication__title">
          Find Medication Near You
        </h2>
        <div className="clearfix">
          <p className="search-medication__form-type">
            {formType === 'simple' ? 'Simple Search' : 'Advanced Search'}
          </p>
          <p className="search-medication__change-form-container">
            <button
              type="button"
              className="search-medication__change-form"
              onClick={() => this.onSearchTypeChange(formType === 'simple' ? 'advanced' : 'simple')}
            >
              {formType === 'simple' ? 'Go to Advanced Search' : 'Go to Simple Search'}
            </button>
          </p>
        </div>
        {formType === 'simple' ? (
          <SimpleSearchForm
            loading={loading}
            onSubmit={this.onSearchSubmit}
            options={options}
          />
        ) : (
          <AdvancedSearchForm
            loading={loading}
            onSubmit={this.onSearchSubmit}
            options={options}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  basicInfo: globalSelectors.getBasicInfo(state),
  options: optionsSelectors.getOptions(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchOptions,
  findProviders,
  saveRequest,
  changeFieldValue,
  updateForm,
}, dispatch);

SearchMedication.propTypes = {
  basicInfo: PropTypes.shape().isRequired,
  fetchOptions: PropTypes.func.isRequired,
  formType: PropTypes.string,
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
        })).isRequired,
        equivalentMedicationNameIds: PropTypes.arrayOf(
          PropTypes.number.isRequired
        ).isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })),
      medicationTypes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })).isRequired,
    })),
  }).isRequired,
  findProviders: PropTypes.func.isRequired,
  saveRequest: PropTypes.func.isRequired,
  changeFieldValue: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
};

SearchMedication.defaultProps = {
  formType: 'simple',
  options: {},
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchMedication);
