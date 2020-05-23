import { combineReducers } from "redux";
import schedule from "./schedule";
import auth from "./auth";
import alert from "./alert";

export default combineReducers({
  schedule,
  auth,
  alert,
});
