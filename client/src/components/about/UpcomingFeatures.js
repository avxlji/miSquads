import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "../../styles/UpcomingFeatures.css";
import aboutImage from "../assets/aboutLanding.png";
import securityImage from "../assets/undrawSecurity.svg";

import Footer from "../layout/Footer";
import Navbar from "../layout/Navbar";

//material UI imports
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const UpcomingFeatures = () => {
  return (
    <>
      <div id="upcoming-features-container">
        <h3 id="upcoming-features-header">Upcoming Features</h3>
        <TableContainer
          component={Paper}
          id="upcoming-features-table-container"
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ETA</TableCell>
                <TableCell align="right">Instructions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key="1">
                <TableCell component="th" scope="row">
                  TBA
                </TableCell>
                <TableCell align="right"> Customizable Team Colors</TableCell>
              </TableRow>

              <TableRow key="2">
                <TableCell component="th" scope="row">
                  TBA
                </TableCell>
                <TableCell align="right"> Forget Password Email</TableCell>
              </TableRow>

              <TableRow key="3">
                <TableCell component="th" scope="row">
                  TBA
                </TableCell>
                <TableCell align="right">
                  {" "}
                  Leave messages for team-mates
                </TableCell>
              </TableRow>

              <TableRow key="4">
                <TableCell component="th" scope="row">
                  TBA
                </TableCell>
                <TableCell align="right"> Refactor mobile view</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Link to="/about">
          <Button
            variant="contained"
            size="large"
            color="primary"
            id="upcoming-features-button"
          >
            Back to about
          </Button>
        </Link>
      </div>

      <Footer />
    </>
  );
};

export default connect(null, {})(UpcomingFeatures);
