import {
  FETCH_BASIC_INFO_FAILURE,
  FETCH_BASIC_INFO_REQUEST,
  FETCH_BASIC_INFO_SUCCESS,
  SHOW_MAP,
  SHOW_SEARCH,
  SHOW_RESULTS,
  SHOW_PROVIDER,
  UPDATE_FORM,
  SHOW_MOBILE_MAP,
  SORT_ORDER,
  FETCH_ALERT_BANNER_INFO_REQUEST,
  FETCH_ALERT_BANNER_INFO_FAILURE,
  FETCH_ALERT_BANNER_INFO_SUCCESS
} from '@actions/global';

const initialState = {
  basicInfo: {
    isFetching: true,
    data: {},
  },
  alertBanner: {
    isFetching: true,
    active: false,
    content: ""
  },
  view: 'search',
  updateForm: false,
  showMobileMap: false,
  sortOrder: 'relevance'
};

export default (state = initialState, action) => {
  const {
    payload,
    type,
  } = action;

  switch (type) {

    case FETCH_BASIC_INFO_REQUEST: {
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          isFetching: true,
        },
      };
    }

    case FETCH_BASIC_INFO_SUCCESS: {
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          isFetching: false,
          data: payload,
        },
      };
    }

    case FETCH_BASIC_INFO_FAILURE: {
      return {
        ...state,
        basicInfo: {
          ...state.basicInfo,
          isFetching: false,
        },
      };
    }

    case FETCH_ALERT_BANNER_INFO_REQUEST:
      return {
        ...state,
        alertBanner: {
          ...state.alertBanner,
          isFetching: true
        }
      }

    case FETCH_ALERT_BANNER_INFO_FAILURE:
      return {
        ...state,
        alertBanner: {
          ...state.alertBanner,
          isFetching: false,
          active: false
        }
      }

    case FETCH_ALERT_BANNER_INFO_SUCCESS:
      return {
        ...state,
        alertBanner: {
          isFetching: false,
          active: payload.active,
          content: payload.content
        }
      }

    case SHOW_MAP: {
      return {
        ...state,
        view: 'map',
      };
    }

    case SHOW_SEARCH: {
      return {
        ...state,
        view: 'search',
      };
    }

    case SHOW_RESULTS: {
      return {
        ...state,
        view: 'results',
      };
    }

    case SHOW_PROVIDER: {
      return {
        ...state,
        view: 'provider',
        provider: payload,
      };
    }

    case UPDATE_FORM: {
      return {
        ...state,
        updateForm: payload,
      };
    }

    case SHOW_MOBILE_MAP: {
      return {
        ...state,
        showMobileMap: payload,
      };
    }

    case SORT_ORDER: {
      return {
        ...state,
        sortOrder: payload,
      };
    }

    default:
      return state;
  }
};
