import {
  UPDATE_PW_SETTINGS,
  CREATE_PASSWORD,
  UPDATE_PASSWORD,
  RESET_PW_SETTINGS
} from '../actions/types';
import generatePassword from '../passwordGenerator';
import { passwordSettings } from './defaultSettings';

export default (state = passwordSettings, action) => {
  let newPassword = '';
  switch (action.type) {
    case UPDATE_PW_SETTINGS:
      return { ...state, [action.payload.key]: action.payload.value };
    case CREATE_PASSWORD:
      newPassword = generatePassword(state);
      return { ...state, password: newPassword };
    case UPDATE_PASSWORD:
      return { ...state, password: action.payload.newPassword };
    case RESET_PW_SETTINGS:
      return { ...state, ...passwordSettings };
    default:
      return state;
  }
};
