import App, { Container } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import PropTypes from 'prop-types';

import Layout from '@common/components/Layout';

import configureRequests from '@app/utils/request';
import configureStore from '@app/store';

import { fetchBasicInfo } from '@actions/global';

import '@common/styles/normalize.scss';
import '@common/styles/base.scss';

class MyApp extends App {
  // Override for IE10 `withRouter`
  // https://github.com/zeit/next.js/issues/4687#issuecomment-401985901
  static childContextTypes = { router: PropTypes.object };

  getChildContext() {
    const { router } = this.props;
    return { router };
  }

  static async getInitialProps({
    Component,
    ctx,
  }) {
    const {
      isServer,
      store,
    } = ctx;

    configureRequests(null, isServer);

    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    fetchBasicInfo()(store.dispatch);

    return { pageProps };
  }

  componentWillMount() {
    configureRequests();
  }

  render() {
    const {
      Component,
      pageProps,
      store,
    } = this.props;

    return (
      <Container>
        <Head>
          <title key="title">MedFinder</title>
        </Head>
        <Provider store={store}>
          <Layout componentName={Component.displayName}>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </Container>
    );
  }
}

export default withRedux(configureStore)(MyApp);
