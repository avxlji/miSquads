import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles/Landing.css';
import { removeCurrentAlert } from '../../actions/alert';
import Footer from './Footer';
import Navbar from '../layout/Navbar';
import landingImage from '../assets/calendarImg.png';

//import react reveal effects
import Fade from 'react-reveal/Fade';

//material UI imports
import Button from '@material-ui/core/Button';

const Landing = ({ isAuthenticated, removeCurrentAlert }) => {
  useEffect(() => {
    removeCurrentAlert();
  }, [removeCurrentAlert]);

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <div id="landing-container">
        <div id="landing-content">
          <Fade delay="500">
            <img src={landingImage} style={{ width: '100%' }}></img>
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
    </>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool,
  removeCurrentAlert: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { removeCurrentAlert })(Landing);
