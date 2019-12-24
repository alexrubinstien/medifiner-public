import React, { Component } from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import jstz from 'jstz';
import PropTypes from 'prop-types';
import _ from "lodash"
import { sort as ramdaSort } from "ramda";
import '@routes/FindMedication/styles/MapPopup.scss';

import {
  showMobileMap
} from '@actions/global';


export default class MapPopup extends Component {

  getMedicationDosages(drugs) {
     const supplyLevel = {
       nosupply: 3,
       low: 2,
       medium: 1,
       high: 0
     }
    if(!drugs) return dosages;
    return ramdaSort((a, b) => {
      if(supplyLevel[a.supplyLevel.supply] !== supplyLevel[b.supplyLevel.supply]) {
        return supplyLevel[a.supplyLevel.supply] - supplyLevel[b.supplyLevel.supply]
      }
      const nameA = /\d/.exec(a.name) === null ? a.name : a.name.substring(0, /\d/.exec(a.name).index)
      const nameB = /\d/.exec(b.name) === null ? a.name : b.name.substring(0, /\d/.exec(b.name).index)
      if(nameA !== nameB ) return a.name > b.name;
      if(parseInt(a.dosage) === NaN) return 1;
      if(parseInt(b.dosage) === NaN) return -1;
      return  parseInt(a.dosage)-parseInt(b.dosage);
    }, drugs);
  }
  render() {
    const { provider, showProvider } = this.props;
    const properties = provider ? provider.properties : {};

    const sortedDrugs = _.filter(properties.drugs, drug => drug.supplyLevel.supply === 'high');
    sortedDrugs.push(..._.filter(properties.drugs, drug => drug.supplyLevel.supply === 'medium'));
    sortedDrugs.push(..._.filter(properties.drugs, drug => drug.supplyLevel.supply === 'low'));
    sortedDrugs.push(..._.filter(properties.drugs, drug => drug.supplyLevel.supply === null));

    const tz = jstz.determine();
    const last_import_date = moment.utc(properties.lastImportDate).tz(tz.name());
    const TWENTY_FOUR_HOUR = 24 * 60 * 60 * 1000;
    let render_last_import_date;

    if( ((new Date) - last_import_date) < TWENTY_FOUR_HOUR ){
      render_last_import_date = <Moment fromNow>{properties.lastImportDate}</Moment>;
    }else{
      render_last_import_date = last_import_date.format("hh:mma z on dddd Do MMMM YYYY");
    }

    return (
      <div
        ref={this.popupRef}
        className="map-popup"
      >
        <p className="map-popup__title">
          {properties.name}
        </p>
        <p className="map-popup__address">
          {properties.address}
        </p>
        <p className="map-popup__phone">
          <i className="fas fa-phone map-popup__phone-icon" />
          {properties.phone}
        </p>
        {sortedDrugs && sortedDrugs.length > 0 ? this.getMedicationDosages(sortedDrugs).map((drug, i) => {
            if(i < 3) {
              return (
                <div
                  key={drug.name}
                  className="map-popup__drug"
                >
                  <p className="map-popup__drug-name">
                    {drug.name}
                  </p>
                  <div className="map-popup__drug-supply">
                    <p className="map-popup__drug-supply-text">
                      {drug.supplyLevel.supply} Supply
                    </p>
                    <div className="map-popup__supply-graphic">
                      <div className={`map-popup__supply-square map-popup__supply-square--${drug.supplyLevel.supply}`} />
                    </div>
                  </div>
                </div>
              )
            }
            if (sortedDrugs.length > 3 && i == 3) {
              return (
                <p className="map-popup__drug">Additional medications can be found in the Pharmacy Details page.</p>
              );
            }
        }) : (
          <p className="map-popup__drug">Sorry, this pharmacy is not reporting a supply of the selected medication to MedFinder. We recommend calling to confirm.</p>
        ) }

        {properties.drugs && properties.drugs.length > 0
          && (
          <p className="map-popup__updated">
            Last updated:
            <Moment format="hh:mma on dddd Do MMMM YYYY">
              {properties.lastImportDate}
            </Moment>
          </p>
          )
        }

        <p className="map-popup__details">
          { provider && properties.drugs.length
            ? (<a className="map-popup__details-link" onClick={showProvider.bind(this, provider)}>View Details</a>
            ) : ('')}
        </p>
      </div>
    );
  }
}

MapPopup.propTypes = {
  provider: PropTypes.shape({}),
  showProvider: PropTypes.func.isRequired,
};

MapPopup.defaultProps = {
  provider: null,
};
