import React from 'react';
import PropTypes from 'prop-types';

import '@routes/FAQ/styles/FaqBox.scss';

const FaqBox = ({
  icon,
  linkText,
  text,
  title,
  url,
}) => (
  <a
    className="faq-box"
    href={url}
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="faq-box__title">
      {icon}
      <p className="faq-box__title-text">
        {title}
      </p>
    </div>
    <p className="faq-box__text">
      {text}
    </p>
    <p className="faq-box__more">
      {linkText}
      <i className="fas fa-arrow-right faq-box__more-icon" />
    </p>
  </a>
);

FaqBox.propTypes = {
  icon: PropTypes.node.isRequired,
  linkText: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default FaqBox;
