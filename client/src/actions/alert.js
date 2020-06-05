import { SET_ALERT, REMOVE_ALERT } from "./types";
import { v4 as uuidv4 } from "uuid";

export const setAlert = (msg, alertType, timeout = 8000) => (dispatch) => {
  console.log("alert action called");
  console.log(msg, alertType);
  const id = uuidv4();
  dispatch({
    //triggers reducer
    type: SET_ALERT,
    payload: { id, msg, alertType },
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, timeout);
};
