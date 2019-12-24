import React, { Component } from 'react';
import PropTypes from 'prop-types';

import About from '@common/components/About';
import PageFooter from '@common/components/PageFooter';
import PageHeader from '@common/components/PageHeader';

import ContactContainer from '@common/containers/Contact';
import AlertBanner from '@common/components/AlertBanner';
import { isMobile } from '@app/utils/helpers';
import throttle from 'lodash.throttle';
import './styles.scss';

class Layout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: typeof window !== 'undefined' ? window.innerWidth : 800,
    }

    this.throttledHandlechangeWindow = throttle(this.handleChangeWindow, 500);
  }

  componentDidMount() {
    window.addEventListener('resize', this.throttledHandlechangeWindow, false);    
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandlechangeWindow);
  }

  handleChangeWindow = () => {
    this.setState({ width: window.innerWidth });
  }


  render() {
  
    const { children, componentName} = this.props;
    const { width } = this.state;
    return (
      <div className="page-layout">
        {(width > 960) ? <PageHeader footer={false}/> : <PageHeader footer={true}/>}

        {children}
        {componentName !== 'FindMedication' && [
          <About key="about" />,
          <ContactContainer key="contact" />,
        ]}
        {(width > 960) && <PageFooter/>}
        <AlertBanner/>
        
      </div>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  componentName: PropTypes.string.isRequired,
};

export default Layout;
