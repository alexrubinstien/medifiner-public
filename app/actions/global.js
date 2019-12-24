import axios from 'axios';

const PREFIX = '[Global]';

export const FETCH_BASIC_INFO_REQUEST = `${PREFIX} FETCH_BASIC_INFO_REQUEST`;
export const FETCH_BASIC_INFO_SUCCESS = `${PREFIX} FETCH_BASIC_INFO_SUCCESS`;
export const FETCH_BASIC_INFO_FAILURE = `${PREFIX} FETCH_BASIC_INFO_FAILURE`;

const fetchBasicInfoRequest = () => ({
  type: FETCH_BASIC_INFO_REQUEST,
});

const fetchBasicInfoSuccess = payload => ({
  type: FETCH_BASIC_INFO_SUCCESS,
  payload,
});

const fetchBasicInfoFailure = () => ({
  type: FETCH_BASIC_INFO_FAILURE,
});

export const fetchBasicInfo = () => (dispatch) => {
  dispatch(fetchBasicInfoRequest());

  return axios
    .get('v1/public/basic_info/')   
    .then(responseData => {
      dispatch(fetchBasicInfoSuccess(responseData.data));
      return responseData;
    })
    .catch((error) => {
      dispatch(fetchBasicInfoFailure());
      console.log(error);
      
    });
};

export const SEND_CONTACT_FORM_REQUEST = `${PREFIX} SEND_CONTACT_FORM_REQUEST`;
export const SEND_CONTACT_FORM_SUCCESS = `${PREFIX} SEND_CONTACT_FORM_SUCCESS`;
export const SEND_CONTACT_FORM_FAILURE = `${PREFIX} SEND_CONTACT_FORM_FAILURE`;

const sendContactFormRequest = () => ({
  type: SEND_CONTACT_FORM_REQUEST,
});

const sendContactFormSuccess = payload => ({
  type: SEND_CONTACT_FORM_SUCCESS,
  payload,
});

const sendContactFormFailure = () => dispatch => ({
  type: SEND_CONTACT_FORM_FAILURE,
});

export const sendContactForm = data => (dispatch) => {
  dispatch(sendContactFormRequest());

  return axios
    .post('v1/public/contact_form/', data)
    .then(response => response.data)
    .then((responseData) => {
      dispatch(sendContactFormSuccess(responseData));

      return responseData;
    })
    .catch((error) => {
      dispatch(sendContactFormFailure());

      throw error;
    });
};

export const FETCH_ALERT_BANNER_INFO_REQUEST = `${PREFIX} FETCH_ALERT_BANNER_INFO_REQUEST`;
export const FETCH_ALERT_BANNER_INFO_SUCCESS = `${PREFIX} FETCH_ALERT_BANNER_INFO_SUCCESS`;
export const FETCH_ALERT_BANNER_INFO_FAILURE = `${PREFIX} FETCH_ALERT_BANNER_INFO_FAILURE`;

const fetchAlertBannerInfoRequest = () => ({
  type: FETCH_ALERT_BANNER_INFO_REQUEST
});

const fetchAlertBannerFailure = () => ({
    type: FETCH_ALERT_BANNER_INFO_FAILURE  
});

const fetchAlertBannerSuccess = payload => ({
  type: FETCH_ALERT_BANNER_INFO_SUCCESS,
  payload
});

export const fetchAlertBannerInfo = dispatch => {
  dispatch(fetchAlertBannerInfoRequest());
  return axios
  .get('v1/epidemic')
  .then(responseData => {
    dispatch(fetchAlertBannerSuccess(responseData.data)); 
  })
  .catch((error) => {
    dispatch(fetchAlertBannerFailure());
  });
}



export const SHOW_MAP = `${PREFIX} SHOW_MAP`;
export const SHOW_SEARCH = `${PREFIX} SHOW_SEARCH`;
export const SHOW_RESULTS = `${PREFIX} SHOW_RESULTS`;
export const SHOW_PROVIDER = `${PREFIX} SHOW_PROVIDER`;
export const UPDATE_FORM = `${PREFIX} UPDATE_FORM`;
export const SHOW_MOBILE_MAP = `${PREFIX} SHOW_MOBILE_MAP`;
export const SORT_ORDER = `${PREFIX} SORT_ORDER`;


export const updateForm = payload => ({
  type: UPDATE_FORM,
  payload,
});

export const showSearch = () => ({
  type: SHOW_SEARCH,
});

export const sortResult = payload => ({
  type: SORT_ORDER,
  payload,
});

export const showResults = () => ({
  type: SHOW_RESULTS,
});

export const showMobileMap = payload => ({
  type: SHOW_MOBILE_MAP,
  payload,
});

const sendShowProvider = payload => ({
  type: SHOW_PROVIDER,
  payload,
});

export const showProvider = provider => (dispatch) => {
  dispatch(sendShowProvider(provider));
};
