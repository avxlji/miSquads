const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const colors = require('colors');

const Poll = require('../../models/Poll');
const User = require('../../models/User');
const Schedule = require('../../models/Schedule');

// // @route    POST api/posts/:scheduleId
// // @desc     Create a post
// // @access   Private
router.post(
  '/:scheduleId',
  [auth, [check('pollName', 'The polls name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const schedule = await Schedule.findById(req.params.scheduleId);

      var polls = await Poll.find({ schedule: req.params.scheduleId });

      /* create posts limit */
      if (polls !== null) {
        var pollLimit = 9; /* 100 post limit per schedule */
        if ((await polls.length) > pollLimit) {
          await polls[0].remove();
        }
      }

      if (req.body.choices !== null && req.body.choices.length > 0) {
        var newPoll = await new Poll({
          pollName: req.body.pollName,
          createdBy: {
            name: user.name,
            user: user._id,
          },
          choices: [],
          schedule: schedule._id,
        });

        console.log(newPoll);

        for (var i = 0; i < req.body.choices.length; i++) {
          console.log(req.body.choices[i], newPoll.pollName);
          newPoll.choices.push({ choiceName: req.body.choices[i] });
        }

        const poll = await newPoll.save();

        res.json(poll);
      } else {
        throw Error('Please add in some choices');
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// // @route    GET api/posts/:scheduleId
// // @desc     Get all posts of a specific schedule
// // @access   Private
router.get('/:scheduleId', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.scheduleId);

    //check to see if the user making the request is apart of the schedule
    var verifiedUser = false;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id.toString()) {
        verifiedUser = true;
        break;
      }
    }

    if (!verifiedUser) {
      throw Error('Unauthorized user');
    }

    const polls = await Poll.find({ schedule: req.params.scheduleId }).sort({
      date: -1,
    });
    res.json(polls);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/posts/poll/:id
// @desc     Get poll by ID
// @access   Private
router.get('/poll/:id', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !poll) {
      // Check for ObjectId format and post
      return res.status(404).json({ msg: 'Poll not found' });
    }

    const schedule = await Schedule.findById(poll.schedule);

    //check to see if the user making the request is apart of the schedule
    var verifiedUser = false;
    var newVote = true;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id.toString()) {
        verifiedUser = true;
        break;
      }
    }

    if (!verifiedUser) {
      throw Error('Unauthorized user');
    }

    res.json(poll);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
});

// // @route    DELETE api/polls/:id
// // @desc     Delete a poll
// // @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !poll) {
      return res.status(404).json({ msg: 'Poll not found' });
    }

    // Check user
    if (poll.createdBy.user.toString() !== req.user.id) {
      //   return res.status(401).json({ msg: 'User not authorized' });
      throw Error('Unauthorized user');
    }

    await poll.remove();

    res.json({ msg: 'Poll removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/polls/vote/:pollId/:choiceId
// // @desc     Vote for a choice on a poll
// // @access   Private
router.put('/vote/:pollId/:choiceId', auth, async (req, res) => {
  //using put instead of post because we are updating the post
  try {
    const poll = await Poll.findById(req.params.pollId);

    const schedule = await Schedule.findById(poll.schedule);

    const user = await User.findById(req.user.id).select('-password');

    //check to see if the user making the request is apart of the schedule
    var verifiedUser = false;
    var choiceIndex = null;
    var removedChoiceId = null;
    var newVote = true;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id.toString()) {
        verifiedUser = true;
        break;
      }
    }

    if (!verifiedUser) {
      res.status(401).send('Unauthorized user');
    }

    console.log(poll);

    // loop through choices in poll
    for (var i = 0; i < poll.choices.length; i++) {
      if (poll.choices[i]._id.toString() === req.params.choiceId) {
        choiceIndex = i;
      }
      for (var j = 0; j < poll.choices[i].votes.length; j++) {
        // if user has already voted
        if (
          poll.choices[i].votes[j].user_id.toString() === req.user.id.toString()
        ) {
          // remove their vote
          removedChoiceId = poll.choices[i]._id;
          poll.choices[i].votes.splice(j, 1);
          console.log(poll.choices[i].votes);
          break;
        }
      }
    }

    if (
      choiceIndex !== null
      //   &&
      //   poll.choices[choiceIndex]._id.toString() !== removedChoiceId.toString()
    ) {
      //otherwise add their vote
      poll.choices[choiceIndex].votes.unshift({
        user_id: user._id,
        user_name: user.name,
      });
    }

    await poll.save();

    res.json(poll);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/polls/choice/:pollId/:choiceId
// // @desc     Change choice
// // @access   Private
router.put(
  '/choice/:pollId/:choiceName',
  [auth, [check('choiceName', 'A choice name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const poll = await Poll.findById(req.params.pollId);

      if (!poll) {
        throw Error('Poll not found');
      }

      console.log(req.params.choiceId);

      if (poll.createdBy.user.toString() === req.user.id.toString()) {
        console.log('2');
        for (var i = 0; i < poll.choices.length; i++) {
          console.log(poll.choices[i]._id, req.params.choiceId);
          if (
            poll.choices[i]._id.toString() === req.params.choiceId.toString()
          ) {
            console.log('3');
            poll.choices[i].choiceName = req.body.choiceName;
            break;
          }
        }
      } else {
        throw Error('Unauthorized user');
      }

      await poll.save();

      res.json(poll);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// // @route    DELETE api/posts/comment/:id/:comment_id
// // @desc     Delete comment
// // @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // Make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }

    //Check user authorization
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments
      .map((comment) => comment.id)
      .indexOf(req.params.comment_id);

    post.comments.splice(removeIndex, 1);

    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
