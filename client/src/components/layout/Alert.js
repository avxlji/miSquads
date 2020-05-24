import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MuiAlert from "@material-ui/lab/Alert";

const DynamicAlert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <MuiAlert severity={alert.alertType} elevation={6} variant="filled">
        {alert.msg}
      </MuiAlert>
    ))
  );
};

DynamicAlert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  //mutate redux state to prop
  alerts: state.alert,
});

export default connect(mapStateToProps, {})(DynamicAlert);