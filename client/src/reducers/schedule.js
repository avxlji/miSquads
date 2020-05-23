import {
  GET_SCHEDULE,
  UPDATE_NAME,
  ADD_EVENT,
  CLEAR_SCHEDULE,
  UPDATE_SCHEDULE,
  CREATE_SCHEDULE,
} from "../actions/types";

const initialState = {
  schedule: null,
  loading: true,
  error: {},
};
//ADD CLEAR SCHEDULE CASE, CHECK DELETE EVENT CYCLE, TEST DELETE CYCLE
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_SCHEDULE:
    case GET_SCHEDULE:
    case ADD_EVENT:
    case CREATE_SCHEDULE:
      return {
        ...state,
        schedule: payload,
        loading: false,
      };
    case CLEAR_SCHEDULE:
      return {
        ...state,
        schedule: null,
        loading: false,
      };
    default:
      return state;
  }
}
