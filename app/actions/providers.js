import axios from 'axios';

const PREFIX = '[Providers]';

export const FETCH_PROVIDERS_REQUEST = `${PREFIX} FETCH_PROVIDERS_REQUEST`;
export const FETCH_PROVIDERS_SUCCESS = `${PREFIX} FETCH_PROVIDERS_SUCCESS`;
export const FETCH_PROVIDERS_FAILURE = `${PREFIX} FETCH_PROVIDERS_FAILURE`;
export const ACTIVATE_PROVIDER = `${PREFIX} ACTIVATE_PROVIDER`;

const findProvidersRequest = params => ({
  type: FETCH_PROVIDERS_REQUEST,
  query: params,
});

const findProvidersSuccess = payload => ({
  type: FETCH_PROVIDERS_SUCCESS,
  payload,
});

const findProvidersFailure = () => ({
  type: FETCH_PROVIDERS_FAILURE,
});

export const saveRequest = params => dispatch => dispatch(findProvidersRequest(params));

export const clearMap = () => dispatch => dispatch(findProvidersSuccess([]))

export const findProviders = params => dispatch => axios
  .get('v1/public/find_providers/', { params })
  .then(response => response.data)
  .then((responseData) => {
    dispatch(findProvidersSuccess(responseData));
    dispatch({ type: '[Global] SHOW_RESULTS' });

    return responseData;
  })
  .catch((error) => {
    dispatch(findProvidersFailure());

    throw error;
  });

const sendActivateProvider = payload => ({
  type: ACTIVATE_PROVIDER,
  payload,
});

export const activateProvider = provider => (dispatch) => {
  dispatch(sendActivateProvider(provider));
};

export const SEND_REPORT_INACCURACY_REQUEST = `${PREFIX} SEND_REPORT_INACCURACY_REQUEST`;
export const SEND_REPORT_INACCURACY_SUCCESS = `${PREFIX} SEND_REPORT_INACCURACY_SUCCESS`;
export const SEND_REPORT_INACCURACY_FAILURE = `${PREFIX} SEND_REPORT_INACCURACY_FAILURE`;
const ROOT_URL='https://formcarry.com/s/'
const ID = 'c_-rjMD6Yen'

const sendReportInaccuracyRequest = () => ({
  type: SEND_REPORT_INACCURACY_REQUEST,
});

const sendReportInaccuracySuccess = payload => ({
  type: SEND_REPORT_INACCURACY_SUCCESS,
  payload,
});

const sendReportInaccuracyFailure = () => ({
  type: SEND_REPORT_INACCURACY_FAILURE,
});


export const sendReportInaccuracy = data => (dispatch) => {
  dispatch(sendReportInaccuracyRequest());

  return axios
    .post(`${ROOT_URL}${ID}`, data)
    .then(response => response)
    .then((responseData) => {
      dispatch(sendReportInaccuracySuccess(responseData));

      return responseData;
    })
    .catch((error) => {
      dispatch(sendReportInaccuracyFailure());

      throw error;
    });
};
