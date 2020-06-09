import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/Landing.css";

//import react reveal effects
import Fade from "react-reveal/Fade";

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
          <Fade delay="500">
            <img src={landingImage} style={{ width: "100%" }}></img>
            <h3 id="image-alt-text">miSquads</h3>
          </Fade>
          <div id="landing-content-words-container">
            <Fade left>
              <p id="get-productive">Get productive. </p>
            </Fade>
            <Fade right duration="1000">
              <p id="stay-connected">Stay connected. </p>
            </Fade>

            <Fade bottom>
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
            </Fade>
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
