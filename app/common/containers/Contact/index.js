import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Modal from 'react-modal';

import Button from '@common/components/Button';
import PharmacyInterestForm from '@common/components/PharmacyInterestForm';

import { sendContactForm } from '@actions/global';

import './styles.scss';

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
    };

    this.onContactButtonClick = this.onContactButtonClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.closePopup = this.closePopup.bind(this);

    Modal.setAppElement('body');
  }

  onContactButtonClick() {
    this.setState({
      showPopup: true,
    });
  }

  onFormSubmit(values) {
    this.props.sendContactForm(values)
      .then(() => {
        this.closePopup();
      });
  }

  closePopup() {
    this.setState({
      showPopup: false,
    });
  }

  render() {
    const { showPopup } = this.state;

    return (
      <div className="contact">
        <div className="page-container">
          <div className="contact__row">
            <div className="contact__text-column">
              <p className="contact__text">
                If you are an interested pharmacy representative, we are happy to discuss how to get your pharmacy enrolled.
              </p>
            </div>
            <div className="contact__button-column">
              <Button
                secondary
                wide
                className="contact__button"
                onClick={this.onContactButtonClick}
              >
                Contact us today
              </Button>
            </div>
          </div>
        </div>
        <Modal
          shouldCloseOnEsc
          isOpen={showPopup}
          overlayClassName="contact__modal-overlay"
          className="contact__modal-content"
          onRequestClose={this.closePopup}
        >
          <button
            type="button"
            className="contact__close-button"
            onClick={this.closePopup}
            >
            <i className="fas fa-times-circle" />
          </button>
          <PharmacyInterestForm
            onSubmit={this.onFormSubmit}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
  sendContactForm,
}, dispatch);

Contact.propTypes = {
  sendContactForm: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Contact);
