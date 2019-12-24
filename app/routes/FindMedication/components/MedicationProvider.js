import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import jstz from 'jstz';

import PropTypes from 'prop-types';

import Modal from 'react-modal';

import ReportInaccuracyForm from '@common/components/ReportInaccuracyForm';
import HoursDay from '@routes/FindMedication/components/HoursDay';
import MedicationSupply from '@routes/FindMedication/components/MedicationSupply';
import Tooltip from '@common/components/Tooltip';
import '@routes/FindMedication/styles/MedicationProvider.scss';
import { sort as ramdaSort } from "ramda"

import { sendReportInaccuracy } from '@actions/providers';


class MedicationProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
    };

    this.onReportInaccuracyButtonClick = this.onReportInaccuracyButtonClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closePopup = this.closePopup.bind(this);

    Modal.setAppElement('body');
  }

  componentDidMount() {
    document.querySelector('.find-medication-view__search-content').scrollTop = 0; 
  }
  
  onReportInaccuracyButtonClick() {
    this.setState({
      showPopup: true,
    });
  }

  onFormSubmit(values) {
    this.props.sendReportInaccuracy(values)
      .then(() => {
        this.closePopup();
      });
  }

  closePopup() {
    this.setState({
      showPopup: false,
    });
  }

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
    const { provider, showResults } =  this.props;
    const properties = provider.properties;
    const { showPopup } = this.state;

    const tz = jstz.determine();
    const last_import_date = moment.utc(properties.lastImportDate).tz(tz.name());
    const TWENTY_FOUR_HOUR = 24 * 60 * 60 * 1000;
    let render_last_import_date;

    if( ((new Date) - last_import_date) < TWENTY_FOUR_HOUR ){
      render_last_import_date = <Moment fromNow>{properties.lastImportDate}</Moment>;
    }else{
      render_last_import_date = last_import_date.format("hh:mma z on dddd Do MMMM YYYY");
    }

    let delivery = <span> Residential Delivery Services: {properties.homeDelivery ? 'Yes' : 'No'}</span>;
    if (properties.homeDeliveryInfoUrl) {
      delivery += <a href={properties.homeDeliveryInfoUrl} target="_blank" rel="noopener noreferrer">(More Information)</a>;
    }

    let website;
    if (properties.website) {
      website = (
        <a className="medication-provider__about-link" href={properties.website} target="_blank" rel="noopener noreferrer">
          <i className="fas fa-external-link-alt" /> Website
        </a>
      );
    }

    let hours;
    if (properties.operatingHours) {
      // Strip whitespace proceeding commas
      properties.operatingHours = properties.operatingHours.replace(/,\s+/g, ',')

      // Replace colons not followed by a number with whitespace
      properties.operatingHours = properties.operatingHours.replace(/:(?!\d)/g, ' ')

      // Strip periods
      properties.operatingHours = properties.operatingHours.replace(/\./g,'')

      hours = (
        <div className="medication-provider__hours">
          <h3 className="medication-provider__hours-title">Pharmacy Hours</h3>
          {properties.operatingHours && properties.operatingHours.split(',').map((operatingHour, index) => (
            <HoursDay
              key={index.toString()}
              day={operatingHour.trim().split(' ')[0]}
              opening={operatingHour.trim().split(' ').slice(1).join(' ').split('-').join(' - ').replace('(AM)', 'AM').replace('(PM)', 'PM')}
            />
          ))}
        </div>);
    }

    return(
      <div className="medication-provider">
        <p className="medication-provider__link-back">
          <a onClick={showResults}><i className="fas fa-arrow-left" /> Return to search results</a>
        </p>
        <h2 className="medication-provider__name">
          {properties.name}
        </h2>
        <div className="medication-provider__supply">
          <div className="medication-provider__supply-header">
            <div className="medication-provider__supply-title">
              <h3>Medication Supply</h3>
            </div>
            <div className="medication-provider__supply-report" onClick={this.onReportInaccuracyButtonClick}>
              <a>Report an inaccuracy</a>
            </div>
          </div>
          <div className="medication-provider__supply-container">
            {properties.drugs && this.getMedicationDosages(properties.drugs).map(drug => (
              <MedicationSupply
                key={drug.id.toString()}
                name={drug.name}
                level={drug.supplyLevel.supply}
              />
            ))}
          </div>
          <p className="medication-provider__updated">
            Last updated: {render_last_import_date}
            {properties.last_import_date}
          </p>
          <div className="medication-provider__supply-info">
            How are these levels calculated?
            <Tooltip title="Supply Levels">
              These supply levels represent an estimate of how long a given store’s
              current supply of each medication is expected to last. These estimates
              are calculated at the pharmacy and reported to MedFinder, where:
              <ul>
                <li>High Supply represents +2 Day medication supply,</li>
                <li>Medium Supply represents 1-2 Day medication supply, and</li>
                <li>Low Supply represents &lt;1 Day medication supply</li>
              </ul>
            </Tooltip>
          </div>
        </div>
        <div className="medication-provider__about">
          <h3 className="medication-provider__about-title">About Pharmacy</h3>
          <p className="medication-provider__about-text">
            {properties.address.split(' ').map(part => `${part[0]}${part.toLowerCase().substring(1)}`).join(' ')}
          </p>
          <div className="medication-provider__about-text">
            <a className="medication-provider__about-link" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${properties.address.split(' ').join('+')}`}>
              <i className="fas fa-directions" /> Get Directions
            </a>
            <a className="medication-provider__about-link" href={`tel:${properties.phone}`}>
              <i className="fas fa-phone" />{properties.phone}
            </a>
            {website}
          </div>
          <div className="medication-provider__about-text">
            Accepts Insurance: {properties.insuranceAccepted ? 'Yes' : 'No'}
            <Tooltip title="Insurance">
             Please contact your insurance provider to verify your prescription drug coverage and medication cost. 
            </Tooltip>
          </div>
          <p className="medication-provider__about-text">
            { delivery }
          </p>
        </div>
        {hours}
        <Modal
          shouldCloseOnEsc
          isOpen={showPopup}
          overlayClassName="contact__modal-overlay"
          className="contact__modal-content"
          onRequestClose={this.closePopup}
        >
          <button
            type="button"
            className="contact__close-button"
            onClick={this.closePopup}
            >
            <i className="fas fa-times-circle" />
          </button>
          <ReportInaccuracyForm
            onSubmit={this.onFormSubmit}
            medications={properties.drugs}
            initialValues={{
              providerName: properties.name,
              providerAddress: properties.address,
              dateVisitedPharmacy: moment().format("YYYY-MM-DD"),
            }}
          />
        </Modal>
      </div>
    );
  };
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  sendReportInaccuracy,
}, dispatch);

MedicationProvider.propTypes = {
  provider: PropTypes.shape({
    geometry: PropTypes.shape({}),
    properties: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      address: PropTypes.string,
      phone: PropTypes.string,
      lastImportDate: PropTypes.string,
      website: PropTypes.string,
      email: PropTypes.string,
      active: PropTypes.bool,
      operatingHours: PropTypes.string,
      insuranceAccepted: PropTypes.bool,
      distance: PropTypes.number,
      storeNumber: PropTypes.number,
      drugs: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
  showResults: PropTypes.func.isRequired,
  sendReportInaccuracy: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MedicationProvider);
