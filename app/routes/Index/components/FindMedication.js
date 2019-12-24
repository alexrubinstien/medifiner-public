import React, { Component } from 'react';
import Link from 'next/link';

import '@routes/Index/styles/FindMedication.scss';

export default class FindMedication extends Component {
  getRandomBackground() {
    return `find-medication__background--${Math.floor(Math.random() * 3) + 1}`;
  }

  render() {
    return (
      <div
        id="find-medication"
        className="find-medication"
      >
        <div className={`find-medication__background ${this.getRandomBackground()}`} />
        <div className="page-container page-container--relative find-medication__container">
          <div className="find-medication__content">
            <p className="find-medication__title">
              Find the Right Medication Near You
            </p>
            <p className="find-medication__disclaimer">
              Are you trying to fill your flu prescription?
            </p>
            <p className="find-medication__button-container">
              <Link href="/find-medication">
                <a className="button button--wide find-medication__button">
                  Yes, find medication 
                </a>
              </Link>
            </p>
		{/*<p className="find-medication__button-container">
              <Link href="/find-medication?search=advanced">
                <a className="button button--secondary button--wide find-medication__button">
                  Yes, I have multiple prescriptions
                </a>
              </Link>
            </p>*/}
            <p className="find-medication__external-link-container">
              <a
                href="http://vaccinefinder.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                No, I&apos;m looking for a vaccine
                <i className="fas fa-arrow-right find-medication__external-link-icon" />
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
