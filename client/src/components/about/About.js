import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/About.css";
import aboutImage from "../assets/aboutLanding.png";

import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

//material UI imports
import Button from "@material-ui/core/Button";

const About = () => {
  return (
    <>
      <div id="about-content-container">
        <h3 id="whats-header">Whats miTeams?</h3>
        <img src={aboutImage}></img>
        <p>
          miTeams is a team collaboration platform that focuses on quick
          collaboration and prompt check-ins. By reducing the number of
          un-necessary buttons, you can create, view and manage upcoming events
          in seconds.
        </p>
      </div>

      <div id="get-started-container">
        <h3 id="whats-header">How do I get started?</h3>
        <p>
          1) Hit Register in the top right corner of your screen and create an
          account (make it something easy to remember)
        </p>
        <p>2) Once you're signed in, hit create team.</p>
        <p>
          3) Enter in your team name and a team key (Keep this key handy as new
          users joining your team will be asked for it)
        </p>
        <p>
          4) Once you've created your team, that's it you're done! You can
          invite others to your team by sending them the URL of your team or by
          sending them your unique team ID
        </p>
      </div>
      <Footer />
    </>
  );
};

About.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(About);
