import {
  FETCH_OPTIONS_FAILURE,
  FETCH_OPTIONS_REQUEST,
  FETCH_OPTIONS_SUCCESS,
} from '@actions/options';

const initialState = {
  list: {
    isFetching: false,
    list: {},
  },
};

export default (state = initialState, action) => {
  const {
    payload,
    type,
  } = action;

  switch (type) {
    case FETCH_OPTIONS_REQUEST: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: true,
        },
      };
    }
    case FETCH_OPTIONS_SUCCESS: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          list: payload,
        },
      };
    }
    case FETCH_OPTIONS_FAILURE: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
        },
      };
    }
    default:
      return state;
  }
};
