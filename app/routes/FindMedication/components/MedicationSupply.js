import React from 'react';
import PropTypes from 'prop-types';

import '@routes/FindMedication/styles/MedicationProvider.scss';
import '@routes/FindMedication/styles/SearchResult.scss';

const MedicationSupply = ({
  name,
  level,
  medicationName,
}) => (
  <div className="medication-provider__supply-drug">
    <div className="medication-provider__supply-drug-name">
      <span>
        { name }
      </span>
    </div>
    <div className="medication-provider__supply-drug-supply">
      <div className="search-result__supply">
        <div className="search-result__supply-graphic">
          <div className={`search-result__supply-square search-result__supply-square--${level}`} />
        </div>
        <p className="search-result__supply-text">
          { level != 'nosupply' ? level : 'No' } supply
        </p>
      </div>
    </div>
  </div>
);

MedicationSupply.propTypes = {
  name: PropTypes.string.isRequired,
  level: PropTypes.string,
};

export default MedicationSupply;
