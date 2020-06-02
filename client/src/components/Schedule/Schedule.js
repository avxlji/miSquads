import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getSchedule,
  changeScheduleName,
  addEvent,
  deleteEvent,
  addUserToSchedule,
  deleteSchedule,
} from "../../actions/schedule";
import PropTypes from "prop-types"; //required as prop validation
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../../styles/Schedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Redirect, withRouter } from "react-router-dom";
import AddEvent from "./AddEvent";
// import EventDialog from "./EventDialog";
import EditEvent from "./EditEvent";
import Spinner from "../layout/Spinner";
import ScheduleTest from "./ScheduleTest";
import ScheduleInfo from "./ScheduleInfo";

//materialUI imports
import TextField from "@material-ui/core/TextField";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
//materialUI imports
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import LockIcon from "@material-ui/icons/Lock";

const localizer = momentLocalizer(moment);

class Schedule extends Component {
  constructor(props) {
    //temp addition ...
    super(props);
    this.state = {
      // dummyObject1: {
      //   scheduleName: "Test schedule 1",
      //   events: [
      //     {
      //       _id: "5ebe05ef1f5670631aaeaa9b",
      //       title: "7:40pm",
      //       start: "May 6, 2020 08:00:00",
      //       allDay: false,
      //       end: "May 6, 2020 18:00:00",
      //     },
      //     {
      //       _id: "5ebe05e51f5670631aaeaa9a",
      //       title: "test1",
      //       start: "today",
      //       allDay: true,
      //       end: "",
      //     },
      //   ],
      // },
      currentSchedule: null,
      _id: null,
      memo: null,
      title: null,
      start: null,
      allDay: false,
      end: null,
      nameChange: null,
      roomKeyChange: null,
      addEvent: false,
      changeSchedName: false,
      selectedEvent: null,
      eventDetailsOpen: false,
      editEventDetailsOpen: false,
      editEventTitle: null,
      editEventStart: null,
      editEventEnd: null,
      editEventAllDay: false,
      editEventPrefill: null,
    };
    //bind function to current component context
    this.getUpdatedEventData = this.getUpdatedEventData.bind(this);
    this.setEventDetailsModal = this.setEventDetailsModal.bind(this);
    this.deleteTriggeredEvent = this.deleteTriggeredEvent.bind(this);
  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.state.currentSchedule !== null) {
      if (this.state.currentSchedule.scheduleName !== null) {
        console.log(prevProps);
      }
    }
  }

  evaluateObjectChange(oldProps, newProps) {
    if (oldProps === null) {
      return 1;
    }

    if (oldProps.scheduleName !== newProps.scheduleName) {
      console.log("name changed called");
      return 2;
    }

    if (oldProps.events.length < newProps.events.length) {
      return 3;
    }

    /* start schedule state comparison */
    if (oldProps.events.length === newProps.events.length) {
      for (var i = 0; i < newProps.length; i++) {
        if (oldProps.events[i].title === newProps.events[i].title) {
          if (oldProps.events[i].memo === newProps.events[i].memo) {
            if (oldProps.events[i].start === newProps.events[i].start) {
              if (oldProps.events[i].end === newProps.events[i].end) {
                if (oldProps.events[i].allDay === newProps.events[i].allDay) {
                  //default case (no change)
                  return 5;
                } else {
                  //if change has occured
                  return 4;
                }
              } else {
                return 4;
              }
            } else {
              return 4;
            }
          } else {
            return 4;
          }
        } else {
          return 4;
        }
      }
    }
    /* end schedule state comparison */

    //default case (no change)
    return 5;
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.currentSchedule);
    console.log(nextProps);
    // if (nextProps.schedule.schedule === null) {
    //   //if no change in props
    //   console.log();
    // }
    if (nextProps.schedule.schedule !== null) {
      //if incoming props has a value
      var objectCase = this.evaluateObjectChange(
        //otherwise, evaluate incoming props
        this.props.schedule.schedule,
        nextProps.schedule.schedule
      );
      switch (objectCase) {
        case 1:
        case 4:
          var formattedProp = nextProps.schedule.schedule;
          if (formattedProp !== null) {
            for (var i = 0; i < formattedProp.events.length; i++) {
              const {
                _id,
                start,
                title,
                allDay,
                end,
                memo,
              } = formattedProp.events[i];
              formattedProp.events[i] = {
                id: _id,
                title: title,
                allDay: allDay,
                start: new Date(start),
                end: new Date(end),
                startString: start,
                endString: end,
                memo: memo,
              };
            }
          }
          this.setState(
            {
              currentSchedule: formattedProp,
            },
            () => console.log(this.state.currentSchedule)
          );
          break;
        case 2:
          console.log("name changed");
          console.log(this.state.currentSchedule.scheduleName);
          console.log(nextProps.schedule.schedule.scheduleName);
          this.setState((prevState) => ({
            currentSchedule: {
              ...prevState.currentSchedule,
              scheduleName: nextProps.schedule.schedule.scheduleName,
            },
          }));
          console.log(this.state.currentSchedule);
          // setTimeout(() => {
          //   console.log(this.state.currentSchedule.scheduleName);
          // }, 2000);
          break;
        case 3:
          const {
            _id,
            title,
            allDay,
            start,
            end,
            memo,
          } = nextProps.schedule.schedule.events[0];
          const newformattedEvent = {
            id: _id,
            title: title,
            allDay: allDay,
            start: new Date(start),
            end: new Date(end),
            startString: start,
            endString: end,
            memo: memo,
          };
          this.setState(
            (prevState) => ({
              currentSchedule: {
                ...prevState.currentSchedule,
                events: [
                  newformattedEvent,
                  ...prevState.currentSchedule.events,
                ],
              },
            }),
            () => console.log(this.state.currentSchedule)
          );
          break;
        case 5:
          return;
        default:
          return;
      }
    } else {
      //if schedule has been deleted (no longer exists) set component state to null
      // this.props.history.push("/dashboard");
      // this.setState({
      //   currentSchedule: null,
      // });
    }
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  changeName = () => {
    if (this.state.nameChange !== null) {
      let data = {
        name: this.state.nameChange,
      };
      console.log(this.state.nameChange);
      console.log(this.props.match.params.id);
      this.props.changeScheduleName(
        this.props.match.params.id,
        data,
        this.props.history
      );
    }
  };

  deleteEvent = (event_id) => {
    if (this.state.currentSchedule !== null) {
      this.props.deleteEvent(
        this.state.currentSchedule._id,
        event_id,
        this.props.history
      );
    }
  };

  verifyAccess = () => {
    this.props.addUserToSchedule(
      this.props.match.params.id,
      this.state.roomKeyChange
    );
  };

  deleteCurrentSchedule = () => {
    if (this.state.currentSchedule !== null) {
      console.log(this.state.currentSchedule._id);
      if (this.state.currentSchedule._id.length > 5) {
        this.props.deleteSchedule(
          this.state.currentSchedule._id,
          this.props.history
        );
      }
    }
  };

  /* start button bar conditional form trigger */

  onAddEventClick = () => {
    if (this.state.addEvent === true) {
      this.setState({
        addEvent: false,
        changeSchedName: false,
      });
    } else {
      this.setState({
        addEvent: true,
        changeSchedName: false,
      });
    }
  };

  toggleSelectedEvent = (e) => {
    console.log(e);
    const { id, title, allDay, start, memo, end } = e;
    var splitStartDateString = start.toString().split(" ").slice(0, 5);
    var splitEndDateString = end.toString().split(" ").slice(0, 5);
    console.log(splitEndDateString[4]);
    var formattedStartString = this.convertMilitaryToStandard(
      splitStartDateString[4]
    );
    var formattedEndString = this.convertMilitaryToStandard(
      splitEndDateString[4]
    );
    console.log(start);
    console.log(end);
    const newformattedEvent = {
      id: id,
      title: title,
      allDay: allDay,
      start: new Date(start),
      end: new Date(end),
      startString: formattedStartString,
      endString: formattedEndString,
      memo: memo,
    };
    if (this.state.eventDetailsOpen === false) {
      this.setState({
        selectedEvent: newformattedEvent,
        eventDetailsOpen: !this.state.eventDetailsOpen,
        /* edit modal prefill data */
        // editEventTitle: title,
        // editEventStart: start,
        // editEventEnd: end,
        // editEventAllDay: allDay,
        // editEventPrefill: newformattedEvent,
      });
    } else {
      this.setState({
        eventDetailsOpen: !this.state.eventDetailsOpen,
        selectedEvent: null,
        // editEventTitle: null,
        // editEventStart: null,
        // editEventEnd: null,
        // editEventAllDay: null,
        // editEventPrefill: null,
      });
    }
  };

  closeSelectedEvent = () => {
    this.setState({
      eventDetailsOpen: false,
      selectedEvent: null,
    });
  };

  deleteSelectedEvent = () => {
    //removes deleted event from frontend when triggered by a call inside the scope of this component
    if (this.state.currentSchedule !== null) {
      if (this.state.selectedEvent !== null) {
        if (
          window.confirm(
            "Are you sure you sure about that? This action cannot be undone"
          )
        ) {
          console.log(this.state.currentSchedule._id);
          console.log(this.state.selectedEvent.id);
          var selectedEventId = this.state.selectedEvent.id;
          this.props.deleteEvent(
            this.state.currentSchedule._id,
            this.state.selectedEvent.id,
            this.props.history
          );
          /* option 1, refetch schedule */
          // window.location.reload();

          /* option 2, filter out deleted event from frontend */
          var filteredArray = this.state.currentSchedule.events.filter(
            (event) => event.id !== selectedEventId
          );
          // console.log(filteredArray);
          this.setState((prevState) => ({
            currentSchedule: {
              // object that we want to update
              ...prevState.currentSchedule, // keep all other key-value pairs
              events: filteredArray, // update the value of specific key
            },
            selectedEvent: null,
            eventDetailsOpen: false,
          }));
        }
      }
    }
  };

  deleteTriggeredEvent = (deletedEventId) => {
    //removes deleted event from frontend when triggered by a call outside the scope of this component

    var filteredArray = this.state.currentSchedule.events.filter(
      (event) => event.id !== deletedEventId
    );
    this.setState((prevState) => ({
      currentSchedule: {
        // object that we want to update
        ...prevState.currentSchedule, // keep all other key-value pairs
        events: filteredArray, // update the value of specific key
      },
    }));
  };

  convertMilitaryToStandard = (dateString) => {
    var amOrPm = "am";
    var hoursMinutes = dateString.split(":").slice(0, 2);
    if (
      hoursMinutes[0].charAt(0) === "0" &&
      hoursMinutes[0].charAt(1) === "0"
    ) {
      //covers case 00
      hoursMinutes[0] = "12";
    } else if (
      hoursMinutes[0].charAt(0) === "0" &&
      hoursMinutes[0].charAt(1) !== "0"
    ) {
      //covers cases 01 to 09
      hoursMinutes[0] = hoursMinutes[0].replace("0", "");
    }
    //cases 10 to 11 are covered by default
    // else if (
    //   hoursMinutes[0].charAt(0) === "1" &&
    //   hoursMinutes[0].charAt(1) !== "2"
    // ) {
    //   //covers cases 01 to 09
    //   hoursMinutes[0] = "12";
    //   amOrPm = "pm";
    // }
    else if (parseInt(hoursMinutes[0]) > 12) {
      //covers cases 13 to 23
      //covers cases 13 to 23
      amOrPm = "pm";
      hoursMinutes[0] = (parseInt(hoursMinutes[0]) - 12).toString();
    }
    var standardTime = hoursMinutes[0] + ":" + hoursMinutes[1] + amOrPm;
    console.log(hoursMinutes);
    return standardTime;
  };

  onChangeScheduleNameClick = () => {
    if (this.state.changeSchedName === true) {
      this.setState({
        addEvent: false,
        changeSchedName: false,
      });
    } else {
      this.setState({
        addEvent: false,
        changeSchedName: true,
      });
    }
  };

  toggleEditEventModal = () => {
    if (
      this.state.editEventDetailsOpen === false &&
      this.state.eventDetailsOpen === true
    ) {
      this.setState({
        editEventDetailsOpen: true,
        eventDetailsOpen: false,
      });
    }
    if (this.state.editEventDetailsOpen === true) {
      this.setState({
        editEventDetailsOpen: false,
        eventDetailsOpen: false,
      });
    }
  };

  getUpdatedEventData(updatedEvent) {
    // do not forget to bind getUpdatedEventData in constructor
    if (this.state.currentSchedule !== null) {
      const { title, allDay, start, end, memo } = updatedEvent;
      for (var i = 0; i < this.state.currentSchedule.events.length; i++) {
        if (
          this.state.currentSchedule.events[i].id.toString() ===
          this.state.selectedEvent.id.toString()
        ) {
          this.state.currentSchedule.events[i].title = title;
          this.state.currentSchedule.events[i].memo = memo;
          this.state.currentSchedule.events[i].allDay = allDay;
          this.state.currentSchedule.events[i].start = new Date(start);
          this.state.currentSchedule.events[i].end = new Date(end);
          this.state.currentSchedule.events[i].startString = start;
          this.state.currentSchedule.events[i].endString = end;
          break;
        }
      }
      // console.log(currentSchedule);
    }
    this.setState({
      editEventDetailsOpen: false,
      eventDetailsOpen: false,
    });
    //window.location.reload();
  }

  setEventDetailsModal() {
    this.setState({
      editEventDetailsOpen: false,
      eventDetailsOpen: true,
    });
  }

  /* end button bar conditional form trigger */

  render() {
    return (
      <>
        {/* {this.props.schedule.loading && this.state.currentSchedule == null ? (
          //If loading and no schedule loaded into state, show spinner
          <div>
            <Spinner />
          </div>
        ) : ( */}
        <div className="calendar-container">
          {this.state.currentSchedule !== null ? (
            <>
              {/* start non-mobile display */}
              <div className="team-calendar-container">
                <h1 id="current-schedule-name">
                  {this.state.currentSchedule.scheduleName}
                </h1>
                {/* start schedule form select */}
                <div id="schedule-button-group">
                  <ButtonGroup
                    variant="contained"
                    color="primary"
                    aria-label="contained primary button group"
                  >
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      onClick={this.onAddEventClick}
                    >
                      Add Plan
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      color="primary"
                      onClick={this.onChangeScheduleNameClick}
                    >
                      Change Schedule Name
                    </Button>
                  </ButtonGroup>
                </div>
                {/* end schedule form select */}
                {/* start conditional form render */}
                {this.state.addEvent && (
                  <AddEvent scheduleId={this.state.currentSchedule._id} />
                )}
                {this.state.changeSchedName && (
                  <div id="change-schedule-name-container">
                    <TextField
                      id="outlined-basic"
                      label="Schedule Name"
                      name="nameChange"
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      block
                      onClick={this.changeName}
                    >
                      Change schedule name
                    </Button>
                  </div>
                )}
                {/* end conditional form render */}
                {/* start event/plan details modal */}
                {this.state.selectedEvent !== null && (
                  <>
                    <div id="event-dialog-container">
                      <Dialog
                        maxWidth="lg"
                        aria-labelledby="simple-dialog-title"
                        open={this.state.eventDetailsOpen}
                        id="event-dialog-container"
                      >
                        <div id="event-content-container">
                          <DialogTitle id="simple-dialog-title">
                            <h1>{this.state.selectedEvent.title}</h1>
                          </DialogTitle>
                          <List>
                            <ListItem>
                              Start Time: {this.state.selectedEvent.startString}
                            </ListItem>
                            <ListItem>
                              End Time: {this.state.selectedEvent.endString}
                            </ListItem>
                          </List>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            id="close-selected-event-button"
                            style={{ marginLeft: ".95rem" }}
                            block
                            onClick={this.toggleEditEventModal}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            id="close-selected-event-button"
                            style={{ marginLeft: ".95rem" }}
                            block
                            onClick={this.deleteSelectedEvent}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            id="close-selected-event-button"
                            style={{ marginLeft: ".95rem" }}
                            block
                            onClick={this.closeSelectedEvent}
                          >
                            Close
                          </Button>
                        </div>
                      </Dialog>
                    </div>

                    {this.state.editEventDetailsOpen && (
                      <div id="edit-event-dialog-container">
                        <Dialog
                          maxWidth="sm"
                          aria-labelledby="simple-dialog-title"
                          open={this.state.editEventDetailsOpen}
                          id="event-dialog-container"
                        >
                          <div id="event-content-container">
                            <DialogTitle id="simple-dialog-title">
                              <h1>Edit</h1>
                            </DialogTitle>
                            <List>
                              {/* <TextField
                                id="outlined-basic"
                                label="Schedule Name"
                                name="editEventTitle"
                                onChange={(e) => {
                                  this.handleChange(e);
                                }}
                              />

                              <Checkbox
                                checked={this.state.editEventAllDay}
                                color="primary"
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                                onClick={() =>
                                  this.setState({
                                    editEventAllDay: !this.state
                                      .editEventAllDay,
                                  })
                                }
                              />
                              {!this.state.editEventAllDay && (
                                <>
                                  <TextField
                                    id="outlined-basic"
                                    label="Schedule Name"
                                    name="editEventStart"
                                    value={this.state.editEventStart}
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                  <TextField
                                    id="outlined-basic"
                                    label="Schedule Name"
                                    name="editEventEnd"
                                    onChange={(e) => {
                                      this.handleChange(e);
                                    }}
                                  />
                                </>
                              )}
                              <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              id="close-selected-event-button"
                              style={{ marginLeft: ".95rem" }}
                              block
                              onClick={this.toggleEditEventModal}
                            >
                              Edit
                            </Button> */}
                              <EditEvent
                                scheduleId={this.state.currentSchedule._id}
                                eventId={this.state.selectedEvent.id}
                                editEventPrefill={this.state.selectedEvent}
                                sendData={this.getUpdatedEventData}
                                setEventDetailsModal={this.setEventDetailsModal}
                              />
                            </List>
                          </div>
                        </Dialog>
                      </div>
                    )}
                  </>
                )}
                {/* <Link to={`/schedule/${linkToSchedule}`}>{roomKey}</Link>
      <br /> */}
                {/* end event/plan details modal */}

                {/* start render display based on device size */}
                <div id="large-display-calendar-container">
                  <Calendar
                    localizer={localizer}
                    events={this.state.currentSchedule.events}
                    onSelectEvent={this.toggleSelectedEvent}
                    defaultView="week"
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500, marginBottom: "3rem" }}
                  />
                </div>

                {/* more info section for larger devices */}

                <ScheduleInfo
                  events={this.state.currentSchedule.events}
                  users={this.state.currentSchedule.users}
                  deleteEventFromDisplay={this.deleteTriggeredEvent}
                  scheduleId={this.state.currentSchedule._id}
                />
                {/* need to display your events, schedule id, users (w number of users) */}

                {/* events section for smaller devices */}
                <div id="events-list-container">
                  {this.state.currentSchedule.events.map(
                    (currentEvent, index) => (
                      <ScheduleTest
                        key={index}
                        currentIndex={index}
                        event={currentEvent}
                        deleteEventFromDisplay={this.deleteTriggeredEvent}
                        scheduleId={this.state.currentSchedule._id}
                        sendData={this.getUpdatedEventData}
                      />
                    )
                  )}
                </div>

                {/* end render display based on device size */}

                <div id="delete-schedule-container">
                  <Button
                    variant="contained"
                    type="button"
                    color="secondary"
                    size="medium"
                    onClick={() => this.deleteCurrentSchedule()}
                  >
                    Delete schedule
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div id="room-key-container">
                <div>
                  <LockIcon
                    color="primary"
                    fontSize={"large"}
                    style={{ marginTop: "1rem" }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Room Key"
                    name="roomKeyChange"
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                </div>
                <div>
                  <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    id="room-key-button"
                    onClick={this.verifyAccess}
                  >
                    Enter room key
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        {/* )} */}
      </>
    );
  }
}

Schedule.propTypes = {
  schedule: PropTypes.object.isRequired,
  getSchedule: PropTypes.func,
  changeScheduleName: PropTypes.func,
  addEvent: PropTypes.func,
  deleteEvent: PropTypes.func,
  auth: PropTypes.object,
  addUserToSchedule: PropTypes.func,
  deleteSchedule: PropTypes.func,
};

const mapStateToProps = (state) => ({
  schedule: state.schedule, //accessing item from main reducer
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getSchedule,
  changeScheduleName,
  addEvent,
  deleteEvent,
  addUserToSchedule,
  deleteSchedule,
})(withRouter(Schedule));
//connect takes in x and any actions that we would like to use as arguments
