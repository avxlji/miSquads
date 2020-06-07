import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/Footer.css";

const Footer = () => {
  return (
    <>
      <div class="footer">
        <div class="footer-grid">
          <div class="footer-grid-left">
            <p class="glossy-text">&copy; 2020 miTeams</p>
          </div>
          <div class="footer-grid-right">
            <a
              href="https://github.com/jeverd/lecture-experience"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="fab fa-github-alt"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {})(Footer);
