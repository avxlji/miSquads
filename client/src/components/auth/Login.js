import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";
import TextField from "@material-ui/core/TextField";
import "../../styles/LogIn.css";
import Button from "@material-ui/core/Button";

const Login = ({ isAuthenticated, login }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Redirect to="dashboard"></Redirect>;
  }

  return (
    <>
      <div id="sign-in-container">
        <h1 id="sign-in-header">Sign In</h1>
        <p id="sign-in-summary">Sign Into Your Account</p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div>
            <TextField
              id="outlined-basic"
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              label="Email"
              fullWidth
              required
            />
          </div>
          <div>
            <TextField
              id="outlined-basic"
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
              minLength="2"
              value={password}
              fullWidth
              onChange={(e) => onChange(e)}
            />
          </div>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            type="submit"
            id="sign-in-button"
          >
            Login
          </Button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
