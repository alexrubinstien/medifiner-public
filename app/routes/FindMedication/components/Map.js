import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import ReactMapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import WebMercatorViewport from 'viewport-mercator-project';
import MapPopup from '@routes/FindMedication/components/MapPopup';

import env from '@app/utils/env';
import _ from 'lodash';
import '@routes/FindMedication/styles/Map.scss';

export default class MapComponent extends Component {
  constructor(props) {
    super(props);
    const { features } = this.props;
    if (features) {
      const coordinates = features[0].geometry.coordinates;
      this.state = {
        viewport: {
          latitude: coordinates[1],
          longitude: coordinates[0],
          zoom: 10,
          bearing: 0,
          pitch: 0,
        },
        popupInfo: null,
        activePoint: null,
      };
    } else {
      this.state = {
        viewport: {
          latitude: 38.850033,
          longitude: -95.6500523,
          zoom: 3,
          bearing: 0,
          pitch: 0,
        },
        popupInfo: null,
        activePoint: null,
      };
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();

  }

  componentDidUpdate(prevProps) {
    if (prevProps.features !== this.props.features) {
      this.fitToBounds();
      this.setState({activePoint:null});
    }
    if (prevProps.activeProvider !== this.props.activeProvider) {
      if(this.props.activeProvider) {
        this.showPopUp(this.props.activeProvider);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    this.setState(prevState => ({
      viewport: {
        ...prevState.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
    }));
  };

  fitToBounds = () => {
    const { features } = this.props;
    if (features && features.length) {
      const lngs = _.map(features, feature => feature.geometry.coordinates[0]);
      const lats = _.map(features, feature => feature.geometry.coordinates[1]);
      const { longitude, latitude, zoom } = new WebMercatorViewport(this.state.viewport)
        .fitBounds([[_.min(lngs), _.min(lats)], [_.max(lngs), _.max(lats)]], {
          padding: 20,
          offset: [0, -100],
        });
      this.setState(prevState => ({
        viewport: {
          ...prevState.viewport,
          longitude,
          latitude,
          zoom,
        },
      }));
    }
  };

  _onViewportChange = viewport => this.setState({
    viewport: {...this.state.viewport, ...viewport}
  });

  _goToViewport = (longitude, latitude) => {
    this._onViewportChange({
      longitude,
      latitude,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 300
    });
  };

  showPopUp = (marker) => {
    this.setState({
      activePoint: marker
    })
    this._goToViewport(marker.geometry.coordinates[0], marker.geometry.coordinates[1]);
  };

  renderProvider = (provider, index, text) => {
    const { activeProvider } = this.props;
    let providerId = -1;
    if (activeProvider) {
      providerId = activeProvider.properties.id;
    }
    return (
      <Marker
        key={`marker-${index}`}
        longitude={provider.geometry.coordinates[0]}
        latitude={provider.geometry.coordinates[1]}
        className={classNames('map__icon_container', { 'map__icon_container--active': provider.properties.active })}
      >
        <div
          className={classNames('map__icon', { 'map__icon--no-data': !provider.properties.active }, { 'map__icon--active': provider.properties.id === providerId })}
          onClick={() => this.showPopUp(provider)}
        >
          {text}
        </div>
      </Marker>
    );
  };

  renderPopup() {
    const { showProvider } = this.props;
    const { activePoint } = this.state;

    return activePoint && (
      <Popup
        tipSize={20}
        anchor="top"
        offsetLeft={14}
        offsetTop={30}
        coordinates={[activePoint.geometry.coordinates[0], activePoint.geometry.coordinates[1]]}
        longitude={activePoint.geometry.coordinates[0]}
        latitude={activePoint.geometry.coordinates[1]}
        onClose={() => this.setState({ activePoint: null, viewport: {...this.state.viewport} })}
      >
        <MapPopup provider={activePoint} showProvider={showProvider} />
      </Popup>
    );
  }

  render() {
    const {
      viewport,
    } = this.state;
    const {
      features,
    } = this.props;

    let markers = [];
    if (features) {
      let activeCount = 0;
      markers = _.map(features, (feature, index) => {
        if (feature.properties.active) {
          activeCount += 1;
          return this.renderProvider(feature, index, activeCount);
        }
        return this.renderProvider(feature, index);
      });
    }
    return (
      <div className="map" style={{ width: '100%', height: '100%' }}>
        <ReactMapGL
          {...viewport}
          width={this.props.containerWidth}
          height={this.props.containerHeight}
          mapboxApiAccessToken={env.MAPBOX_KEY}
          onViewportChange={this._onViewportChange}
          onClick={() =>
            this.setState({activePoint: null, viewport: {...this.state.viewport}})
          }
        >
          { markers }
          { this.renderPopup() }
        </ReactMapGL>
      </div>
    );
  }
}

MapComponent.propTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
      type: PropTypes.string,
    }),
    properties: PropTypes.shape({
      number: PropTypes.number,
      activated: PropTypes.bool,
    }),
    type: PropTypes.string,
  })),
  activeProvider: PropTypes.shape({
    geometry: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
      type: PropTypes.string,
    }),
    properties: PropTypes.shape({
      number: PropTypes.number,
      activated: PropTypes.bool,
    }),
    type: PropTypes.string,
  }),
  showProvider: PropTypes.func.isRequired,
};
