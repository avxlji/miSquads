const mongoose = require('mongoose');

/* THIS MODEL IS CURRENTLY NOT IN USE AND MAY BE IMPLEMENTED IN A FUTURE UPDATE */

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'schedule',
    required: true,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
    },
  ],
  comments: [
    {
      // One comment template
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
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

const Post = mongoose.model('post', PostSchema);
module.exports = Post;
