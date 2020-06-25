//general imports
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addEvent } from '../../actions/schedule';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import '../../styles/AddEvent.css';
import moment from 'moment';

//materialUI imports
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class AddEvent extends Component {
  state = {
    name: '',
    year: '',
    month: 'January',
    day: '1',
    starttime: '',
    endtime: '',
    modal: false,
    submitting: false,
    error: false,
    memo: '',
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
    });
  };

  refreshPage = () => {
    window.location.reload(false); //reloads window
  };

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

  //checks to see if date is actually exists
  isValidDate(year, month, day) {
    const date = new Date(year, +month - 1, day);
    const isValidDate = Boolean(+date) && date.getDate() == day;
    return isValidDate;
  }

  //validates time format using regex
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

  //checks to see if year is 4 numbers and is of the format 20--
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
                    this.props.addEvent(
                      this.props.scheduleId,
                      newItem,
                      this.props.history
                    );

                    //function in Schedule.js
                    this.props.closeAndClearAddEvent();

                    //closes modal
                    this.toggle();
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
        } else if (this.state.starttime === '' && this.state.endtime === '') {
          const formattedStartTime =
            this.state.month + ' ' + this.state.day + ', ' + this.state.year;

          const formattedEndTime =
            this.state.month + ' ' + this.state.day + ', ' + this.state.year;

          const newItem = {
            title: this.state.name,
            allDay: true,
            start: formattedStartTime,
            end: formattedEndTime,
            memo: this.state.memo,
          };

          //add item via addEvent action
          this.props.addEvent(
            this.props.scheduleId,
            newItem,
            this.props.history
          );

          //function in Schedule.js
          this.props.closeAndClearAddEvent();

          //closes modal
          this.toggle();
        } else {
          alert('Invalid Time Entry');
        }
      } else {
        this.props.setAlert('invalid date', 'error');
      }
    }
  };

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
            <form onSubmit={this.onSubmit}>
              <div id="add-event-container">
                <div>
                  <TextField
                    id="outlined-basic"
                    label="Plan Name"
                    type="text"
                    name="name"
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
                    //required
                  />
                </div>

                <div>
                  <TextField
                    id="outlined-basic"
                    label="End Time"
                    type="text"
                    name="endtime"
                    placeholder="Ex. 6am, 8pm, 9:30pm"
                    onChange={this.onChange}
                    //required
                  />
                </div>

                <div>
                  <TextField
                    id="outlined-basic"
                    label="Additional Notes?"
                    multiline
                    rowsMax={4}
                    type="text"
                    name="memo"
                    placeholder="Ex. 6am, 8pm, 9:30pm"
                    onChange={this.onChange}
                    //required
                  />
                </div>

                <div>
                  <Button
                    type="submit"
                    variant="contained"
                    size="small"
                    color="primary"
                    style={{ backgroundColor: '#001f3f' }}
                    block
                  >
                    Add Plan
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

AddEvent.propTypes = {
  isAuthenticated: PropTypes.bool,
  isLoading: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
});

export default connect(mapStateToProps, { addEvent, setAlert })(
  withRouter(AddEvent)
);
