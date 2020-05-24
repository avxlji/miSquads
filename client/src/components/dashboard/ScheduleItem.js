import React from "react";
import PropTypes from "prop-types";
// import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";

import Card from "@material-ui/core/Card"; //testing material UI imports
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const ScheduleItem = ({ linkToSchedule, scheduleName, key }) => {
  return (
    <>
      <Card className="card" key={key}>
        <CardContent>
          <h4>{scheduleName}</h4>
        </CardContent>
        <CardActions>
          <Link to={`/schedule/${linkToSchedule}`}>
            <Button variant="contained" size="medium" color="primary">
              Open
            </Button>
          </Link>
        </CardActions>
      </Card>
      {/* <Link to={`/schedule/${linkToSchedule}`}>{roomKey}</Link>
      <br /> */}
    </>
  );
};

export default connect(null, {})(ScheduleItem);
