import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/Landing.css";

import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

//material UI imports
import Button from "@material-ui/core/Button";

const About = () => {
  return (
    <>
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
