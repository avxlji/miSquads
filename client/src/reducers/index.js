import { combineReducers } from "redux";
import schedule from "./schedule";
import auth from "./auth";

export default combineReducers({
  schedule,
  auth,
});
