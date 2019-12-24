import React from 'react';
import PropTypes from 'prop-types';

import '@routes/FindMedication/styles/MedicationProvider.scss';

const HoursDay = ({
  day,
  opening,
}) => (
  <div className="medication-provider__hours-day">
    <div className="medication-provider__hours-day-name">
      { day }
    </div>
    <div className="medication-provider__hours-day-hours">
      { opening }
    </div>
  </div>
);

HoursDay.propTypes = {
  day: PropTypes.string.isRequired,
  opening: PropTypes.string.isRequired,
};

export default HoursDay;
