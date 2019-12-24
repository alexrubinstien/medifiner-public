import React from 'react';

import './styles.scss';

export default () => (
  <div
    id="about"
    className="about"
  >
    <div className="page-container">
      <div className="about__container">
        <div className="about__content">
          <p className="about__title">
            About MedFinder
          </p>
          <p className="about__disclaimer">
            Our goal is to make it simple for users to find available flu medication.
          </p>
          <p className="about__text">
            MedFinder is a free, online service where you can search for pharmacy locations that offer the medication you need. We work with partners such as government agencies, public health officials, and pharmacies to provide accurate and up-to-date information about the availability of medication near you.
          </p>
          <p className="about__text">
            Currently, MedFinder is focused on flu medication.
          </p>
          <div className="about__images">
            <div className="about__images-row">
              <figure className="about__image-container">
                <img
                  src="/static/images/bhc-logo.svg"
                  alt="Boston Children's Hospital"
                  className="about__image"
                  width="153"
                  height="80"
                />
              </figure>
              <figure className="about__image-container about__image-container--hm">
                <img
                  src="/static/images/hm-logo.svg"
                  alt="Health Map"
                  className="about__image about__image--hm"
                  width="242"
                  height="37"
                />
              </figure>
              <figure className="about__image-container">
                <img
                  src="/static/images/cdc-logo.svg"
                  alt="CDC"
                  className="about__image"
                  width="105"
                  height="80"
                />
              </figure>
              <figure className="about__image-container about__image-container--harvard">
                <img
                  src="/static/images/harvard-logo.svg"
                  alt="Harvard Medical School"
                  className="about__image about__image--harvard"
                  width="204"
                  height="51"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
