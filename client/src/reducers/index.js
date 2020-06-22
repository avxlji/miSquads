import { combineReducers } from 'redux';
import schedule from './schedule';
import auth from './auth';
import alert from './alert';
import post from './post';

//main reducer
export default combineReducers({
  schedule,
  auth,
  alert,
  post,
});
