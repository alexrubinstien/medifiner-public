import React, { Component } from 'react';

import debounce from 'lodash.debounce';

import FaqBox from '@routes/FAQ/components/FaqBox';

import InfoSVG from '../../../../static/images/faq/info.svg';
import FAQSVG from '../../../../static/images/faq/faq.svg';
import WhereSVG from '../../../../static/images/faq/where.svg';

import '@routes/FAQ/styles/FAQ.scss';

export default class FAQ extends Component {
  constructor(props) {
    super(props);

    this.state = {
      boxHeight: 'auto',
    };

    this.onPageResize = debounce(this.onPageResize.bind(this), 250);
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.boxes = document.querySelectorAll('.faq__box');
      this.calculateBoxHeight();

      window.addEventListener('resize', this.onPageResize);
    }
  }

  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onPageResize);
    }
  }

  onPageResize() {
    this.setState({
      boxHeight: 'auto',
    }, () => {
      this.calculateBoxHeight();
    });
  }

  calculateBoxHeight() {
    let maxHeight = 0;
    [].forEach.call(this.boxes, (box) => {
      maxHeight = Math.max(maxHeight, box.getBoundingClientRect().height);
    });

    if (window.innerWidth > 959) {
      this.setState({
        boxHeight: maxHeight,
      });
    }
  }

  render() {
    const { boxHeight } = this.state;

    return (
      <div className="faq">
        <div className="page-container">
          <h2 className="faq__title">
            Frequently Asked Questions
          </h2>
          <div className="faq__boxes">
            <div
              className="faq__box"
              style={{ height: boxHeight }}
            >
              <FaqBox
                url="https://www.cdc.gov/flu/antivirals/whatyoushould.htm"
                icon={<InfoSVG />}
                title="What Are Antiviral Drugs?"
                text="Antiviral drugs are prescription medicines that fight against the flu virus in your body. They appear in different forms (e.g., pills, liquids, powders) and are different from antibiotics, which fight against bacterial infections."
                linkText="Learn More"
              />
            </div>
            <div
              className="faq__box"
              style={{ height: boxHeight }}
            >
              <FaqBox
                url="https://www.cdc.gov/flu/about/index.html"
                icon={<FAQSVG />}
                title="What is the Flu?"
                text="Influenza (flu) is a contagious respiratory illness caused by influenza viruses and can cause mild to severe illness. While a flu vaccine is the first and best way to prevent seasonal flu, if you get sick, antiviral drugs can be used to treat flu illness."
                linkText="Learn More"
              />
            </div>
            <div
              className="faq__box"
              style={{ height: boxHeight }}
            >
              <FaqBox
                url="http://vaccinefinder.org"
                icon={<WhereSVG />}
                title="Where Can I Find Vaccines?"
                text="An annual seasonal flu vaccine is the best
 way to reduce your risk of getting sick with seasonal flu and spreading it to others. Flu vaccines cause antibodies to develop in the body about two weeks after vaccination. These antibodies provide protection against infection with the viruses that are in
 the vaccine."
                linkText="Find Vaccines"
              />
            </div>
          </div>
          <h3 className="faq__subtitle">
            Other Frequently Asked Questions
          </h3>
          <div className="faq__answers">
            <div className="faq__answers-column">
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/takingcare.htm#whatshould"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  What should I do if I get sick?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/children/antiviral.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  Can children take antiviral drugs?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/antivirals/whatyoushould.htm#who-should-take"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  Who should take antiviral drugs?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/consumer/symptoms.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  How do I know if I have the flu?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
            </div>
            <div className="faq__answers-column">
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/about/qa/coldflu.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  What is the difference between a cold and the flu?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/takingcare.htm#whatare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  What are the emergency warning signs of flu sickness?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/antivirals/whatyoushould.htm#benefits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  What are the benefits of antiviral drugs?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
              <div className="faq__answer">
                <a
                  href="https://www.cdc.gov/flu/about/qa/antiviralresistance.htm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="faq__answer-link"
                >
                  What is antiviral resistance?
                  <i className="fas fa-arrow-right faq__answer-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
