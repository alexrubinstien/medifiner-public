import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchAlertBannerInfo } from "@actions/global";
import globalSelectors from '@selectors/global';
import { Parser } from 'html-to-react';
import throttle from 'lodash.throttle';
import ReadMore from "./ReadMore";
import Icon from "./Icon";
import './styles.scss';

class AlertBanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: typeof window !== 'undefined' ? window.innerWidth : 800,
      showFullContent: false
    }

    this.parser = new Parser();
    this.throttledHandlechangeWindow = throttle(this.handleChangeWindow, 500);
  }

  componentDidMount() {
    const { fetchAlertBannerInfo } = this.props;
    window.addEventListener('resize', this.throttledHandlechangeWindow, false);
    fetchAlertBannerInfo();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledHandlechangeWindow);
  }

  handleChangeWindow = () => {
    this.setState({ width: window.innerWidth });
  }

  handleClickReadMore = () => {
    this.setState({showFullContent: !this.state.showFullContent});
  }

  htmlSubstring = (s, n) => {
    var m, r = /<([^>\s]*)[^>]*>/g,
        stack = [],
        lasti = 0,
        result = '';

    //for each tag, while we don't have enough characters
    while ((m = r.exec(s)) && n) {
        //get the text substring between the last tag and this one
        var temp = s.substring(lasti, m.index).substr(0, n);
        //append to the result and count the number of characters added
        result += temp;
        n -= temp.length;
        lasti = r.lastIndex;

        if (n) {
            result += m[0];
            if (m[1].indexOf('/') === 0) {
                //if this is a closing tag, than pop the stack (does not account for bad html)
                stack.pop();
            } else if (m[1].lastIndexOf('/') !== m[1].length - 1) {
                //if this is not a self closing tag than push it in the stack
                stack.push(m[1]);
            }
        }
    }

    //add the remainder of the string, if needed (there are no more tags in here)
    result += s.substr(lasti, n);

    //fix the unclosed tags
    while (stack.length) {
        result += '</' + stack.pop() + '>';
    }

    return result;

}

  render() {    
    const { width } = this.state;
    const { alertBannerStatus, alertBannerContent } = this.props;
    if (!alertBannerStatus) {
      return "";
    }
    let parsedString = '';
    let readMore = '';
    let bannerIcon="";
    try {
      parsedString = this.parser.parse(alertBannerContent)
    } catch (e) {
      parsedString = '';
    }
    bannerIcon = Icon(this.state.showFullContent, this.handleClickReadMore)
    if (width <= 960) {
      let shortString = this.htmlSubstring(alertBannerContent,85)
      parsedString = this.parser.parse(shortString);
      if (shortString.length < alertBannerContent.length) {
        readMore=ReadMore(this.state.showFullContent, this.handleClickReadMore);
        if (this.state.showFullContent) {
          parsedString = parsedString = this.parser.parse(alertBannerContent);
        }
      }

    }

    return (
      <div className="alert-banner-view">
       {bannerIcon}
       {parsedString}
       {readMore}
      </div>
    );
  }
}

AlertBanner.propTypes = {
  alertBannerContent: PropTypes.string.isRequired,
  alertBannerStatus: PropTypes.bool.isRequired,
  fetchAlertBannerInfo: PropTypes.func.isRequired

}

const mapStateToProps = state => ({
  alertBannerContent: globalSelectors.getAlertBannerContent(state),
  alertBannerStatus: globalSelectors.getAlertBannerStatus(state)
})

const mapDispatchToProps = dispatch => ({
  fetchAlertBannerInfo: () => fetchAlertBannerInfo(dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AlertBanner);