//general imports
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import '../../styles/Pollbar.css';

//material UI imports
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Pollbar = ({ question }) => {
  return (
    <>
      <AppBar position="relative" id="poll-bar">
        <Toolbar id="poll-tool-bar">
          <Typography variant="h6" id="question-container">
            <div id="question">
              {/* 250 character limit */}
              {question.length > 250
                ? question.substring(0, 250) + '...'
                : question}
            </div>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

Pollbar.propTypes = {
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(Pollbar);
