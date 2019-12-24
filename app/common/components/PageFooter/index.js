import React from 'react';

import './styles.scss';

export default () => (
  <footer className="page-footer">
    <div className="page-footer__footer-copy">
      <div className="page-container">
        <div className="page-footer__copy-container">
          <p className="page-footer__copy">
            &copy; 2018 <a href="http://www.childrenshospital.org/" target="_blank">Boston Children's Hospital</a>. All rights reserved.
          </p>
          <p className="page-footer__byline">
            Website design by <a href="https://exygy.com/" target="_blank">Exygy</a>
          </p>
	{/* <p className="page-footer__language">
            Language: English
          </p>
       */} </div>
      </div>
    </div>
  </footer>
);
