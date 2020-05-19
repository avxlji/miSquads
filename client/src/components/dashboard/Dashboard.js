import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteAccount } from "../../actions/profile";
// import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";

const Dashboard = ({ deleteAccount, auth: { user } }) => {
  return (
    <>
      {user !== null && user.schedules.length > 0 ? (
        <>
          {user.schedules.map((sched) => (
            <p>sched</p>
          ))}
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
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteAccount })(Dashboard);
