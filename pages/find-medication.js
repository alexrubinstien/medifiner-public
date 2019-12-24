import React, { Component } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import PageFooter from '@common/components/PageFooter';
import FindMedicationView from '@routes/FindMedication/components/FindMedicationView';

import { fetchOptions } from '@actions/options';

class Page extends Component {
  static displayName = 'FindMedication'

  static async getInitialProps({
    query,
    store,
  }) {
    fetchOptions()(store.dispatch);

    return {
      searchType: query.search,
      showResults: query.showResults,
      showProvider: query.showProvider,
    };
  }

  render() {
    const {
      searchType,
      showResults,
      showProvider,
    } = this.props;

    return (
      <div>
        <Head>
          <title key="title">Find Medication - MedFinder</title>
        </Head>
        <FindMedicationView
          searchType={searchType}
          showResults={showResults}
          showProvider={showProvider}
        />
      </div>
    );
  }
}

Page.propTypes = {
  searchType: PropTypes.string,
  showResults: PropTypes.bool,
  showProvider: PropTypes.bool,
};

Page.defaultProps = {
  searchType: 'simple',
  showResults: false,
  showProvider: false,
};

export default Page;
