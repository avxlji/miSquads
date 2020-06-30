import {
  GET_POLL,
  GET_POLLS,
  CREATE_POLL,
  UPDATE_POLL_NAME,
  UPDATE_VOTE,
  UPDATE_CHOICE,
  POLL_ERROR,
  DELETE_POLL,
  CLEAR_POLLS,
} from '../actions/types';

const initialState = {
  polls: [],
  poll: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case GET_POLLS:
      return {
        ...state,
        polls: payload,
        loading: false,
      };
    case GET_POLL:
      return {
        ...state,
        poll: payload,
        loading: false,
      };
    case CREATE_POLL:
      return {
        ...state,
        polls: [payload, ...state.polls],
        loading: false,
      };
    case DELETE_POLL:
      return {
        ...state,
        polls: state.polls.filter((poll) => poll._id !== payload),
        loading: false,
      };
    case POLL_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_VOTE:
      return {
        ...state,
        polls: state.polls.map((poll) =>
          poll._id === payload._id ? (poll = payload) : poll
        ),
        loading: false,
      };
    case UPDATE_CHOICE:
      return {
        ...state,
        polls: state.polls.map((poll) =>
          poll._id === payload._id ? (poll = payload) : poll
        ),
        loading: false,
      };
    case UPDATE_POLL_NAME:
      return {
        ...state,
        polls: state.polls.map((poll) =>
          poll._id === payload._id ? (poll.name = payload.name) : poll
        ),
        loading: false,
      };
    case CLEAR_POLLS:
      return {
        ...state,
        polls: [],
        poll: null,
        loading: false,
      };
    default:
      return state;
  }
}
