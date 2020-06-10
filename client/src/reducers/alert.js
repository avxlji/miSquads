import {
  SET_ALERT,
  REMOVE_ALERT,
  REMOVE_CURRENT_ALERT,
} from '../actions/types.js';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      if (state.length < 1) {
        //current under evaluation
        return [...state, payload];
      }
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);

    case REMOVE_CURRENT_ALERT:
      state = [];
      return state;
    default:
      return state;
  }
}
