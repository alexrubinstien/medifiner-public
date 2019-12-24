import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '@app/common/components/Button';

import SearchResult from '@routes/FindMedication/components/SearchResult';

import providersSelectors from '@selectors/providers';
import optionsSelectors from '@selectors/options';
import globalSelectors from '@selectors/global';

import {
  showSearch, showResults, showProvider, showMobileMap, sortOrder
} from '@actions/global';
import { activateProvider } from '@actions/providers';
import { getActiveOptions } from '@routes/FindMedication/utils/options';

import '@routes/FindMedication/styles/SearchResults.scss';
import _ from 'lodash';
import SearchParams from '@routes/FindMedication/components/SearchParams';
import MedicationProvider from '@routes/FindMedication/components/MedicationProvider.js';


class SearchResults extends Component {
  constructor(props) {
    super(props);
    this.editSearch = this.editSearch.bind(this);
    this.queryToSearchData = this.queryToSearchData.bind(this);
    this.showProvider = this.showProvider.bind(this);
    this.showResults = this.showResults.bind(this);
    this.activateProvider = this.activateProvider.bind(this);
    this.handleMapSwitchClick = this.handleMapSwitchClick.bind(this);
  }

  componentDidMount() {
    document.getElementsByClassName("find-medication-view__search-content")[0].scrollTop = 0;
  }

  editSearch(e) {
    e.preventDefault();
    this.props.showMobileMap(false);
    this.props.showSearch();
  }

  showProvider(provider, e) {
    e.preventDefault();
    this.props.showProvider(provider);
  }

  activateProvider(provider) {
    this.props.activateProvider(provider);
  }

  showResults() {
    this.props.showResults();
  }

  handleMapSwitchClick() {
    this.props.showMobileMap(!this.props.mobileMap);
  }


  queryToSearchData(query) {
    const {
      options,
      searchType,
    } = this.props;

    const activeOptions = getActiveOptions(options, query.drugTypes);
    const medications = [];

    if (query.meds && searchType == 'advanced') {
      for(const med of query.meds){
        if(med.medId !== 'all') {
          const medication = activeOptions.medicationNames.filter(m => m.id === med.medId)[0];
          const dosage = activeOptions.medicationDosages[med.medId].filter(m => _.includes(med.dosages, m.id)).map(f => f.name).join(', ');
          medications.push(`${medication.name} ${dosage}`);
        } else {
          medications.push('All medications');
        }
      }
    }

    if (query.medId && searchType == 'simple') {
      const medId = query.medId
      const dosageId = query.dosage

      let dosage = ''
      let medication = ''

      for(const medicationName of activeOptions.medicationNames){
        if(medicationName.id == medId){
          medication = medicationName.name
        }
      }

      for(const medicationDosage of activeOptions.medicationDosages[query.medId]){
        if(medicationDosage.id == dosageId){
          dosage = medicationDosage.name
        }
      }

      medications.push(`${medication} ${dosage}`);
    }

    return {
      name: medications.join(' and '),
      distance: query.searchArea,
      location: query.geolocation.name,
    };
  }

  componentWillUnmount() {
    this.props.showMobileMap(false);
    this.props.showSearch();
  }


  render() {
    const {
      mobileMap,
      provider,
      providers,
      query,
      searchType,
      sortOrder,
      view,
    } = this.props;

    let position = 0;
    let group = [];
    const list = [];

    if(sortOrder === 'relevance') {
       group = providers;
    } else if(sortOrder === 'supply') {
      group = _.map(_.sortBy(providers, function(obj) { return obj.properties.drugs[0] || null; }));
    } else if (sortOrder === 'distance') {
      group = _.map(_.sortBy(providers, function(obj) { return obj.properties.distance; }));
    }

    _.map(group, (p) => {
      if (p.properties.active) {
        position += 1;
        list.push(<SearchResult
          key={p.properties.id}
          position={position}
          provider={p}
          showProvider={this.showProvider}
          activateProvider={this.activateProvider}
          displayOtherDrugsCount={searchType == 'advanced'}
        />);
      }
    });
    return (
      <div>
        { (view === 'results') ? (
          <div className="search-results">
            <div className="clearfix">
              <h2 className="search-results__title">
              We found {list.length} Pharmacies
              </h2>
              <div className="search-results__switch-container">
                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                  <label htmlFor="switch_list" className={classNames('button button--secondary', { active: !mobileMap })}>
                    <input type="radio" name="switch" id="switch_list" autoComplete="off" defaultChecked onClick={this.handleMapSwitchClick} /> List
                  </label>
                  <label htmlFor="switch_map" className={classNames('button button--secondary', { active: mobileMap })}>
                    <input type="radio" name="switch" id="switch_map" autoComplete="off" onClick={this.handleMapSwitchClick} />
                    Map
                  </label>
                </div>
              </div>
              <div className="search-results__edit-container">
                <Button secondary className="search-results__edit-button" onClick={this.editSearch}>
                  <i className="fas fa-sliders-h search-results__edit-button-icon" />
                Edit search
                </Button>
              </div>
            </div>
            <SearchParams params={this.queryToSearchData(query)} />
            <div className={"search-results__list state-"+searchType}>
              {list}
            </div>
          </div>)
          : (<MedicationProvider provider={provider} showResults={this.showResults} />)
        }
      </div>);
  }
}

const mapStateToProps = state => ({
  providers: providersSelectors.getProviders(state),
  query: providersSelectors.getParams(state),
  mobileMap: globalSelectors.getMobileMap(state),
  options: optionsSelectors.getOptions(state),
  sortOrder: globalSelectors.getSortOrder(state),
  provider: globalSelectors.getProvider(state),
  view: globalSelectors.findView(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  showSearch,
  showProvider,
  showResults,
  activateProvider,
  showMobileMap,
}, dispatch);

SearchResults.propTypes = {
  searchType: PropTypes.string,
  providers: PropTypes.arrayOf(PropTypes.shape({
    geometry: PropTypes.shape({}),
    properties: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      name: PropTypes.string,
      address: PropTypes.string,
      phone: PropTypes.string,
      website: PropTypes.string,
      email: PropTypes.string,
      active: PropTypes.bool,
      operating_hours: PropTypes.string,
      insurance_accepted: PropTypes.bool,
      distance: PropTypes.number,
      store_number: PropTypes.number,
      drugs: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  })).isRequired,
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
  query: PropTypes.shape({
    meds: PropTypes.arrayOf(PropTypes.shape({
      medId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      dosages: PropTypes.arrayOf(PropTypes.number),
    })),
    medId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
    dosage: PropTypes.number,
    geolocation: PropTypes.shape({
      name: PropTypes.string,
    }),
    drugType: PropTypes.string,
    searchArea: PropTypes.number,
  }).isRequired,
  showSearch: PropTypes.func.isRequired,
  showProvider: PropTypes.func.isRequired,
  showResults: PropTypes.func.isRequired,
  activateProvider: PropTypes.func.isRequired,
  provider: PropTypes.shape({
    geometry: PropTypes.shape({}),
    properties: PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
      name: PropTypes.string,
      address: PropTypes.string,
      phone: PropTypes.string,
      website: PropTypes.string,
      email: PropTypes.string,
      active: PropTypes.bool,
      operating_hours: PropTypes.string,
      insurance_accepted: PropTypes.bool,
      distance: PropTypes.number,
      store_number: PropTypes.number,
      drugs: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }),
  searchType: PropTypes.string,
  view: PropTypes.string,
  showMobileMap: PropTypes.func.isRequired,
  mobileMap: PropTypes.bool.isRequired,
  sortOrder: PropTypes.string,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults);
