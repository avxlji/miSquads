import { GET_SCHEDULE, UPDATE_NAME, ADD_EVENT } from "./types";
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
        type: UPDATE_NAME,
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
