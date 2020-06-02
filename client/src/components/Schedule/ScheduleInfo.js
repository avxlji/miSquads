import React from "react";
import PropTypes from "prop-types";
// import Spinner from "../layout/Spinner";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import "../../styles/ScheduleTest.css";
import { deleteEvent } from "../../actions/schedule";
import Moment from "react-moment";
import moment from "moment";
import "../../styles/ScheduleInfo.css";
// import { DashboardActions } from "./DashboardActions";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

const ScheduleInfo = ({
  events,
  users,
  scheduleId,
  deleteEvent,
  deleteEventFromDisplay,
  history,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const convertStandardToMilitary = (time) => {
    var standardTime = moment(time, "HH:mm").format("hh:mm a");

    if (standardTime.charAt(0) === "0") {
      standardTime = standardTime.substr(1);
      return standardTime;
    }
    return standardTime;
  };

  const formatTiming = (starting, ending) => {
    var startingArray = starting.split(" ");
    var formattedStartingTime = convertStandardToMilitary(
      startingArray[startingArray.length - 1]
    );
    var dayOfPlan =
      startingArray[0] + " " + startingArray[1] + " " + startingArray[2];
    var endingArray = ending.split(" ");
    var formattedEndingTime = convertStandardToMilitary(
      endingArray[endingArray.length - 1]
    );
    return `From ${formattedStartingTime} to ${formattedEndingTime} on ${dayOfPlan}`;
  };

  const deleteTriggeredEvent = (scheduleId, id, history) => {
    if (window.confirm("Are you sure about that? This cannot be undone.")) {
      console.log("called");
      console.log(scheduleId);
      deleteEvent(scheduleId, id, history);
      deleteEventFromDisplay(id);
    }
  };

  const updateEvent = () => {};
  return (
    <>
      {/* Start events display panel */}
      <ExpansionPanel
        expanded={expanded === `panel1`}
        onChange={handleChange(`panel1`)}
        id="expansion-events-panel-container"
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel1bh-content`}
          id={`panel1bh-content`}
        >
          <Typography>
            <h3>Your teams events</h3>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails id="expansion-events-panel">
          {events !== null && events.length && events !== undefined ? (
            events.map((currentEvent, index) => (
              <>
                <Divider />
                <Typography key={index} id="single-event-typography">
                  <p>{currentEvent.title}</p>
                  <p>
                    {formatTiming(
                      currentEvent.startString,
                      currentEvent.endString
                    )}
                  </p>
                  {currentEvent.memo !== null ? (
                    currentEvent.memo
                  ) : (
                    <p>There's no additional information about this event.</p>
                  )}
                  <br />
                  {index === events.length - 1 ? (
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      id="adjusted-margin-schedule-info-delete-button"
                      onClick={() =>
                        deleteTriggeredEvent(
                          scheduleId,
                          currentEvent.id,
                          history
                        )
                      }
                    >
                      Delete Plan
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      id="schedule-info-delete-button"
                      onClick={() =>
                        deleteTriggeredEvent(
                          scheduleId,
                          currentEvent.id,
                          history
                        )
                      }
                    >
                      Delete Plan
                    </Button>
                  )}
                </Typography>
              </>
            ))
          ) : (
            <p>Your team hasn't scheduled any events yet</p>
          )}
          <br />
          <div id="expansion-button-container">
            {/* <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={(scheduleId, id, history) =>
                deleteEvent(scheduleId, id, history)
              }
            >
              Edit Plan
            </Button>{" "} */}
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* End events display panel */}

      {/* Start explicit schedule information */}
      <ExpansionPanel
        expanded={expanded === `panel2`}
        onChange={handleChange(`panel2`)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel2bh-content`}
          id={`panel2bh-content`}
        >
          <Typography>
            <h3>Schedule Info</h3>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Schedule Id: {scheduleId}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* End explicit schedule information */}

      {/* Start schedule users information */}
      <ExpansionPanel
        expanded={expanded === `panel3`}
        onChange={handleChange(`panel3`)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel3bh-content`}
          id={`panel3bh-content`}
        >
          <Typography>
            <h3>Team members</h3>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>Users: {users.length}</Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* End schedule users information */}
    </>
  );
};

ScheduleInfo.propTypes = {
  deleteEvent: PropTypes.func,
};

export default connect(null, { deleteEvent })(withRouter(ScheduleInfo));