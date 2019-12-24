import React, { Component } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

import '@routes/FindMedication/styles/SearchResult.scss';

class SearchResult extends Component {
  render() {
    const {
      provider,
      showProvider,
      activateProvider,
      displayOtherDrugsCount,
      position,
    } = this.props;
    const prop = provider.properties;
    let supply;
    let drug;
    if (prop.drugs.length > 0) {
      drug = prop.drugs[0];
      supply = drug.supplyLevel.supply;
      drug = `${drug.medicationName} - ${drug.dosage}`;
    } else {
      supply = 'No';
      drug = 'Unavailable';
    }
    drug = (
      <div className="search-result__supply">
        <div className="search-result__supply-graphic">
          <div className={`search-result__supply-square search-result__supply-square--${supply}`} />
        </div>
        <p className="search-result__supply-text">
          { supply != 'nosupply' ? supply : 'No' } supply
        </p>
        <p className="search-result__supply-drug">
          {drug}
        </p>
      </div>
    );

    return (
      <div
        className="search-result"
        onClick={showProvider.bind(this, provider)}
        onMouseEnter={activateProvider.bind(this, provider)}
        onMouseLeave={activateProvider.bind(this, null)}
      >
        <div className="search-result__name-distance">
          <p className="search-result__name">
            {position}. {prop.name}
          </p>
          <p className="search-result__distance">
            {prop.distance.toFixed(2)} miles
          </p>
        </div>
        <div className="search-result__supply-container">
          {drug}
        </div>
        <p className="search-result__other-drugs">
          {displayOtherDrugsCount && (
            ((prop.drugs.length-1) > 0 ? prop.drugs.length-1 : 'No') + ' other drug' + ((prop.drugs.length-1) == 1 ? '' : 's') + ' carried'
          )}
        </p>
        <div className="search-result__action-container">
          <Link href="/">
            <a className="search-result__link" onClick={showProvider.bind(this, provider)}>
              <i className="fas fa-arrow-right" />
            </a>
          </Link>
        </div>
      </div>);
  }
}

SearchResult.propTypes = {
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
  }).isRequired,
  showProvider: PropTypes.func.isRequired,
  activateProvider: PropTypes.func.isRequired,
  displayOtherDrugsCount: PropTypes.bool.isRequired,
  position: PropTypes.number,
};

export default SearchResult;
