const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  pollName: {
    type: String,
    required: true,
  },
  createdBy: {
    name: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'schedule',
    required: true,
  },
  choices: [
    {
      choiceName: {
        type: String,
      },
      votes: [
        {
          user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
          },
          user_name: {
            type: String,
          },
        },
      ],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

const Poll = mongoose.model('poll', PollSchema);

module.exports = Poll;
