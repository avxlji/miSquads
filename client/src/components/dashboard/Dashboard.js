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

  const { url } = urlInput;

  const onUrlInputChange = (e) => {
    setUrlInput({ url: e.target.value });
  };

  const onUrlInputSubmit = () => {
    var scheduleId = null;
    var roomKey = null;
    if (url !== "") {
      var urlInput = url.split("/");
      var scheduleIdEntry = urlInput[urlInput.length - 1];
      axios.get(`/api/schedule/partial/${scheduleIdEntry}`).then((res) => {
        console.log(res.data);
        roomKey = res.data.roomKey;
        scheduleId = res.data.scheduleId;
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
          Add schedule by url
          <input
            type="text"
            style={{ border: "2px solid black" }}
            onChange={(e) => onUrlInputChange(e)}
          />
          <button onClick={() => onUrlInputSubmit()}>Add Schedule</button>
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
