import {
  GET_SCHEDULE,
  ADD_EVENT,
  UPDATE_SCHEDULE,
  SCHEDULE_ERROR,
  CLEAR_SCHEDULE,
  CREATE_SCHEDULE,
} from './types';
import { setAlert } from './alert';
import axios from 'axios';
import { body } from 'express-validator';
import { loadUser } from './auth';

export const getSchedule = (id) => (dispatch) => {
  console.log(id);
  axios
    .get(`/api/schedule/${id}`)
    .then(function (res) {
      console.log(res.data);
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data, //sending schedule as payload to reducer
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export const createSchedule = (data) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.post(`/api/schedule`, data, config);
    dispatch({
      type: CREATE_SCHEDULE,
      payload: res.data, //sends back new schedule
    });

    /* UNDER TEST */
    // loadUser();
    /* UNDER TEST */

    dispatch(setAlert('Your schedule was created successfully', 'success'));
  } catch (err) {
    dispatch(
      setAlert(
        'Sorry, there was a problem creating your schedule. Please try again later',
        'error'
      )
    );
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addUserToSchedule = (schedule_id, roomKey, history) => async (
  dispatch
) => {
  try {
    const res = await axios.put(`/api/schedule/${schedule_id}/${roomKey}`);
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data, //returns schedule with new user
    });
    dispatch(setAlert("You've been added!", 'success'));
    // dispatch(setAlert("Event Removed", "success"));
  } catch (err) {
    dispatch(setAlert('This schedule no longer exists', 'error'));
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeUserFromSchedule = (schedule_id, history) => async (
  dispatch
) => {
  try {
    const res = await axios.post(`/api/schedule/${schedule_id}`);
    dispatch({
      type: CLEAR_SCHEDULE,
    });
    history.push('/dashboard');
    dispatch(setAlert(`${res.data.msg}`, 'error')); //message being send from /routes/api/schedule.js
  } catch (err) {
    history.push('/dashboard');
    dispatch(setAlert('This schedule no longer exists.', 'error'));
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const changeScheduleName = (schedule_id, data, history) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const res = await axios.put(`/api/schedule/${schedule_id}`, data, config);
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data, //sends back updated schedule
    });
    dispatch(setAlert('Schedule name updated', 'success'));
  } catch (err) {
    history.push('/dashboard');
    dispatch(setAlert('This schedule no longer exists.', 'error'));
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deleteSchedule = (schedule_id, history) => async (dispatch) => {
  if (window.confirm('Are you sure? This can NOT be undone!')) {
    try {
      await axios.delete(`/api/schedule/${schedule_id}`);
      dispatch({
        type: CLEAR_SCHEDULE,
      });
      history.push('/dashboard');
      dispatch(setAlert('Schedule deleted', 'error'));
    } catch (err) {
      history.push('/dashboard');
      dispatch(setAlert('This schedule no longer exists.', 'error'));
      dispatch({
        type: SCHEDULE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

export const addEvent = (schedule_id, data, history) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = axios
    .put(`/api/schedule/event/${schedule_id}`, data, config)
    .then(
      (
        res //getting back data
      ) => {
        dispatch({
          type: ADD_EVENT,
          payload: res.data, //sends back updated schedule with new event
        });
        dispatch(setAlert('Event added', 'success'));
      }
    )
    .catch((err) => {
      console.log(err.message);
      dispatch(setAlert('This schedule no longer exists', 'error'));
    });
};

export const updateEvent = (schedule_id, event_id, data, history) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const res = axios
    .post(`/api/schedule/${schedule_id}/${event_id}`, data, config)
    .then(
      (
        res //getting back data
      ) => {
        dispatch({
          type: UPDATE_SCHEDULE,
          payload: res.data, //sends back updated schedule with updated event
        });
        dispatch(setAlert('Event updated', 'success'));
      }
    )
    .catch((err) => console.log(err.message));
};

//Delete experience
export const deleteEvent = (schedule_id, event_id, history) => async (
  dispatch
) => {
  try {
    const res = await axios.delete(`/api/schedule/${schedule_id}/${event_id}`);
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data, //sends back updated schedule with deleted event
    });
    dispatch(setAlert('Event removed', 'error'));
  } catch (err) {
    // history.push("/dashboard");
    dispatch(setAlert('This schedule no longer exists.', 'error'));
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const clearSchedule = () => async (dispatch) => {
  try {
    dispatch({
      type: CLEAR_SCHEDULE,
    });
  } catch (err) {}
};
