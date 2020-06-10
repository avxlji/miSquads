import React, { Component } from 'react';
import { Input, Label, Form } from 'reactstrap';
import { connect } from 'react-redux';
import { updateEvent } from '../../actions/schedule';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import '../../styles/EditEvent.css';
import moment from 'moment';

//materialUI imports
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class EditEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //   id: this.props.eventId,
      name: this.props.editEventPrefill.title,
      year: this.props.editEventPrefill.start.getFullYear().toString(),
      month: this.refactorDateToMonth(this.props.editEventPrefill.start),
      day: this.props.editEventPrefill.start.getDate(),
      starttime: this.props.editEventPrefill.startString,
      endtime: this.props.editEventPrefill.endString,
      submitting: false,
      error: false,
      scheduleId: this.props.scheduleId,
      memo: this.props.editEventPrefill.memo,
    };
  }

  /*This function is not currently in use */
  // refactorDateToAmPmTime = (time) => {
  //   var standardTime = moment(time, "ddd DD-MMM-YYYY, hh:mm A").format(
  //     "hh:mm A"
  //   );
  //   console.log(time);
  //   return "January";
  // };

  refactorDateToMonth = (time) => {
    var month = time.getMonth();
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    month = months[month];
    return month;
  };

  // refactorDateToYear = (time) => {
  //   var year = time.getFullYear();
  //   return year.toString();
  // };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onOptionChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  isValidDate(year, month, day) {
    const date = new Date(year, +month - 1, day);
    const isValidDate = Boolean(+date) && date.getDate() == day;
    return isValidDate;
  }

  isValidTime(arg) {
    var regularExpression = /^(1[0-2]|0?[1-9]):[0-5][0-9](am|pm)$/;

    var correctFormat = false;

    if (arg.toLowerCase().match(regularExpression)) {
      correctFormat = true;
    } else {
      correctFormat = false;
    }
    return correctFormat;
  }

  checkYearFormat(arg) {
    var yearFormat;
    if (arg.length == 4) {
      yearFormat = this.state.year.substring(0, 2);
      return yearFormat;
    } else {
      alert('Invalid Year Format');
    }
  }

  convertMonthToInt() {
    var selection = this.state.month.substring(0, 3).toLowerCase();
    var months = {
      //lookup table
      jan: '1',
      feb: '2',
      mar: '3',
      apr: '4',
      may: '5',
      jun: '6',
      jul: '7',
      aug: '8',
      sep: '9',
      oct: '10',
      nov: '11',
      dec: '12',
    };
    if (selection == 'jan') return months.jan;
    if (selection == 'feb') return months.feb;
    if (selection == 'mar') return months.mar;
    if (selection == 'apr') return months.apr;
    if (selection == 'may') return months.may;
    if (selection == 'jun') return months.jun;
    if (selection == 'jul') return months.jul;
    if (selection == 'aug') return months.aug;
    if (selection == 'sep') return months.sep;
    if (selection == 'oct') return months.oct;
    if (selection == 'nov') return months.nov;
    if (selection == 'dec') return months.dec;
  }

  startTimeBeforeEndTime() {
    var isValidated = false;

    var startTime = this.state.starttime.toLowerCase();
    var splitStartTime = startTime.split(':');
    var startTimeHours;
    var startTimeMinutes;

    var endTime = this.state.endtime.toLowerCase();
    var splitEndTimeHours = endTime.split(':');
    var endTimeHours;
    var endTimeMinutes;

    var timeOffset = 12;

    if (startTime.includes('pm')) {
      startTimeHours = parseInt(splitStartTime[0]) + timeOffset;
    } else {
      startTimeHours = parseInt(splitStartTime[0]);
    }

    startTimeMinutes = splitStartTime[1].replace('am', '');
    startTimeMinutes = splitStartTime[1].replace('pm', '');

    if (endTime.includes('pm')) {
      endTimeHours = parseInt(splitEndTimeHours[0]) + timeOffset;
    } else {
      endTimeHours = parseInt(splitEndTimeHours[0]);
    }

    endTimeMinutes = splitEndTimeHours[1].replace('am', '');
    endTimeMinutes = splitEndTimeHours[1].replace('pm', '');

    if (endTimeHours > startTimeHours) {
      isValidated = true;
    }

    if (endTimeHours == startTimeHours) {
      if (endTimeMinutes > startTimeMinutes) {
        isValidated = true;
      }
    }

    if (
      parseInt(splitEndTimeHours[0]) < 12 &&
      parseInt(splitStartTime[0]) == 12
    ) {
      if (
        splitEndTimeHours[1].includes('pm') &&
        splitStartTime[1].includes('pm')
      ) {
        isValidated = true;
      }
    }

    return isValidated;
  }

  convertToMilitaryTime = (time) => {
    // var hour;
    // var min;
    // var militaryTime;

    // time = time.toLowerCase();

    // var isPm = time.includes("pm");

    // var timeArray = time.split(":");

    // if (isPm) {
    //   hour = 12 + parseInt(timeArray[0], 10);
    //   min = timeArray[1].replace("pm", "");
    // } else {
    //   hour = parseInt(timeArray[0], 10);
    //   min = timeArray[1].replace("am", "");
    // }

    // militaryTime = hour.toString() + ":" + min + ":00";
    // console.log("military time: " + militaryTime);
    // return militaryTime;

    var militaryTime = moment(time, 'hh:mm a').format('HH:mm') + ':00';
    return militaryTime;
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.checkYearFormat(this.state.year) == '20') {
      if (
        this.isValidDate(
          this.state.year,
          this.convertMonthToInt(),
          this.state.day
        )
      ) {
        if (this.state.starttime) {
          if (this.isValidTime(this.state.starttime)) {
            if (this.state.endtime) {
              if (this.state.endtime !== '12:00am') {
                if (this.isValidTime(this.state.endtime)) {
                  if (this.startTimeBeforeEndTime()) {
                    if (this.state.name.includes('}}}')) {
                      let newName = this.state.name.replace('}}}', '');
                      this.setState({
                        name: newName,
                      });
                    }

                    //'April 06, 2020 06:00:00' Needed Date String Format

                    const startTime = this.convertToMilitaryTime(
                      this.state.starttime
                    );
                    const endTime = this.convertToMilitaryTime(
                      this.state.endtime
                    );

                    const formattedStartTime =
                      this.state.month +
                      ' ' +
                      this.state.day +
                      ', ' +
                      this.state.year +
                      ' ' +
                      startTime;

                    const formattedEndTime =
                      this.state.month +
                      ' ' +
                      this.state.day +
                      ', ' +
                      this.state.year +
                      ' ' +
                      endTime;

                    const newItem = {
                      title: this.state.name,
                      allDay: false,
                      start: formattedStartTime,
                      end: formattedEndTime,
                      memo: this.state.memo,
                    };
                    //add item via addEvent action
                    this.props.updateEvent(
                      this.props.scheduleId,
                      this.props.eventId,
                      newItem,
                      this.props.history
                    );

                    this.demoMethod(newItem);
                  } else {
                    alert(
                      'Please make sure your start time is before your end time'
                    );
                  }
                } else {
                  alert('Invalid end time format');
                }
              } else {
                alert('End time cannot be 12:00am');
              }
            } else {
              alert('Please enter a End Time');
            }
          } else {
            //3
            alert('Invalid start time format');
          }
        } else if (this.state.starttime == '' && this.state.endtime == '') {
          /* testing allDay feature */

          const formattedStartTime =
            this.state.month + ' ' + this.state.day + ', ' + this.state.year;

          const formattedEndTime =
            this.state.month + ' ' + this.state.day + ', ' + this.state.year;

          const newItem = {
            title: this.state.name,
            allDay: true,
            start: formattedStartTime,
            end: formattedEndTime,
          };

          //add item via updateEvent action
          this.props.updateEvent(
            this.props.scheduleId,
            this.props.eventId,
            newItem,
            this.props.history
          );

          this.demoMethod(newItem);

          //closes modal
          this.toggle();
        } else {
          alert('Invalid Time Entry');
        }
      }
    }
  };

  demoMethod(updatedEvent) {
    this.props.sendData(updatedEvent);
  }

  setEventDetailsModal() {
    this.props.setEventDetailsModal();
  }

  closeEditModals() {
    this.props.closeEditModals();
  }

  render() {
    var numDays = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
    ];
    var months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return (
      <div>
        {this.props.isAuthenticated ? (
          <div>
            {/* <button color="primary" onClick={this.refreshPage}>
              Refresh
            </button> */}

            <form onSubmit={this.onSubmit}>
              <div id="edit-event-container">
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Plan Name"
                    type="text"
                    name="name"
                    value={this.state.name}
                    placeholder="Ex. Doctors Appointment, Movie Date, etc..."
                    onChange={this.onChange}
                    required
                  />
                </div>
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Year"
                    type="text"
                    name="year"
                    placeholder="Ex. 20XX"
                    value={this.state.year}
                    onChange={this.onChange}
                    required
                  />
                </div>

                <div id="month-select-container">
                  {/* <label for="item">Month</label> */}
                  <Select
                    type="select"
                    name="month"
                    value={this.state.month}
                    onChange={this.onOptionChange}
                    required
                  >
                    {months.map((month) => {
                      return <MenuItem value={month}>{month}</MenuItem>;
                    })}
                  </Select>
                </div>

                <div id="day-select-container">
                  {/* <label for="item">Day</label> */}
                  <Select
                    type="select"
                    name="day"
                    value={this.state.day}
                    onChange={this.onOptionChange}
                    required
                  >
                    {numDays.map((num) => {
                      return <MenuItem value={num}>{num}</MenuItem>;
                    })}
                  </Select>
                </div>
                {/* 
              <label for="item" style={{ marginTop: ".2rem" }}>
                Leave Both the Start Time and End Time empty if the booking is a
                full day event
              </label> */}

                <div>
                  <TextField
                    id="outlined-basic"
                    label="Start Time"
                    type="text"
                    name="starttime"
                    placeholder="Ex. 8:00am, 9:30pm"
                    onChange={this.onChange}
                    required
                  />
                </div>

                <div id="yeet">
                  <TextField
                    id="outlined-basic"
                    label="End Time"
                    type="text"
                    name="endtime"
                    placeholder="Ex. 6am, 8pm, 9:30pm"
                    onChange={this.onChange}
                    required
                  />
                </div>

                <div>
                  <TextField
                    id="outlined-basic"
                    label="Additional Notes?"
                    multiline
                    rowsMax={4}
                    value={this.state.memo}
                    type="text"
                    name="memo"
                    placeholder="Ex. 6am, 8pm, 9:30pm"
                    onChange={this.onChange}
                    //required
                  />
                </div>

                <div id="edit-event-buttons-container">
                  {/* For devices smaller than an ipad */}
                  <Button
                    onClick={() => this.closeEditModals()}
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ backgroundColor: '#001f3f' }}
                    id="edit-event-close-button"
                    block
                  >
                    Close
                  </Button>

                  {/* For devices bigger than an ipad */}
                  <Button
                    onClick={() => this.setEventDetailsModal()}
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ backgroundColor: '#001f3f' }}
                    id="edit-event-go-back-button"
                    block
                  >
                    Go Back
                  </Button>

                  <Button
                    type="submit"
                    // onClick={() => this.demoMethod()}
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ backgroundColor: '#001f3f' }}
                    id="edit-event-update-button"
                    block
                  >
                    Update Event
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <h4 className="mb-3 ml-4">Please log in to manage schedule</h4>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  item: state.item, //named item because of item attribute in index.js reducer
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, { updateEvent })(withRouter(EditEvent));
