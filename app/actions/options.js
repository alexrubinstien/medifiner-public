import axios from 'axios';

const PREFIX = '[Options]';

export const FETCH_OPTIONS_REQUEST = `${PREFIX} FETCH_OPTIONS_REQUEST`;
export const FETCH_OPTIONS_SUCCESS = `${PREFIX} FETCH_OPTIONS_SUCCESS`;
export const FETCH_OPTIONS_FAILURE = `${PREFIX} FETCH_OPTIONS_FAILURE`;

const fetchOptionsRequest = () => ({
  type: FETCH_OPTIONS_REQUEST,
});

const fetchOptionsSuccess = payload => ({
  type: FETCH_OPTIONS_SUCCESS,
  payload,
});

const fetchOptionsFailure = () => ({
  type: FETCH_OPTIONS_FAILURE,
});

export const fetchOptions = () => (dispatch) => {
  dispatch(fetchOptionsRequest());

  return axios
    .get('v1/public/options/')
    .then(response => response.data)
    .then((responseData) => {
      dispatch(fetchOptionsSuccess(responseData));

      return responseData;
    })
    .catch((error) => {
      dispatch(fetchOptionsFailure());

      throw error;
    });
};
