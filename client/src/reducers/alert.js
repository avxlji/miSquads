import { SET_ALERT, REMOVE_ALERT } from "../actions/types.js";

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_ALERT:
      if (state.length < 3) {
        //current under evaluation
        return [...state, payload];
      }
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
