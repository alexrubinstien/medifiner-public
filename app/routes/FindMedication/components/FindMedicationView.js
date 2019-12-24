import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { reset } from 'redux-form';
import SearchMapContainer from '@routes/FindMedication/containers/SearchMap';
import SearchMedication from '@routes/FindMedication/containers/SearchMedication';
import SearchResultsContainer from '@app/routes/FindMedication/containers/SearchResults';

import globalSelectors from '@selectors/global';

import { detectWebGL } from '@app/utils/helpers';
import { change as changeFieldValue } from 'redux-form';
import '@routes/FindMedication/styles/FindMedicationView.scss';
import { connect } from 'react-redux';
import { clearMap } from '@actions/providers';
class FindMedicationView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'list',
    };

    this.onChangeView = this.onChangeView.bind(this);
  }

  onChangeView(view) {
    this.setState({
      view,
    });
  }

  componentWillMount() {
    if (typeof document !== 'undefined') {
      this.supportsGL = detectWebGL();
    }
  }

  showResults(showResults, view) {
    return showResults || view === 'results';
  }

  resetSearchForm() {
    return reset('simpleSearch')
  }
  componentWillUnmount() {
    this.props.resetSearch();
  }

  render() {
    const {
      searchType,
      showResults,
      showProvider,
      view,
      mobileMap,
      supportsGL
    } = this.props;

    return (
      <div className="find-medication-view">
        <div className="find-medication-view__search">
          <div className="find-medication-view__search-content">
            { (showResults || view === 'results' || view === 'provider') ? ( <SearchResultsContainer searchType={searchType} /> ) : (<SearchMedication formType={searchType} /> )}
          </div>
        </div>
        {this.supportsGL &&
          <div className={classNames('find-medication-view__map', { 'find-medication-view__map--active': mobileMap })}>
            <SearchMapContainer />
          </div>
        }
        {!this.supportsGL && 
          <div className="find-medication-view__map ie">
            <span className="no-gl-warning-message">We're sorry, this browser does not support WebGL 2, which powers the MedFinder map feature.<br/> While you can still view our search results, we recommend upgrading to a <a href="https://www.google.com/chrome/" target="_blank">supported browser.</a></span>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  basicInfo: globalSelectors.getBasicInfo(state),
  view: globalSelectors.findView(state),
  mobileMap: globalSelectors.getMobileMap(state),
});

const mapDispatchToProps = dispatch => ({
  changeFieldValue,
  resetSearch: () => { 
    dispatch(reset('simpleSearch'));
    dispatch(reset('advancedSearch'));
    clearMap()(dispatch);
  },
  
})

FindMedicationView.propTypes = {
  searchType: PropTypes.string.isRequired,
  showResults: PropTypes.bool.isRequired,
  showProvider: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FindMedicationView);
