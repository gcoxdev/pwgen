import { UPDATE_UI_SETTINGS, RESET_UI_SETTINGS } from '../actions/types';
import { uiSettings } from './defaultSettings';

export default (state = uiSettings, action) => {
  switch (action.type) {
    case UPDATE_UI_SETTINGS:
      return { ...state, [action.payload.key]: action.payload.value };
    case RESET_UI_SETTINGS:
      return { ...state, ...uiSettings };
    default:
      return state;
  }
};
