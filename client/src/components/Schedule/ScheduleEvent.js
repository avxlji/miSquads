//general imports
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import '../../styles/ScheduleTest.css';
import { deleteEvent } from '../../actions/schedule';
import Moment from 'react-moment';
import moment from 'moment';

//material ui imports
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

const ScheduleTest = ({
  event: { id, title, start, startString, end, endString, memo, allDay },
  currentIndex,
  sendData,
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
    var standardTime = moment(time, 'HH:mm').format('hh:mm a');

    if (standardTime.charAt(0) === '0') {
      standardTime = standardTime.substr(1);
      return standardTime;
    }
    return standardTime;
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
        expanded={expanded === `panel${currentIndex}`}
        onChange={handleChange(`panel${currentIndex}`)}
      >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${currentIndex}bh-content`}
          id={`panel${currentIndex}bh-content`}
        >
          <Typography>
            <h3>{title}</h3>
          </Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className="expansion-panel-container">
          <Typography>From: {convertStandardToMilitary(start)}</Typography>
          <Typography>To: {convertStandardToMilitary(end)}</Typography>
          <br />
          <Typography>
            {memo !== undefined && memo.length > 0 ? (
              memo
            ) : (
              <p>There's no additional information about this event.</p>
            )}
          </Typography>
          <br />

          <div id="expansion-button-container">
            <Button
              variant="contained"
              size="medium"
              color="primary"
              style={{ backgroundColor: '#001f3f' }}
              onClick={() => deleteTriggeredEvent(scheduleId, id, history)}
            >
              Delete Plan
            </Button>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </>
  );
};

ScheduleTest.propTypes = {
  deleteEvent: PropTypes.func,
};

export default connect(null, { deleteEvent })(withRouter(ScheduleTest));
