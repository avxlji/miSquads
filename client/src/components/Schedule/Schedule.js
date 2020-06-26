//general imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getSchedule,
  changeScheduleName,
  addEvent,
  deleteEvent,
  addUserToSchedule,
  deleteSchedule,
  removeUserFromSchedule,
} from '../../actions/schedule';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types'; //required as prop validation
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../../styles/Schedule.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Redirect, withRouter } from 'react-router-dom';
import AddEvent from './AddEvent';
import EditEvent from './EditEvent';
import Spinner from '../layout/Spinner';
import ScheduleEvent from './ScheduleEvent';
import ScheduleInfo from './ScheduleInfo';
import Posts from '../posts/Posts';
import axios from 'axios';

//import react reveal effects
import Fade from 'react-reveal/Fade';

//materialUI imports
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';

//materialUI imports
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from '@material-ui/icons/Lock';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PostForm from '../posts/PostForm';

const localizer = momentLocalizer(moment);

class Schedule extends Component {
  constructor(props) {
    //temp addition ...
    super(props);
    this.state = {
      // dummyObject1: {
      //   scheduleName: 'Test schedule 1',
      //   events: [
      //     {
      //       _id: '5ebe05ef1f5670631aaeaa9b',
      //       title: '7:40pm',
      //       start: 'May 6, 2020 08:00:00',
      //       allDay: false,
      //       end: 'May 6, 2020 18:00:00',
      //     },
      //     {
      //       _id: '5ebe05e51f5670631aaeaa9a',
      //       title: 'test1',
      //       start: 'today',
      //       allDay: true,
      //       end: '',
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
      incorrectEntry: false,
      centeredTabsValue: 1,
    };
    //bind function to current component context
    this.getUpdatedEventData = this.getUpdatedEventData.bind(this);
    this.setEventDetailsModal = this.setEventDetailsModal.bind(this);
    this.closeEditModals = this.closeEditModals.bind(this);
    this.deleteTriggeredEvent = this.deleteTriggeredEvent.bind(this);
    this.closeAndClearAddEvent = this.closeAndClearAddEvent.bind(this);
  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id);
  }

  //compares new data passed into application store with local component state
  evaluateObjectChange(oldProps, newProps) {
    if (oldProps === null) {
      return 1;
    }

    if (oldProps.scheduleName !== newProps.scheduleName) {
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

  //executes change in state based on what new data passed into component
  componentWillReceiveProps(nextProps) {
    // console.log(this.state.currentSchedule);
    // console.log(nextProps);

    //if incoming props has a value
    if (nextProps.schedule.schedule !== null) {
      var objectCase = this.evaluateObjectChange(
        //compare current props with new props
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
          this.setState({
            currentSchedule: formattedProp,
          });
          break;
        case 2:
          this.setState((prevState) => ({
            currentSchedule: {
              ...prevState.currentSchedule,
              scheduleName: nextProps.schedule.schedule.scheduleName,
            },
          }));
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
          this.setState((prevState) => ({
            currentSchedule: {
              ...prevState.currentSchedule,
              events: [newformattedEvent, ...prevState.currentSchedule.events],
            },
          }));
          break;
        case 5:
          return;
        default:
          return;
      }
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
      this.props.changeScheduleName(
        this.props.match.params.id,
        data,
        this.props.history
      );
      this.closeAndClearChangeScheduleName();
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

  //used to verify users joining by url/scheduleId
  verifyAccess = () => {
    axios
      .post(`/api/schedule/check/${this.props.match.params.id}`, {
        roomKey: this.state.roomKeyChange,
      })
      .then((res) => {
        var verifiedRoomKey = res.data.verifiedRoomKey;
        if (verifiedRoomKey) {
          this.props.addUserToSchedule(
            this.props.match.params.id,
            this.state.roomKeyChange
          );
        } else {
          this.setState(
            (prevState) => ({
              incorrectEntry: true,
            }),
            () => {
              setTimeout(() => {
                this.setState({
                  incorrectEntry: false,
                });
              }, 2000);
            }
          );
        }
      });
  };

  deleteCurrentSchedule = () => {
    if (this.state.currentSchedule !== null) {
      if (this.state.currentSchedule._id.length > 5) {
        this.props.deleteSchedule(
          this.state.currentSchedule._id,
          this.props.history
        );
      }
    }
  };

  leaveCurrentSchedule = () => {
    if (this.state.currentSchedule !== null) {
      if (this.state.currentSchedule._id.length > 5) {
        this.props.removeUserFromSchedule(
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
    const { id, title, allDay, start, memo, end } = e;
    var splitStartDateString = start.toString().split(' ').slice(0, 5);
    var splitEndDateString = end.toString().split(' ').slice(0, 5);
    // console.log(splitEndDateString[4]);
    var formattedStartString = this.convertMilitaryToStandard(
      splitStartDateString[4]
    );
    var formattedEndString = this.convertMilitaryToStandard(
      splitEndDateString[4]
    );

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
      });
    } else {
      this.setState({
        eventDetailsOpen: !this.state.eventDetailsOpen,
        selectedEvent: null,
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
    //removes deleted event from display
    if (this.state.currentSchedule !== null) {
      if (this.state.selectedEvent !== null) {
        if (
          window.confirm(
            'Are you sure you sure about that? This action cannot be undone'
          )
        ) {
          var selectedEventId = this.state.selectedEvent.id;
          this.props.deleteEvent(
            this.state.currentSchedule._id,
            this.state.selectedEvent.id,
            this.props.history
          );

          /* filter out deleted event */
          var filteredArray = this.state.currentSchedule.events.filter(
            (event) => event.id !== selectedEventId
          );
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

  /* Two different delete event triggers as we need to handle the delete event differently on desktop vs mobile */

  deleteTriggeredEvent = (deletedEventId) => {
    //removes deleted event from display
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

  /* Currently being tested */
  convertMilitaryToStandard = (dateString) => {
    var amOrPm = 'am';
    var hoursMinutes = dateString.split(':').slice(0, 2);
    if (
      hoursMinutes[0].charAt(0) === '0' &&
      hoursMinutes[0].charAt(1) === '0'
    ) {
      //covers case 00
      hoursMinutes[0] = '12';
    } else if (
      hoursMinutes[0].charAt(0) === '0' &&
      hoursMinutes[0].charAt(1) !== '0'
    ) {
      //covers cases 01 to 09
      hoursMinutes[0] = hoursMinutes[0].replace('0', '');
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
      amOrPm = 'pm';
      hoursMinutes[0] = (parseInt(hoursMinutes[0]) - 12).toString();
    }
    var standardTime = hoursMinutes[0] + ':' + hoursMinutes[1] + amOrPm;

    return standardTime;
  };

  convertMilitaryToStandardMoment = (time) => {
    var standardTime = moment(time, 'HH:mm').format('hh:mm a');

    if (standardTime.charAt(0) === '0') {
      standardTime = standardTime.substr(1);
      return standardTime;
    }
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

  closeEditModals() {
    this.setState({
      editEventDetailsOpen: false,
      eventDetailsOpen: false,
    });
  }

  getListedDateFromEvent = () => {
    var selectedStartDateArray = this.state.selectedEvent.start
      .toString()
      .split(' ');
    return (
      selectedStartDateArray[0] +
      ' ' +
      selectedStartDateArray[1] +
      ' ' +
      selectedStartDateArray[2] +
      ' ' +
      selectedStartDateArray[3]
    );
  };

  closeAndClearAddEvent = () => {
    this.setState({
      addEvent: false,
    });
  };

  closeAndClearChangeScheduleName = () => {
    this.setState({
      changeSchedName: false,
    });
  };

  /* end button bar conditional form trigger */

  /* conditional squad feature display */
  handleCenteredTabsChange = (event, newValue) => {
    console.log(newValue);
    this.setState({
      centeredTabsValue: newValue,
    });
  };

  render() {
    return (
      <>
        <div className="calendar-container">
          {this.state.currentSchedule !== null ? (
            <>
              {/* start non-mobile display */}
              <div className="team-calendar-container">
                <Fade duration="500">
                  {' '}
                  {/* Fade 1 */}
                  <h1 id="current-schedule-name">
                    {this.state.currentSchedule.scheduleName}
                  </h1>
                  {/* start squad select menu */}
                  <Paper>
                    <Tabs
                      value={this.state.centeredTabsValue}
                      onChange={this.handleCenteredTabsChange}
                      indicatorColor="primary"
                      id="centerd-tabs"
                      centered
                    >
                      <Tab label="Schedule" />
                      <Tab label="Posts" />
                      <Tab label="Polls" />
                    </Tabs>
                  </Paper>
                </Fade>
                {/* end squad select menu */}

                {this.state.centeredTabsValue === 0 && (
                  <>
                    {/* start schedule form select */}
                    <Fade>
                      <div id="schedule-button-group">
                        <ButtonGroup
                          variant="contained"
                          color="primary"
                          aria-label="contained primary button group"
                          id="lg-schedule-buttons-group"
                          style={{ backgroundColor: '#001f3f' }}
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
                            Change Squad Name
                          </Button>
                        </ButtonGroup>
                      </div>
                    </Fade>
                    {/* end schedule form select */}
                    {/* start conditional form render */}
                    {this.state.addEvent && (
                      <Fade duration="400">
                        <AddEvent
                          scheduleId={this.state.currentSchedule._id}
                          closeAndClearAddEvent={this.closeAndClearAddEvent}
                        />
                      </Fade>
                    )}
                    {this.state.changeSchedName && (
                      <Fade duration="400">
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
                            id="change-schedule-name-button"
                            block
                            onClick={this.changeName}
                            style={{ backgroundColor: '#001f3f' }}
                          >
                            Change squad name
                          </Button>
                        </div>
                      </Fade>
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
                                {this.state.selectedEvent.allDay ? (
                                  <ListItem>This event runs all day</ListItem>
                                ) : (
                                  <>
                                    <ListItem>
                                      Start Time:{' '}
                                      {this.convertMilitaryToStandardMoment(
                                        this.state.selectedEvent.start
                                      )}
                                    </ListItem>
                                    <ListItem>
                                      End Time:{' '}
                                      {this.convertMilitaryToStandardMoment(
                                        this.state.selectedEvent.end
                                      )}
                                    </ListItem>
                                  </>
                                )}
                                <ListItem>
                                  Plan date: {this.getListedDateFromEvent()}
                                </ListItem>
                                <ListItem>
                                  {this.state.selectedEvent.memo}
                                </ListItem>
                              </List>
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                id="close-selected-event-button"
                                style={{
                                  marginLeft: '.95rem',
                                  backgroundColor: '#001f3f',
                                }}
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
                                style={{
                                  marginLeft: '.95rem',
                                  backgroundColor: '#001f3f',
                                }}
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
                                style={{
                                  marginLeft: '.95rem',
                                  backgroundColor: '#001f3f',
                                }}
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
                                  <EditEvent
                                    scheduleId={this.state.currentSchedule._id}
                                    eventId={this.state.selectedEvent.id}
                                    editEventPrefill={this.state.selectedEvent}
                                    sendData={this.getUpdatedEventData}
                                    setEventDetailsModal={
                                      this.setEventDetailsModal
                                    }
                                    closeEditModals={this.closeEditModals}
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
                    <Fade duration="500">
                      {' '}
                      {/* Fade 2 */}
                      <div id="large-display-calendar-container">
                        <Calendar
                          localizer={localizer}
                          events={this.state.currentSchedule.events}
                          onSelectEvent={this.toggleSelectedEvent}
                          defaultView="week"
                          startAccessor="start"
                          endAccessor="end"
                          style={{ height: 500, marginBottom: '3rem' }}
                        />
                      </div>
                    </Fade>

                    {/* more info section for larger devices */}

                    {/* need to display your events, schedule id, users (w number of users) */}

                    {/* events section for smaller devices */}
                    <Fade duration="500">
                      {' '}
                      {/* Fade 3 */}
                      <div id="events-list-container">
                        <h3 id="mobile-your-plans-header">Your Plans</h3>
                        {this.state.currentSchedule.events.length > 0 ? (
                          <div id="events-list-content">
                            {this.state.currentSchedule.events.map(
                              (currentEvent, index) => (
                                <ScheduleEvent
                                  key={index}
                                  currentIndex={index}
                                  event={currentEvent}
                                  deleteEventFromDisplay={
                                    this.deleteTriggeredEvent
                                  }
                                  scheduleId={this.state.currentSchedule._id}
                                  sendData={this.getUpdatedEventData}
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <p id="mobile-your-plans-alt">
                            Your squad hasn't scheduled any events yet
                          </p>
                        )}
                      </div>
                    </Fade>
                    {/* end render display based on device size */}

                    <Fade duration="500">
                      {' '}
                      {/* Fade 4 */}
                      <div id="schedule-info-accordion">
                        <h3 id="mobile-schedule-info-header">Schedule info</h3>
                        <div id="schedule-info-content">
                          {/* stops displaying events as an attached component on smaller devices */}
                          <ScheduleInfo
                            events={this.state.currentSchedule.events}
                            users={this.state.currentSchedule.users}
                            deleteEventFromDisplay={this.deleteTriggeredEvent}
                            scheduleId={this.state.currentSchedule._id}
                            roomKey={this.state.currentSchedule.roomKey}
                          />
                        </div>
                      </div>
                    </Fade>
                  </>
                )}

                {this.state.centeredTabsValue === 1 && (
                  <>
                    <PostForm
                      user={this.props.auth.user}
                      scheduleId={this.state.currentSchedule._id}
                    ></PostForm>
                    {this.state.currentSchedule !== null && (
                      <Posts scheduleId={this.state.currentSchedule._id} />
                    )}
                  </>
                )}

                {this.state.centeredTabsValue === 2 && <p>polls</p>}

                <Fade duration="500">
                  {' '}
                  {/* Fade 5 */}
                  <div id="schedule-end-buttons-container">
                    <div id="delete-schedule-container">
                      <Button
                        variant="contained"
                        type="button"
                        color="secondary"
                        size="medium"
                        onClick={() => this.deleteCurrentSchedule()}
                        id="delete-schedule-button"
                      >
                        Delete schedule
                      </Button>
                    </div>

                    <div id="leave-schedule-container">
                      <Button
                        variant="contained"
                        type="button"
                        color="secondary"
                        size="medium"
                        id="leave-schedule-button"
                        onClick={() => this.leaveCurrentSchedule()}
                      >
                        Leave schedule
                      </Button>
                    </div>
                  </div>
                </Fade>
              </div>
            </>
          ) : (
            <>
              <div id="room-key-container">
                <div>
                  <LockIcon
                    color="primary"
                    fontSize={'large'}
                    style={{ marginTop: '1rem', color: '#001f3f' }}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Room Key"
                    name="roomKeyChange"
                    helperText={this.state.incorrectEntry && 'Incorrect entry'}
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
                    style={{ backgroundColor: '#001f3f' }}
                  >
                    Enter room key
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
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
  setAlert: PropTypes.func,
  removeUserFromSchedule: PropTypes.func,
};

const mapStateToProps = (state) => ({
  schedule: state.schedule,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getSchedule,
  changeScheduleName,
  addEvent,
  deleteEvent,
  addUserToSchedule,
  deleteSchedule,
  setAlert,
  removeUserFromSchedule,
})(withRouter(Schedule));
