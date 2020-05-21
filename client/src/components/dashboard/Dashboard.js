import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/auth";
import { logout } from "../../actions/auth";
// import Spinner from "../layout/Spinner";
import { Link, Redirect } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";
import ScheduleItem from "../Schedule/ScheduleItem";
import axios from "axios";

const Dashboard = ({
  deleteAccount,
  auth: { user, isAuthenticated },
  logout,
}) => {
  const [urlInput, setUrlInput] = useState({
    url: "",
  });

  const [roomKeyInput, setRoomKeyInput] = useState({
    roomKey: "",
  });

  const [verifiedEntry, setVerifiedEntry] = useState(false);

  const { url } = urlInput;
  const { roomKey } = roomKeyInput;

  const onUrlInputChange = (e) => {
    setUrlInput({ url: e.target.value });
  };

  const onRoomKeyInputChange = (e) => {
    setRoomKeyInput({ roomKey: e.target.value });
  };

  const onScheduleInputSubmit = () => {
    if (url !== "" && roomKey !== "") {
      var urlInput = url.split("/");
      var scheduleIdEntry = urlInput[urlInput.length - 1];
      const body = { roomKey };
      axios.post(`/api/schedule/check/${scheduleIdEntry}`, body).then((res) => {
        setVerifiedEntry(res.data.verifiedRoomKey);
        console.log(verifiedEntry); //this part is buggy, seemd to be laggy..
      });
    } else {
      console.log("rip");
    }
  };

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  if (user !== null && user.schedules.length > 0) {
    console.log(user.schedules);
    console.log(user);
  }
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
            <button onClick={() => onScheduleInputSubmit()}>
              Add Schedule
            </button>
          </div>
          <button type="button" onClick={logout}>
            Log out
          </button>
          <button type="button" onClick={deleteAccount}>
            Delete Account
          </button>
        </>
      ) : (
        "You're not apart of any groups yet"
      )}
    </>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func,
  logout: PropTypes.func,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteAccount, logout })(Dashboard);
