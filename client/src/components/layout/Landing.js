import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/Landing.css";

import Footer from "./Footer";
import Navbar from "../layout/Navbar";
import landingImage from "../assets/calendarImg.png";

//material UI imports
import Button from "@material-ui/core/Button";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <div id="landing-container">
        <div id="landing-content">
          <img src={landingImage} style={{ width: "100%" }}></img>
          <div id="landing-content-words-container">
            <p id="get-productive">Get productive. </p>
            <p id="stay-connected">Stay connected. </p>

            <Link to="/login">
              <Button
                variant="contained"
                size="large"
                color="primary"
                id="get-started-button"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* <div id="landing-buttons">
                <div id="meetings-button">
                  <Link to="/login">
                    <Button variant="contained" size="large" color="primary">
                      Login
                    </Button>
                  </Link>
                </div>

                <div id="groups-button">
                  <Link to="/register">
                    <Button variant="contained" size="large" color="primary">
                      Register
                    </Button>
                  </Link>
                </div>

                <div id="messages-button">
                  <Link to="/about">
                    <Button variant="contained" size="large" color="primary">
                      About
                    </Button>
                  </Link>
                </div> */}
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
