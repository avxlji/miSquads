import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/auth";
import { addUserToSchedule } from "../../actions/schedule";
import { logout } from "../../actions/auth";
// import Spinner from "../layout/Spinner";
import { Link, Redirect } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";
import ScheduleItem from "./ScheduleItem";
import axios from "axios";

const Dashboard = ({
  deleteAccount,
  auth: { user, isAuthenticated },
  logout,
  addUserToSchedule,
}) => {
  const [urlInput, setUrlInput] = useState({
    url: "",
  });

  const [roomKeyInput, setRoomKeyInput] = useState({
    roomKey: "",
  });

  const { url } = urlInput;
  const { roomKey } = roomKeyInput;

  const onUrlInputChange = (e) => {
    setUrlInput({ url: e.target.value });
  };

  const onRoomKeyInputChange = (e) => {
    setRoomKeyInput({ roomKey: e.target.value });
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
          addUserToSchedule(scheduleIdEntry, roomKey);
          window.location.reload();
        } else {
          console.log("failed");
        }
      });
    } else {
      console.log("rip");
    }
  };

  // if (!isAuthenticated) {
  //   return <Redirect to="/" />;
  // }

  return (
    <>
      {user !== null && user.schedules.length > 0 ? (
        <>
          {user.schedules.map((sched) => (
            <ScheduleItem
              key={sched.schedule_id}
              roomKey={sched.roomKey}
              linkToSchedule={sched.schedule_id}
            />
          ))}
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  deleteAccount,
  logout,
  addUserToSchedule,
})(Dashboard);
