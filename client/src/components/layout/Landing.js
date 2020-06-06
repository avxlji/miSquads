import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/Landing.css";
import landingImage from "../assets/miTeamsLanding.png";

//material UI imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/icons/Menu";

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <AppBar position="static" id="landing-nav" style={{ marginTop: "1rem" }}>
        <Toolbar id="toolbar">
          {/* <Link to="/login">
            <Typography variant="h6">News</Typography>
          </Link> */}
          <div id="header-left">
            <Link to="/">
              <Typography variant="h6" id="miTeams">
                miTeams
              </Typography>
            </Link>
          </div>
          <div id="header-right">
            <Link to="/about">
              <Typography variant="h6" id="about">
                About
              </Typography>
            </Link>
            <Link to="/login">
              <Typography variant="h6" id="login">
                Log in
              </Typography>
            </Link>
            <Link to="register">
              <Typography variant="h6" id="register">
                Register
              </Typography>
            </Link>
          </div>
        </Toolbar>
      </AppBar>

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
