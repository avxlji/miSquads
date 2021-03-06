const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  scheduleName: {
    type: String,
    required: true,
  },
  roomKey: {
    type: String,
    required: true,
  },
  admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false,
  },
  users: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      user_name: {
        type: String,
        required: false,
      },
    },
  ],
  events: [
    {
      title: {
        type: String,
        required: true,
      },
      memo: {
        type: String,
        required: false,
      },
      allDay: {
        type: Boolean,
        required: true,
      },
      start: {
        type: String,
        required: false,
      },
      end: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Schedule = mongoose.model('schedule', ScheduleSchema);

module.exports = Schedule;
