import React, { Component } from "react";
// import {
//   Container,
//   ListGroup,
//   ListGroupItem,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { getSchedule } from "../actions/schedule";
import PropTypes from "prop-types"; //required as prop validation
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
import "../styles/Schedule.css";

class Schedule extends Component {
  constructor(props) {
    //temp addition ...
    super(props);
    this.state = {
      events: [
        /*       {
                allDay: true,
                start: new Date('April 6, 2020'),
                end: new Date('April 6, 2020'),
                title: 'DummyData1',
                startString: 'April 6, 2020',
                endString: 'April 6, 2020'
            },

           {
                    allDay: false,
                    start: new Date('April 6, 2020 08:00:00'),
                    end: new Date('April 6, 2020 18:00:00'),
                    title: 'DummyData1',
                    startString: 'April 6, 2020 08:00:00',
                    endString: 'April 6, 2020 18:00:00'
                },
                     {
                         allDay: false,
                         start: new Date('April 06, 2020 06:00:00'),
                         end: new Date('April 06, 2020 20:00:00'),
                         title: 'DummyData2',
                     }, */
      ],
      selectedEvent: {},
      dummyObject1: {
        scheduleName: "Test schedule 1",
        events: [
          {
            _id: "5ebe05ef1f5670631aaeaa9b",
            title: "test2",
            start: "today",
            allDay: true,
            end: "",
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
      dummyObject2: {
        scheduleName: "Test schedule 1",
        events: [
          {
            _id: "5ebe05ef1f5670631aaeaa9b",
            title: "test2",
            start: "today",
            allDay: true,
            end: "",
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
      color: "red",
    };
  }

  toggle = (e) => {
    if (this.state.modal === false) {
      this.setState({
        selectedEvent: e,
      });
    }

    console.log(this.state.selectedEvent);

    this.setState({
      modal: !this.state.modal,
    });
  };

  componentDidMount() {
    console.log("Printing from shopping list component did mount");
    this.props.getSchedule("5ebe05be1f5670631aaeaa98");
  }

  onDeleteClick = (_id) => {
    this.props.deleteItem(_id);
  };

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
    if (oldProps.events.length == newProps.events.length) {
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

  containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    var objectCase = this.evaluateObjectChange(
      this.props.schedule.schedule,
      nextProps.schedule.schedule
    );
    if (objectCase === 1) {
      console.log(this.state.currentSchedule);
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

  // componentWillReceiveProps(nextProps) {
  //     //invoke function with updated store
  //     //this.foo(nextProps)
  //     if ((this.objectsAreSame(this.props.schedule.schedule, nextProps.schedule.schedule)) == false) {
  //         console.log(this.props.schedule.schedule); // prevProps
  //         console.log(nextProps.schedule.schedule); // currentProps after updating the store

  //         if (nextProps.schedule.schedule.length >= this.props.schedule.schedule.length) {

  //             const { schedule } = nextProps.schedule;
  //             var objectAlreadyInState = false;

  //             // items.map(({ _id, title, allDay, start, end }) => {

  //             //     const newItem = {
  //             //         id: _id,
  //             //         title: title,
  //             //         allDay: allDay,
  //             //         start: new Date(start),
  //             //         end: new Date(end),
  //             //         startString: start,
  //             //         endString: end
  //             //     }

  //             //     for (let i = 0; i < this.state.events.length; i++) {
  //             //         //console.log(this.state.events[i].endString)
  //             //         //console.log(newItem.endString)
  //             //         if ((newItem.endString === this.state.events[i].endString) &&
  //             //             (newItem.startString === this.state.events[i].startString) && (newItem.title === this.state.events[i].title)) {
  //             //             //console.log('reached)')
  //             //             objectAlreadyInState = true;

  //             //         }
  //             //     }

  //             //     if (objectAlreadyInState === false) {
  //             //         this.setState(prevState => ({
  //             //             events: [newItem, ...prevState.events]
  //             //         }))
  //             //     }

  //             // })
  //         }

  //         else {
  //             window.location.reload(false); //reloads window when booking is deleted
  //         }

  //     }

  // }
  changeColor = () => {
    this.setState({ color: "blue" });
  };
  render() {
    return (
      <>
        Schedule
        <button type="button" onClick={this.changeColor}>
          Change color
        </button>
        {this.state.color}
        {/* {this.props.isAuthenticated ?
                  <div className='calendar-container'>
                      <Calendar
                          localizer={localizer}
                          events={this.state.events}
                          onSelectEvent={this.toggle}
                          defaultView='week'
                          startAccessor="start"
                          className='calendar'
                          endAccessor="end"
                          style={{ height: 500, marginBottom: '3rem' }}
                      />

                      <Modal isOpen={this.state.modal} toggle={this.toggle}>
                          <ModalHeader toggle={this.toggle}>{this.state.selectedEvent.title}</ModalHeader>

                          {this.state.selectedEvent.allDay == true ?
                              <ModalBody>
                                  This event is scheduled to run all day on {this.state.selectedEvent.startString + ' '}.
                      </ModalBody> :


                              <ModalBody>
                                  This event is scheduled to start at {this.state.selectedEvent.startString + ' '}
                       and end at {this.state.selectedEvent.endString}. Please try to be at the meeting
                      10-15 minutes before hand.
                      </ModalBody>

                          }
                          <ModalFooter>
                              <Button color="primary" onClick={this.toggle}>Okay</Button>{' '}
                          </ModalFooter>
                      </Modal>
                  </div>
                  : ''} */}
      </>
    );
  }
}

Schedule.propTypes = {
  schedule: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  schedule: state.schedule, //accessing item from main reducer
});

export default connect(mapStateToProps, { getSchedule })(Schedule);
//connect takes in x and any actions that we would like to use as arguments
