import {
  GET_SCHEDULE,
  ADD_EVENT,
  UPDATE_SCHEDULE,
  SCHEDULE_ERROR,
  CLEAR_SCHEDULE,
  CREATE_SCHEDULE,
} from "./types";
import { setAlert } from "./alert";
import axios from "axios";
import { body } from "express-validator";

export const getSchedule = (id) => (dispatch) => {
  axios //making request to backend
    .get(`/api/schedule/${id}`)
    .then((
      res //getting back data
    ) =>
      dispatch({
        type: GET_SCHEDULE,
        payload: res.data, //sending as payload to reducer
      })
    )
    .catch((err) => console.log(err.message));
};

export const createSchedule = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.post(`/api/schedule`, data, config);
    console.log("create schedule action");
    dispatch({
      type: CREATE_SCHEDULE,
      payload: res.data,
    });
    dispatch(setAlert("Schedule Created", "success"));
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const addUserToSchedule = (schedule_id, roomKey) => async (dispatch) => {
  try {
    console.log("reached 2");
    const res = await axios.put(`/api/schedule/${schedule_id}/${roomKey}`);
    console.log("reached aUTS");
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data, //returns schedule post deletion
    });
    // dispatch(setAlert("Event Removed", "success"));
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const changeScheduleName = (schedule_id, data) => (dispatch) => {
  console.log("action called");
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios //making request to backend
    .put(`/api/schedule/${schedule_id}`, data, config)
    .then((
      res //getting back data
    ) =>
      dispatch({
        type: UPDATE_SCHEDULE,
        payload: res.data, //sending as payload to reducer
      })
    )
    .catch((err) => console.log(err.message));
};

export const deleteSchedule = (schedule_id, history) => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete(`/api/schedule/${schedule_id}`);
      dispatch({
        type: CLEAR_SCHEDULE,
      });
      // history.push("/dashboard");
    } catch (err) {
      dispatch({
        type: SCHEDULE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  }
};

export const addEvent = (schedule_id, data) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("add event action called");
  axios //making request to backend
    .put(`/api/schedule/event/${schedule_id}`, data, config)
    .then(
      (
        res //getting back data
      ) => {
        dispatch({
          type: ADD_EVENT,
          payload: res.data, //sending as payload to reducer
        });
        console.log("alert in schedule reducer");
        dispatch(setAlert("Event Removed", "success"));
      }
    )
    .catch((err) => console.log(err.message));
};

//Delete experience
export const deleteEvent = (schedule_id, event_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/schedule/${schedule_id}/${event_id}`);
    dispatch({
      type: UPDATE_SCHEDULE,
      payload: res.data, //returns schedule post deletion
    });

    // dispatch(setAlert("Event Removed", "success"));
  } catch (err) {
    dispatch({
      type: SCHEDULE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
