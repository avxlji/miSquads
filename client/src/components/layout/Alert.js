//general imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../../styles/Alert.css';

//material ui imports
import MuiAlert from '@material-ui/lab/Alert';

const DynamicAlert = ({ alerts }) => {
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
      <MuiAlert
        severity={alert.alertType}
        elevation={6}
        variant="filled"
        id="mui-alert"
        style={{ width: '85%', margin: 'auto' }}
      >
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
