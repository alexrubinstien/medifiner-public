import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import global from '@app/reducers/global';
import options from '@app/reducers/options';
import providers from '@app/reducers/providers';

export default combineReducers({
  form: formReducer,
  global,
  options,
  providers,
});
