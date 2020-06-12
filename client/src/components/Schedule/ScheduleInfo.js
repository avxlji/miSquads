//general imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import '../../styles/ScheduleTest.css';
import { deleteEvent } from '../../actions/schedule';
import Moment from 'react-moment';
import moment from 'moment';
import '../../styles/ScheduleInfo.css';

//material ui imports
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

const ScheduleInfo = ({
  events,
  users,
  scheduleId,
  roomKey,
  deleteEvent,
  deleteEventFromDisplay,
  history,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const convertStandardToMilitary = (time) => {
    var standardTime = moment(time, 'HH:mm').format('hh:mm a');

    if (standardTime.charAt(0) === '0') {
      standardTime = standardTime.substr(1);
      return standardTime;
    }
    return standardTime;
  };

  const formatTiming = (starting, ending) => {
    var startingArray = starting.split(' ');
    var formattedStartingTime = convertStandardToMilitary(
      startingArray[startingArray.length - 1]
    );
    var dayOfPlan =
      startingArray[0] + ' ' + startingArray[1] + ' ' + startingArray[2];
    var endingArray = ending.split(' ');
    var formattedEndingTime = convertStandardToMilitary(
      endingArray[endingArray.length - 1]
    );
    return `From ${formattedStartingTime} to ${formattedEndingTime} on ${dayOfPlan}`;
  };

  const deleteTriggeredEvent = (scheduleId, id, history) => {
    if (window.confirm('Are you sure about that? This cannot be undone.')) {
      deleteEvent(scheduleId, id, history);
      deleteEventFromDisplay(id);
    }
  };

  const updateEvent = () => {};
  return (
    <>
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
            <h3>Your squads plans</h3>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails id="expansion-events-panel">
          {events !== null && events.length && events !== undefined ? (
            events.map((currentEvent, index) => (
              <>
                <Divider />
                <Typography key={index} id="single-event-typography">
                  <p>{currentEvent.title}</p>
                  {currentEvent.allDay ? (
                    <p>
                      This is event is scheduled for {currentEvent.startString}
                    </p>
                  ) : (
                    <p>
                      {formatTiming(
                        currentEvent.startString,
                        currentEvent.endString
                      )}
                    </p>
                  )}
                  {currentEvent.memo !== null &&
                  currentEvent.memo.length > 0 ? (
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
                      style={{ backgroundColor: '#001f3f' }}
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
                      style={{ backgroundColor: '#001f3f' }}
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
            <p>Your squad hasn't scheduled any events yet</p>
          )}
          <br />
          <div id="expansion-button-container"></div>
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
        <ExpansionPanelDetails>
          <Typography>Schedule roomKey: {roomKey}</Typography>
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
            <h3>Squad members</h3>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails id="expansion-users-panel">
          <Typography>Users: {users.length}</Typography>
          <div id="schedule-users-container">
            {users.map((user) => {
              if (user.name !== null) {
                return <Typography>- {user.user_name}</Typography>;
              }
            })}
          </div>
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
