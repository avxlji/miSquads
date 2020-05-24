import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Alert from "@material-ui/lab/Alert";

const DynamicAlert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => <Alert severity={alert.alertType}>{alert.msg}</Alert>)
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
