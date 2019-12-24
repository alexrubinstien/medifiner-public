import React from 'react';
import { withRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import Footer from '@common/components/PageFooter';
import AlerteBanner from '@common/components/AlertBanner';
import './styles.scss';

const Navigation = ({
  toggleMenu,
  items,
  isMenuOpen,
  router,
}) => (
  <div className="navigation">
    <ul className="navigation__list">
      {items.map(item => (
        <li
          key={item.href}
          className="navigation__item"
          onClick={toggleMenu}
        >
          <NextLink href={item.href}>
            <a className={classNames('navigation__link', { 'navigation__link--active': router.pathname === item.href })}>
              {item.text}
            </a>
          </NextLink>
        </li>
      ))}
      {isMenuOpen && (
      <li className=" navigation__item page_footer ">
        <div >
          <p>
            &copy; 2018 <a href="http://www.childrenshospital.org/" target="_blank">Boston Children's Hospital</a>. All rights reserved.
          </p>
          <p>
            Website design by <a href="https://exygy.com/" target="_blank">Exygy</a>
          </p>
         </div>
      </li>
      )}
    </ul>
  </div> 
);

Navigation.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  })).isRequired,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(Navigation);
