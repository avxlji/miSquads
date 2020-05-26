import React from "react";
import PropTypes from "prop-types";
// import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
// import { DashboardActions } from "./DashboardActions";

//materialUI imports
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

const EventDialog = ({ event, isOpen }) => {
  return (
    <>
      {event !== null ? (
        <Dialog aria-labelledby="simple-dialog-title" open={isOpen}>
          <DialogTitle id="simple-dialog-title">{event.title}</DialogTitle>
          <List>
            <ListItem>Plan Title: </ListItem>
            <ListItem>yeet</ListItem>
          </List>
          <Button
            variant="contained"
            size="small"
            color="primary"
            block
            onClick={this.changeName}
          >
            Change schedule name
          </Button>
        </Dialog>
      ) : (
        "Sorry, there was an error getting this plans details"
      )}
      {/* <Link to={`/schedule/${linkToSchedule}`}>{roomKey}</Link>
      <br /> */}
    </>
  );
};

export default connect(null, {})(EventDialog);
