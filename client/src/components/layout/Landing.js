import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import "../../styles/Landing.css";
import landingImage from "../assets/miTeamsLanding.png";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <div id="landing">
        <div id="landing-container">
          <img src={landingImage} id="landing-image"></img>

          <div className="landing-buttons">
            <div className="meetings-button">
              <Link to="/login">
                <Button variant="contained" size="large" color="primary">
                  Login
                </Button>
              </Link>
            </div>

            <div className="groups-button">
              <Link to="/register">
                <Button variant="contained" size="large" color="primary">
                  Register
                </Button>
              </Link>
            </div>

            <div className="messages-button">
              <Link to="/about">
                <Button variant="contained" size="large" color="primary">
                  About
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Landing);
