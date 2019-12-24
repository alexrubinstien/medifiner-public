import {
  FETCH_PROVIDERS_FAILURE,
  FETCH_PROVIDERS_REQUEST,
  FETCH_PROVIDERS_SUCCESS,
  ACTIVATE_PROVIDER,
} from '@actions/providers';

const initialState = {
  list: {
    isFetching: true,
    list: [],
  },
};

export default (state = initialState, action) => {
  const {
    query,
    payload,
    type,
  } = action;

  switch (type) {
    case FETCH_PROVIDERS_REQUEST: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: true,
        },
        query,
      };
    }
    case FETCH_PROVIDERS_SUCCESS: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
          list: payload,
        },
      };
    }
    case FETCH_PROVIDERS_FAILURE: {
      return {
        ...state,
        list: {
          ...state.list,
          isFetching: false,
        },
      };
    }
    case ACTIVATE_PROVIDER: {
      return {
        ...state,
        activeProvider: payload,
      };
    }
    default:
      return state;
  }
};
