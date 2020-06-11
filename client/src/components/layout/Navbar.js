import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles/Navbar.css';

//material UI imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Navbar = ({ isAuthenticated }) => {
  return (
    <>
      <AppBar position="static" id="nav">
        <Toolbar id="toolbar">
          {/* <Link to="/login">
            <Typography variant="h6">News</Typography>
          </Link> */}
          <div id="header-left">
            <Link to="/">
              <Typography variant="h6" id="miSquads">
                miSquads
              </Typography>
            </Link>
          </div>
          <div id="header-right">
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <>
                <Link to="/about">
                  <Typography variant="h6" id="about">
                    About
                  </Typography>
                </Link>
                {/* currently testing dashboard route on frontend */}
                <Link to="/dashboard">
                  <Typography variant="h6" id="login">
                    Dashboard
                  </Typography>
                </Link>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Navbar);
