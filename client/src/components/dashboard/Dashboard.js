import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/auth";
import {
  addUserToSchedule,
  createSchedule,
  clearSchedule,
} from "../../actions/schedule";
import { logout } from "../../actions/auth";
// import Spinner from "../layout/Spinner";
import { Link, Redirect, withRouter } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";
import ScheduleItem from "./ScheduleItem";
import "../../styles/Dashboard.css";
import axios from "axios";

const Dashboard = ({
  deleteAccount,
  auth: { user, isAuthenticated },
  logout,
  addUserToSchedule,
  createSchedule,
  history,
  clearSchedule,
}) => {
  useEffect(() => {
    clearSchedule();
  }, [clearSchedule]);

  const [urlInput, setUrlInput] = useState({
    url: "",
  });

  const [createScheduleInput, setCreateScheduleInput] = useState({
    newScheduleName: "",
    newScheduleRoomKey: "",
  });

  const [roomKeyInput, setRoomKeyInput] = useState({
    roomKey: "",
  });

  const { url } = urlInput;
  const { roomKey } = roomKeyInput;
  const { newScheduleName } = createScheduleInput;
  const { newScheduleRoomKey } = createScheduleInput;

  const onUrlInputChange = (e) => {
    setUrlInput({ url: e.target.value });
  };

  const onRoomKeyInputChange = (e) => {
    setRoomKeyInput({ roomKey: e.target.value });
  };

  const onCreateScheduleInputChange = (e) => {
    setCreateScheduleInput({
      ...createScheduleInput,
      [e.target.name]: e.target.value,
    });
  };

  const validateNewSchedule = (newScheduleId) => {
    if (user !== null) {
      var uniqueSchedule = true;
      if (user.schedules.length > 0) {
        for (var i = 0; i < user.schedules.length; i++) {
          if (user.schedules[i].schedule_id.toString() === newScheduleId) {
            uniqueSchedule = false;
          }
        }
      }
      return uniqueSchedule;
    }
  };

  const onScheduleInputSubmit = () => {
    if (url !== "" && roomKey !== "") {
      var urlInput = url.split("/");
      var scheduleIdEntry = urlInput[urlInput.length - 1];
      const body = { roomKey };
      axios.post(`/api/schedule/check/${scheduleIdEntry}`, body).then((res) => {
        const { verifiedRoomKey } = res.data;
        console.log(verifiedRoomKey);
        if (verifiedRoomKey && validateNewSchedule(scheduleIdEntry) === true) {
          addUserToSchedule(scheduleIdEntry, roomKey, history);
          window.location.reload();
        } else {
          console.log("failed");
        }
      });
    } else {
      console.log("rip");
    }
  };

  const onCreateScheduleInputSubmit = () => {
    console.log(newScheduleName);
    console.log(newScheduleRoomKey);
    if (newScheduleName.length > 0 && newScheduleRoomKey.length > 0) {
      let data = {
        roomKey: newScheduleRoomKey,
        scheduleName: newScheduleName,
      };
      createSchedule(data);
      // window.location.reload();
    }
  };

  // if (!isAuthenticated) {
  //   return <Redirect to="/" />;
  // }

  return (
    <>
      {user !== null && (
        <div id="dashboard-headers">
          <h1 id="hello-header">Hello</h1>
          <h1 id="user-name-header"> {user.name}</h1>
        </div>
      )}
      {/* <div id="dashboard-divider"></div> */}
      {user !== null && user.schedules.length > 0 ? (
        <>
          <div id="schedule-items">
            <h1 id="schedule-items-header">Your Teams</h1>
            <div id="schedule-items-container">
              {user.schedules.map((sched) => (
                <>
                  <ScheduleItem
                    key={sched.schedule_id}
                    scheduleName={sched.scheduleName}
                    linkToSchedule={sched.schedule_id}
                  />
                </>
              ))}
            </div>
          </div>
        </>
      ) : (
        "You're not apart of any groups yet"
      )}

      <>
        <div>
          Add schedule by url
          <input
            type="text"
            style={{ border: "2px solid black" }}
            onChange={(e) => onUrlInputChange(e)}
          />
          Then enter room key
          <input
            type="text"
            style={{ border: "2px solid black" }}
            onChange={(e) => onRoomKeyInputChange(e)}
          />
          <button onClick={() => onScheduleInputSubmit()}>Add Schedule</button>
        </div>
        <br />

        <input
          type="text"
          style={{ border: "2px solid black" }}
          onChange={(e) => onCreateScheduleInputChange(e)}
          name="newScheduleName"
        />
        <input
          type="text"
          style={{ border: "2px solid black" }}
          onChange={(e) => onCreateScheduleInputChange(e)}
          name="newScheduleRoomKey"
        />
        <button onClick={() => onCreateScheduleInputSubmit()}>
          Create Schedule
        </button>

        <button type="button" onClick={logout}>
          Log out
        </button>
        <button type="button" onClick={deleteAccount}>
          Delete Account
        </button>
      </>
    </>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func,
  logout: PropTypes.func,
  addUserToSchedule: PropTypes.func,
  createSchedule: PropTypes.func,
  clearSchedule: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteAccount,
  logout,
  addUserToSchedule,
  createSchedule,
  clearSchedule,
})(withRouter(Dashboard));
