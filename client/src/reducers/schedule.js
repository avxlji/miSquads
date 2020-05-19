import { GET_SCHEDULE, UPDATE_NAME, ADD_EVENT } from "../actions/types";

const initialState = {
  schedule: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_NAME:
    case GET_SCHEDULE:
    case ADD_EVENT:
      return {
        ...state,
        schedule: payload,
        loading: false,
      };
    default:
      return state;
  }
}
