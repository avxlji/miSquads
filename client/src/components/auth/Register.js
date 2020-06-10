import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { register } from '../../actions/auth';
// import { setAlert } from '../../actions/alert';
import '../../styles/Register.css';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const Register = ({ isAuthenticated, register }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    password2: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(true);

  const [minimumPasswordLength, setMinimumPasswordLength] = useState(true);

  const [dynamicPasswordDisplay, setDynamicPasswordDisplay] = useState(
    'password'
  );

  const handleShowPasswordTrigger = () => {
    if (showPassword === false && dynamicPasswordDisplay === 'password') {
      setShowPassword(!showPassword);
      setDynamicPasswordDisplay('text');
    } else {
      setShowPassword(!showPassword);
      setDynamicPasswordDisplay('password');
    }
  };

  const { name, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* set temporary password error message */
  const displayPasswordsDoNotMatch = () => {
    setTimeout(() => {
      setPasswordMatch(true);
    }, 4000);
  };

  const displayMinLength = () => {
    setTimeout(() => {
      setMinimumPasswordLength(true);
    }, 4000);
  };
  /* set temporary password error message */

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setPasswordMatch(false);
      displayPasswordsDoNotMatch();
    } else if (password.length < 6 || password2.length < 6) {
      setMinimumPasswordLength(false);
      displayMinLength();
    } else {
      register(name, email, password);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="dashboard"></Redirect>;
  }

  return (
    <>
      <div id="register-container">
        <h1 id="register-header">Sign Up</h1>
        <p id="register-summary">Get started with miSquads</p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div>
            <TextField
              id="outlined-basic"
              label="Name"
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Email"
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
            {/* <small className="form-text">
              This site uses Gravatar so if you want a profile image, use a
              Gravatar email
            </small> */}
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Password"
              type={dynamicPasswordDisplay}
              placeholder="Password"
              name="password"
              minLength="6"
              helperText={
                minimumPasswordLength
                  ? ''
                  : 'Your password must be atleast 6 characters'
              }
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              helperText={passwordMatch ? '' : 'Passwords do not match'}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          {/* <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showPassword}
                  onChange={() => handleShowPasswordTrigger()}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Show Password"
            />
          </div> */}
          <Button
            variant="contained"
            size="medium"
            color="primary"
            type="submit"
            id="register-button"
          >
            Register
          </Button>
        </form>
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(Register);
