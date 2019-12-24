import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import '@routes/FindMedication/styles/ListMapSwitch.scss';

const ListMapSwitch = ({
  onChangeView,
  view,
}) => (
  <div className="list-map-switch">
    <button
      type="button"
      className={classNames('list-map-switch__button', { 'list-map-switch__button--active': view === 'list' })}
      onClick={() => onChangeView('list')}
    >
      List
    </button>
    <button
      type="button"
      className={classNames('list-map-switch__button', { 'list-map-switch__button--active': view === 'map' })}
      onClick={() => onChangeView('map')}
    >
      Map
    </button>
  </div>
);

ListMapSwitch.propTypes = {
  onChangeView: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
};

export default ListMapSwitch;
