import { combineReducers } from 'redux';
import schedule from './schedule';
import auth from './auth';
import alert from './alert';

//main reducer
export default combineReducers({
  schedule,
  auth,
  alert,
});
