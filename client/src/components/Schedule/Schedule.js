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
import { Redirect } from "react-router-dom";
import AddEvent from "./AddEvent";

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
      title: null,
      start: null,
      allDay: false,
      end: null,
      nameChange: null,
      roomKeyChange: null,
    };
  }

  componentDidMount() {
    this.props.getSchedule(this.props.match.params.id);
  }

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
      }
    }
    /* end schedule state comparison */

    //default case (no change)
    return 5;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.schedule.schedule === null) {
      //if no change in props
      console.log();
    }
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
            const { _id, start, title, allDay, end } = formattedProp.events[i];
            formattedProp.events[i] = {
              id: _id,
              title: title,
              allDay: allDay,
              start: new Date(start),
              end: new Date(end),
              startString: start,
              endString: end,
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
        this.setState((prevState) => ({
          currentSchedule: {
            ...prevState.currentSchedule,
            scheduleName: nextProps.schedule.schedule.scheduleName,
          },
        }));
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
        } = nextProps.schedule.schedule.events[0];
        const newformattedEvent = {
          id: _id,
          title: title,
          allDay: allDay,
          start: new Date(start),
          end: new Date(end),
          startString: start,
          endString: end,
        };
        this.setState(
          (prevState) => ({
            currentSchedule: {
              ...prevState.currentSchedule,
              events: [newformattedEvent, ...prevState.currentSchedule.events],
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
    // this.setState((prevState) => ({
    //   currentSchedule: {
    //     // object that we want to update
    //     ...prevState.currentSchedule, // keep all other key-value pairs
    //     scheduleName: nextProps.schedule.schedule.scheduleName, // update the value of specific key
    //   },
    // }));
    // var updatedEvents = nextProps.schedule.schedule.events;
    // var newEventsState = [];
    // updatedEvents.forEach((event) => {
    //   var updatedEvent = {
    //     id: event._id,
    //     title: event.title,
    //     allDay: event.allDay,
    //     // start: new Date(start),
    //     // end: new Date(end),
    //     startString: event.start,
    //     endString: event.end,
    //   };
    //   newEventsState.push(updatedEvent);
    //   console.log(newEventsState);
    // });
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
      this.props.changeScheduleName("5ec414365edbdb12971208d8", data);
    }
  };

  deleteEvent = (event_id) => {
    if (this.state.currentSchedule !== null) {
      this.props.deleteEvent(this.state.currentSchedule._id, event_id);
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
        this.props.deleteSchedule(this.state.currentSchedule._id);
      }
    }
  };

  render() {
    return (
      <>
        <div>
          <h1>My {this.state.brand}</h1>
          <p>
            It is a {this.state.color}
            {this.state.model}
            from {this.state.year}.
          </p>
          <input
            name="nameChange"
            onChange={(e) => {
              this.handleChange(e);
            }}
          />
          <button type="button" onClick={this.changeName}>
            Change schedule name
          </button>

          <br />

          <button
            type="button"
            onClick={() => this.deleteEvent("5ec5cbd4877f842b3c81a96d")}
          >
            Delete event from schedule
          </button>

          <br />

          <button type="button" onClick={() => this.deleteCurrentSchedule()}>
            Delete schedule
          </button>
        </div>

        <div className="calendar-container">
          {this.state.currentSchedule !== null ? (
            <>
              <h1>{this.state.currentSchedule.scheduleName}</h1>
              <Calendar
                localizer={localizer}
                events={this.state.currentSchedule.events}
                onSelectEvent={this.toggle}
                defaultView="week"
                startAccessor="start"
                endAccessor="end"
                style={{ height: 1000, marginBottom: "3rem" }}
              />
              <AddEvent scheduleId={this.state.currentSchedule._id} />
            </>
          ) : (
            <>
              <input
                name="roomKeyChange"
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />
              <button type="button" onClick={this.verifyAccess}>
                Enter room key
              </button>
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
})(Schedule);
//connect takes in x and any actions that we would like to use as arguments
