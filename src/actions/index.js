import {
  UPDATE_PW_SETTINGS,
  CREATE_PASSWORD,
  UPDATE_PASSWORD,
  RESET_PW_SETTINGS,
  UPDATE_UI_SETTINGS,
  RESET_UI_SETTINGS
} from './types';

/*
 * PASSWORD ACTIONS
 */

export const updatePWSettings = (key, value) => {
  return {
    type: UPDATE_PW_SETTINGS,
    payload: {
      key,
      value
    }
  };
};

export const createPassword = () => {
  return {
    type: CREATE_PASSWORD
  };
};

export const updatePassword = newPassword => {
  return {
    type: UPDATE_PASSWORD,
    payload: {
      newPassword
    }
  };
};

export const resetPWSettings = () => {
  return {
    type: RESET_PW_SETTINGS
  };
};

/*
 * UI ACTIONS
 */

export const updateUISettings = (key, value) => {
  return {
    type: UPDATE_UI_SETTINGS,
    payload: {
      key,
      value
    }
  };
};

export const resetUISettings = () => {
  return {
    type: RESET_UI_SETTINGS
  };
};
