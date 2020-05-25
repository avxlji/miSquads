import React from "react";
import PropTypes from "prop-types";
// import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

const DashboardFormSelectPanel = ({ linkToSchedule, scheduleName, key }) => {
  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </>
  );
};

export default connect(null, {})(ScheduleDashboardFormSelectPanelItem);
