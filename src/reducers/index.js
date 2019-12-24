import { combineReducers } from 'redux';
import uiSettingsReducer from './uiSettingsReducer';
import passwordSettingsReducer from './passwordSettingsReducer';

export default combineReducers({
  uiSettings: uiSettingsReducer,
  passwordSettings: passwordSettingsReducer
});
