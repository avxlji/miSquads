const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  schedules: [
    {
      schedule_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "schedule",
      },
      scheduleName: {
        type: String,
      },
      roomKey: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("user", UserSchema);

module.exports = User;
