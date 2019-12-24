import React, { Component } from 'react';
import { connect } from 'react-redux';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import providersSelectors from '@selectors/providers';
import Dimensions from 'react-dimensions';
import _ from "lodash";
import '@routes/FindMedication/styles/SearchMap.scss';

// Import in parent page because of problem with dynamic import and next-sass
// https://github.com/zeit/next-plugins/issues/192
import '@routes/FindMedication/styles/Map.scss';
import '@routes/FindMedication/styles/MapPopup.scss';

import { showProvider, sortOrder, showMobileMap } from '@actions/global';
import { bindActionCreators } from 'redux';
import globalSelectors from '@selectors/global';

const MapComponent = Dimensions()(dynamic(import('@routes/FindMedication/components/Map'), {
  ssr: false,
}));

class SearchMap extends Component {
  constructor(props) {
    super(props);
    this.showProvider = this.showProvider.bind(this);
  }

  showProvider(provider, e) {
    e.preventDefault();
    this.props.showProvider(provider);
    this.props.showMobileMap(false);
  }

  render() {
    const { providers, activeProvider, sortOrder } = this.props;

    let group = [];
    if(sortOrder === 'relevance') {
       group = providers;
    } else if(sortOrder === 'supply') {
      group = _.map(_.sortBy(providers, function(obj) { return obj.properties.drugs[0] || null; }));
    } else if (sortOrder === 'distance') {
      group = _.map(_.sortBy(providers, function(obj) { return obj.properties.distance; }));
    }
    return (
      <div className="search-map">
        <MapComponent
          features={group}
          activeProvider={activeProvider}
          showProvider={this.showProvider}
        />
      </div>
    );
  }
}
SearchMap.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.shape({
    geometry: PropTypes.shape({}),
    properties: PropTypes.shape({
      id: PropTypes.number,
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
  })),
  activeProvider: PropTypes.shape({
    geometry: PropTypes.shape({}),
    properties: PropTypes.shape({
      id: PropTypes.number,
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
  showProvider: PropTypes.func.isRequired,
  showMobileMap: PropTypes.func.isRequired,
};


const mapDispatchToProps = dispatch => bindActionCreators({
  showProvider,
  showMobileMap,
}, dispatch);

const mapStateToProps = state => ({
  providers: providersSelectors.getProviders(state),
  activeProvider: providersSelectors.getActiveProvider(state),
  sortOrder: globalSelectors.getSortOrder(state)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchMap);
