import { SET_ALERT, REMOVE_ALERT, REMOVE_CURRENT_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid';

export const setAlert = (msg, alertType, timeout = 8000) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    //triggers reducer
    type: SET_ALERT,
    payload: { id, msg, alertType },
  });

  //after x number of seconds, remove alert
  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, timeout);
};

export const removeCurrentAlert = () => (dispatch) => {
  setTimeout(() => {
    dispatch({
      type: REMOVE_CURRENT_ALERT,
    });
  });
};
