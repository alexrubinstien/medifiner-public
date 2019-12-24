import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import Mapbox from 'mapbox.js';

import Input from '@common/components/Input';

import env from '@app/utils/env';

import './Geocoder.scss';

Mapbox.mapbox.accessToken = env.MAPBOX_KEY;

export default class Geocoder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressText: props.input.value ? props.input.value.name : '',
      geoResults: [],
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);
    this.geocoderResults = this.geocoderResults.bind(this);
  }

  componentDidMount() {
    this.geocoder = Mapbox.mapbox.geocoder('mapbox.places');
  }
 
  componentWillReceiveProps(nextProps) {   
    if(this.props.input !== nextProps.input.value) {
      if (nextProps.input.value === "") {
        this.setState({addressText:""});
      }
    }   
  }

  onInputChange(e) {
    const inputText = e.target.value;
    this.setState({
      addressText: inputText,
    }, () => {
      this.geocoder.query({
        country: 'us',
        query: inputText,
      }, this.geocoderResults);
    });
  }

  onInputBlur() {
    var that = this

    setTimeout(()=> {
      if (that.props.input.value) {
        return;
      }

      let result;

      that.setState((prevState) => {
        let addressText = '';
        if (prevState.geoResults.length) {
          [result] = prevState.geoResults;
          addressText = result.place_name;
        }

        return {
          addressText,
          geoResults: [],
        };
      }, () => {
        let geoValue = '';
        if (result) {
          geoValue = {
            name: result.place_name,
            coordinates: [
              result.center[1],
              result.center[0],
            ],
          };
        }

        that.props.input.onChange(geoValue);
      });
    }, 1000)
  }

  onResultClick(result) {
    this.setState({
      addressText: result.place_name,
      geoResults: [],
    }, () => {
      this.props.input.onChange({
        name: result.place_name,
        coordinates: [
          result.center[1],
          result.center[0],
        ],
      });
    });
  }

  geocoderResults(error, data) {
    if (error) {
      this.setState({
        geoResults: [],
      }, () => {
        this.props.input.onChange('');
      });

      return;
    }

    this.setState({
      geoResults: data.results.features,
    });
  }

  render() {
    const {
      hasIcon,
      iconClassName,
      input,
      label,
      meta,
      placeholder,
    } = this.props;
    const {
      addressText,
      geoResults,
    } = this.state;

    return (
      <div className="geocoder">
        <div className="field">
          <Input
            wide
            id={input.name}
            autoComplete="nope"
            label={label}
            value={addressText}
            inputClassName={classNames('field__input', { 'field__input--error': (meta.touched && meta.error) })}
            hasIcon={hasIcon}
            iconClassName={iconClassName}
            onChange={this.onInputChange}
            onBlur={this.onInputBlur}
            placeholder={placeholder}
          />
          {(meta.touched && meta.error) && (
            <div className="field__error">
              {meta.error}
            </div>
          )}
        </div>
        {geoResults.length > 0 && (
          <ul className="geocoder__list">
            {geoResults.map(result => (
              <li
                key={result.id}
                className="geocoder__list-item"
              >
                <button
                  type="button"
                  className="geocoder__item"
                  onClick={() => this.onResultClick(result)}
                >
                  {result.place_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

Geocoder.propTypes = {
  hasIcon: PropTypes.bool,
  iconClassName: (props, propName, componentName) => {
    if (props.hasIcon === true && props[propName] === null) {
      return new Error(`The prop \`${propName}\` is marked as required in \`${componentName}\`.`);
    }
    if (props.hasIcon === true && (props[propName] == undefined || typeof props[propName] !== 'string')) {
      return new Error(`Invalid prop \`${propName}\` of type \`${typeof props[propName]}\` supplied to \`${componentName}\`, expected \`string\`.`);
    }
  },
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        name: PropTypes.string,
      }),
    ]),
  }).isRequired,
  label: PropTypes.string,
  meta: PropTypes.shape({
    error: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    touched: PropTypes.bool,
  }).isRequired,
  placeholder: PropTypes.string,
};

Geocoder.defaultProps = {
  hasIcon: false,
  iconClassName: null,
  label: null,
  placeholder: null,
};
