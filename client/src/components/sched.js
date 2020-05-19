import React, { Component } from "react";
import { connect } from "react-redux";
import { getSchedule, changeScheduleName, addEvent } from "../actions/schedule";
import PropTypes from "prop-types"; //required as prop validation
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styles/Schedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

class sched extends Component {
  constructor(props) {
    //temp addition ...
    super(props);
    this.state = {
      dummyObject1: {
        scheduleName: "Test schedule 1",
        events: [
          {
            _id: "5ebe05ef1f5670631aaeaa9b",
            title: "7:40pm",
            start: "May 6, 2020 08:00:00",
            allDay: false,
            end: "May 6, 2020 18:00:00",
          },
          {
            _id: "5ebe05e51f5670631aaeaa9a",
            title: "test1",
            start: "today",
            allDay: true,
            end: "",
          },
        ],
      },
      currentSchedule: null,
      color: "",
    };
  }

  componentDidMount() {
    this.props.getSchedule("5ec31beeb4c0631d2cb890c8");
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
    var objectCase = this.evaluateObjectChange(
      this.props.schedule.schedule,
      nextProps.schedule.schedule
    );
    switch (objectCase) {
      case 1:
      case 4:
        var formattedProp = nextProps.schedule.schedule;

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

  changeName = () => {
    let data = {
      name: "yeet",
    };
    this.props.changeScheduleName("5ec31beeb4c0631d2cb890c8", data);
  };
  addEvent = () => {
    let data = {
      title: this.state.dummyObject1.events[0].title,
      start: this.state.dummyObject1.events[0].start,
      end: this.state.dummyObject1.events[0].end,
      allDay: this.state.dummyObject1.events[0].allDay,
    };
    console.log("add event called from component");
    this.props.addEvent("5ec31beeb4c0631d2cb890c8", data);
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
          <button type="button" onClick={this.changeName}>
            Change name
          </button>
          <button type="button" onClick={this.addEvent}>
            add event
          </button>
        </div>

        <div className="calendar-container">
          {this.state.currentSchedule !== null && (
            <Calendar
              localizer={localizer}
              events={this.state.currentSchedule.events}
              onSelectEvent={this.toggle}
              defaultView="week"
              startAccessor="start"
              endAccessor="end"
              style={{ height: 1000, marginBottom: "3rem" }}
            />
          )}
        </div>
      </>
    );
  }
}

sched.propTypes = {
  schedule: PropTypes.object.isRequired,
  getSchedule: PropTypes.func,
  changeScheduleName: PropTypes.func,
  addEvent: PropTypes.func,
};

const mapStateToProps = (state) => ({
  schedule: state.schedule, //accessing item from main reducer
});

export default connect(mapStateToProps, {
  getSchedule,
  changeScheduleName,
  addEvent,
})(sched);
//connect takes in x and any actions that we would like to use as arguments
