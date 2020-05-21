import React from "react";
import PropTypes from "prop-types";
// import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";

const ScheduleItem = ({ linkToSchedule, roomKey }) => {
  console.log(roomKey);
  return (
    <>
      <Link to={`/schedule/${linkToSchedule}`}>{roomKey}</Link>
      <br />
    </>
  );
};

export default connect(null, {})(ScheduleItem);
