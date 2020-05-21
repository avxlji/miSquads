import {
  GET_SCHEDULE,
  ADD_EVENT,
  UPDATE_SCHEDULE,
  SCHEDULE_ERROR,
} from "./types";
import axios from "axios";

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

export const addEvent = (schedule_id, data) => (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log("add event action called");
  axios //making request to backend
    .put(`/api/schedule/event/${schedule_id}`, data, config)
    .then((
      res //getting back data
    ) =>
      dispatch({
        type: ADD_EVENT,
        payload: res.data, //sending as payload to reducer
      })
    )
    .catch((err) => console.log(err.message));
};

//Delete experience
export const deleteEvent = (schedule_id, event_id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/schedule/${schedule_id}/${event_id}`);
    console.log("reached dE");
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
