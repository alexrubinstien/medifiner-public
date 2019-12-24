import React, { Component } from 'react';

import classNames from 'classnames';

import Button from '@common/components/Button';
import Navigation from '@common/components/Navigation';
import Footer from "@common/components/PageFooter";
import './styles.scss';

export default class PageHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
      scrollingTo: null,
    };

    this.openMobileMenu = this.openMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.onToggleClick = this.onToggleClick.bind(this);
    this.onWindowScroll = this.onWindowScroll.bind(this);

    this.bodyScroll = 0;
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onWindowScroll);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onWindowScroll);
    }
  }

  onToggleClick() {
    const { isMenuOpen } = this.state;

    if (isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  onWindowScroll() {
    const {
      isMenuOpen,
      scrollingTo,
    } = this.state;
    const bodyScroll = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop
      || 0;

    if (bodyScroll > 60 && !isMenuOpen) {
      if ((bodyScroll > this.bodyScroll) && (scrollingTo !== 'down')) {
        this.setState({
          scrollingTo: 'down',
        });
      } else if ((bodyScroll < this.bodyScroll) && (scrollingTo === 'down')) {
        this.setState({
          scrollingTo: 'top',
        });
      }
    }

    this.bodyScroll = bodyScroll;
  }

  openMobileMenu() {
    this.setState({
      isMenuOpen: true,
      scrollingTo: null,
    });
  }

  closeMobileMenu() {
    this.setState({
      isMenuOpen: false,
      scrollingTo: null,
    });
  }

  render() {
    const {
      isMenuOpen,
      scrollingTo,
    } = this.state;
    const { footer } = this.props;
    return (
      <header className={classNames('page-header', { 'page-header--hidden': scrollingTo === 'down' })}>
        <div className="page-container">
          <div className="page-header__row">
            <div className="page-header__column page-header__column--logo">
              <a href="/">
                <h1 className="page-header__logo">
                  Med<span className="page-header__logo-color">Finder</span>
                </h1>
              </a>
            </div>
            <div className="page-header__menu-toggle-container">
              <button
                type="button"
                className="page-header__menu-toggle"
                onClick={this.onToggleClick}
              >
                <i
                  className={classNames('fas', {
                    'fa-bars': !isMenuOpen,
                    'fa-times': isMenuOpen,
                  })}
                />
              </button>
            </div>
            <div className={classNames('page-header__column', 'page-header__column--navigation', { 'page-header__column--navigation-open': isMenuOpen })}>
              <Navigation
                toggleMenu={this.onToggleClick}
                items={[{
                  href: '/',
                  text: 'Home'
                }, {
                  href: '/find-medication',
                  text: 'Find Medication'
                }, {
                  href: '/faq',
                  text: 'FAQ'
                }]}
                isMenuOpen={isMenuOpen && footer}
              />
            </div>
            <div className="page-header__column page-header__column--right page-header__column--external-link">
              <div className="page-header__external-link-container">
                <Button
                  isLink
                  secondary
                  href="http://vaccinefinder.org"
                >
                  Visit VaccineFinder
                  <i className="fas fa-arrow-right page-header__external-link-icon" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
