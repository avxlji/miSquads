import axios from 'axios';
import { setAlert } from './alert';
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
} from './types';

// Get polls
export const getPolls = (scheduleId) => async (dispatch) => {
  try {
    console.log('reached 1');
    const res = await axios.get(`/api/polls/${scheduleId}`);
    console.log(res.data);
    dispatch({
      type: GET_POLLS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get poll
export const getPoll = (pollId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/polls/poll/${pollId}`);
    dispatch({
      type: GET_POLL,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add poll
export const addPoll = (formData, scheduleId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    console.log(formData);
    const res = await axios.post(`/api/polls/${scheduleId}`, formData, config);

    dispatch({
      type: CREATE_POLL,
      payload: res.data,
    });

    dispatch(setAlert('Poll Created', 'success'));
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete poll
export const deletePoll = (pollId) => async (dispatch) => {
  //takes in post id
  try {
    await axios.delete(`/api/polls/${pollId}`);

    dispatch({
      type: DELETE_POLL,
      payload: pollId,
    });

    dispatch(setAlert('Poll Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//cast vote
export const castVote = (pollId, choiceId) => async (dispatch) => {
  try {
    const res = await axios.put(`/api/polls/vote/${pollId}/${choiceId}`);
    dispatch({
      type: UPDATE_VOTE,
      payload: res.data, //
    });
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Update choice
export const updateChoice = (pollId, choiceId, formData) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put(
      `/api/polls/choice/${pollId}/${choiceId}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_CHOICE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

//Update choice
export const updatePollName = (scheduleId, pollId, formData) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put(
      `/api/polls/${scheduleId}/${pollId}`,
      formData,
      config
    );

    dispatch({
      type: UPDATE_POLL_NAME,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POLL_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const clearPolls = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_POLLS,
    });
  } catch (err) {}
};
