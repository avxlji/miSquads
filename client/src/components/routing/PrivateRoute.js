import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" /> //if not authenticated and not loading, redirect user to login page
      ) : (
        <Component {...props} /> //else render component with any props passed into that component
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired, //used as PrivateRoute arg
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {})(PrivateRoute);
