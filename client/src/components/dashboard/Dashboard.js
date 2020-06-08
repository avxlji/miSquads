import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/auth";
import {
  addUserToSchedule,
  createSchedule,
  clearSchedule,
} from "../../actions/schedule";
import { loadUser } from "../../actions/auth";
import { logout } from "../../actions/auth";
// import Spinner from "../layout/Spinner";
import { Link, Redirect, withRouter } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";
import ScheduleItem from "./ScheduleItem";
import "../../styles/Dashboard.css";
import axios from "axios";

//materialUI imports
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const Dashboard = ({
  deleteAccount,
  auth: { user, isAuthenticated },
  logout,
  addUserToSchedule,
  createSchedule,
  history,
  clearSchedule,
  loadUser,
}) => {
  useEffect(() => {
    //clear schedule upon entering/returning to dashboard to prevent state lag
    clearSchedule();
    loadUser(); //testing performance (reloads user data into dashboard)
  }, [clearSchedule, loadUser]);

  /* start hooks */
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

  const [scheduleFormSelection, setScheduleFormSelection] = useState({
    createTeam: false,
    joinTeam: false,
  });
  /* end hooks */

  /* start destructuring hooks */
  const { url } = urlInput;
  const { roomKey } = roomKeyInput;
  const { newScheduleName } = createScheduleInput;
  const { newScheduleRoomKey } = createScheduleInput;
  const { createTeam } = scheduleFormSelection;
  const { joinTeam } = scheduleFormSelection;
  /* end destructuring hooks */

  /* start trigger functions */
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

  const onCreateTeamClick = () => {
    if (createTeam === true) {
      setScheduleFormSelection({
        createTeam: false,
        joinTeam: false,
      });
    } else {
      setScheduleFormSelection({
        createTeam: true,
        joinTeam: false,
      });
    }
  };

  const onJoinTeamClick = () => {
    if (joinTeam === true) {
      setScheduleFormSelection({
        createTeam: false,
        joinTeam: false,
      });
    } else {
      setScheduleFormSelection({
        createTeam: false,
        joinTeam: true,
      });
    }
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
      console.log(body);
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
      window.location.reload();
    }
  };

  /* end trigger functions */

  return (
    <>
      {/* testing out 80% div */}
      <div style={{ width: "80%", margin: "auto" }}>
        {/* start dashboard header(s) */}
        {user !== null && (
          <div id="dashboard-headers">
            <h1 id="hello-header">Hello</h1>
            <h1 id="user-name-header"> {user.name}</h1>
          </div>
        )}
        {/* end dashboard headers */}
        {/* <div id="dashboard-divider"></div> */}
        {/* start schedules display */}
        {user !== null && user.schedules.length > 0 ? (
          <>
            <div id="schedule-items">
              {/* <h1 id="schedule-items-header">Your Teams</h1>
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
              </div> */}

              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Schedule Name</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.schedules.map((sched, index) => (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {sched.scheduleName}
                        </TableCell>
                        <TableCell align="right">
                          <Link to={`/schedule/${sched.schedule_id}`}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              style={{ backgroundColor: "#001f3f" }}
                            >
                              Open
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </>
        ) : (
          <h1 id="no-teams-header">You're not apart of any teams yet</h1>
        )}
        {/* end schedules display*/}
        {/* Start form selection panel */}
        <div id="dashboard-form-panel-lg">
          <ButtonGroup
            variant="contained"
            color="primary"
            id="lg-buttons-group"
            aria-label="contained primary button group"
          >
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => onCreateTeamClick()}
            >
              Create Team
            </Button>
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => onJoinTeamClick()}
            >
              Join Team
            </Button>
          </ButtonGroup>
        </div>
        {/* End form selection panel */}
        {/* Start condition form display*/}
        <>
          {joinTeam && (
            <div id="add-schedule-container">
              <TextField
                id="outlined-basic"
                label="Team Id"
                type="text"
                className="add-schedule-inputs"
                onChange={(e) => onUrlInputChange(e)}
              />
              <TextField
                id="outlined-basic"
                label="Team Key"
                type="text"
                className="add-schedule-inputs"
                onChange={(e) => onRoomKeyInputChange(e)}
              />
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={() => onScheduleInputSubmit()}
                style={{ backgroundColor: "#001f3f" }}
                className="add-schedule-inputs"
              >
                Join Team
              </Button>
            </div>
          )}

          {createTeam && (
            <div id="add-schedule-container">
              <TextField
                id="outlined-basic"
                label="Team Name"
                type="text"
                onChange={(e) => onCreateScheduleInputChange(e)}
                name="newScheduleName"
                className="add-schedule-inputs"
              />
              <TextField
                id="outlined-basic"
                label="Team Key"
                type="text"
                onChange={(e) => onCreateScheduleInputChange(e)}
                name="newScheduleRoomKey"
                className="add-schedule-inputs"
              />
              <Button
                variant="contained"
                size="small"
                color="primary"
                style={{ backgroundColor: "#001f3f" }}
                onClick={() => onCreateScheduleInputSubmit()}
                className="add-schedule-inputs"
              >
                Create Team
              </Button>
            </div>
          )}
          {/* End conditional form display */}

          {/* Start management buttons */}
          <div className="dashboard-management-buttons">
            <Button
              variant="contained"
              type="button"
              id="logOut"
              onClick={logout}
            >
              Log out
            </Button>
            <Button
              variant="contained"
              type="button"
              color="secondary"
              onClick={deleteAccount}
              id="deleteAccount"
            >
              Delete Account
            </Button>
          </div>
          {/* End management buttons */}
        </>
      </div>
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
  loadUser: PropTypes.func,
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
  loadUser,
})(withRouter(Dashboard));
