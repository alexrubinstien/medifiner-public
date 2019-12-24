import React, { Component } from 'react';
import Link from 'next/link';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Field,
  formValueSelector,
  reduxForm,
  change as changeFieldValue,
} from 'redux-form';
import Select from '@common/components/ReduxFields/Select';

import globalSelectors from '@selectors/global';
import { bindActionCreators } from 'redux';
import _ from "lodash";
import {
  sortResult
} from '@actions/global';


import '@routes/FindMedication/styles/SearchResults.scss';
import '@common/components/ReduxFields/styles.scss';

const options = [
  { value: 'distance', label: 'Distance' },
  { value: 'supply', label: 'Supply Level' },
  { value: 'relevance', label: 'Relevance' }
];

class SearchParams extends Component {

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(sortOrder) {
    // not sure why this is coming back as an object of characters in the first place
    let sort = _.values(sortOrder);
    sort.pop();
    this.props.sortResult(sort.join(""));
  }

  render() {
    const {
      params,
      sortOrder,
    } = this.props;

    const initialValues = {
      value: sortOrder
    }

    return (
      <div className="search-results__disclaimer">
        <div className="result-text">
          Showing Results for
          <strong> {params.name}</strong>,
          near <strong>{params.location} </strong>
          within <strong>{params.distance} miles</strong>
		<div className="disclaimer">Supply quantities are reported daily and subject to change. We recommend calling ahead to your local pharmacy to confirm.</div>
         </div>
         <form className="search-results__sorter">
           <div className="search-form__field-container--wide">
            <Field
              component={Select}
              initialValues={initialValues}
              label="Sort By"
              name="sort"
              onChange={this.handleChange}
              options={options}
            />
           </div>
         </form>
      </div>);
  }
}

const mapStateToProps = state => ({
  sortOrder: globalSelectors.getSortOrder(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  sortResult
}, dispatch);


SearchParams.propTypes = {
  params: PropTypes.shape({
    name: PropTypes.string,
    distance: PropTypes.number,
    location: PropTypes.string,
  }).isRequired,
  sortOrder: PropTypes.string.isRequired,
  sortResult: PropTypes.func.isRequired,
};

let Search = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchParams);

export default reduxForm({
  destroyOnUnMount: true,
  form: 'SearchParams',
})(Search);
