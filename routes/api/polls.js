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

        for (var i = 0; i < req.body.choices.length; i++) {
          // console.log(req.body.choices[i], newPoll.pollName);
          newPoll.choices.push({ choiceName: req.body.choices[i] });
        }

        const poll = await newPoll.save();

        res.json(poll);
      } else {
        throw Error('Please add in some choices');
      }
    } catch (err) {
      console.error(err.message.red);
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

    res.send('Poll removed');
  } catch (err) {
    console.error(err.message.red);

    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/polls/vote/:pollId/:choiceId
// // @desc     Vote for a choice on a poll (removes existing vote on other choices)
// // @access   Private
router.put('/vote/:pollId/:choiceId', auth, async (req, res) => {
  //using put instead of post because we are updating the post
  try {
    const poll = await Poll.findById(req.params.pollId);

    const schedule = await Schedule.findById(poll.schedule);

    const user = await User.findById(req.user.id).select('-password');

    // define vote verification variables
    var verifiedUser = false;
    var choiceIndex = null;
    var removedChoiceId = '';
    var newVote = true;

    //check to see if the user making the request is apart of the schedule
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id.toString()) {
        verifiedUser = true;
        break;
      }
    }

    if (!verifiedUser) {
      res.status(401).send('Unauthorized user');
    }

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
          // console.log(poll.choices[i].votes);
          break;
        }
      }
    }

    // if a valid choice exists and the vote wasn't just removed in the current call
    if (
      choiceIndex !== null &&
      poll.choices[choiceIndex]._id.toString() !== removedChoiceId.toString()
    ) {
      // console.log(poll.choices[choiceIndex]._id, removedChoiceId);

      //add their vote
      poll.choices[choiceIndex].votes.unshift({
        user_id: user._id,
        user_name: user.name,
      });
    }

    await poll.save();

    res.json(poll);
  } catch (err) {
    console.error(err.message.red);
    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/polls/choice/:pollId/:choiceId
// // @desc     Change choice
// // @access   Private
router.put(
  '/choice/:pollId/:choiceId',
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

      // console.log(req.params.choiceId);
      // console.log(req.params.pollId);

      // if the user who made the request is the same as the one who created the poll
      if (poll.createdBy.user.toString() === req.user.id.toString()) {
        //loop through choices and find choice passed in parameters
        for (var i = 0; i < poll.choices.length; i++) {
          // console.log(poll.choices[i]._id, req.params.choiceId);
          if (
            poll.choices[i]._id.toString() === req.params.choiceId.toString()
          ) {
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
      console.error(err.message.red);
      res.status(500).send('Server Error');
    }
  }
);

// // @route    PUT api/polls/choice/:pollId/:choiceId
// // @desc     Change poll name
// // @access   Private
router.put(
  '/:scheduleId/:pollId',
  [auth, [check('pollName', 'A poll name is required').not().isEmpty()]],
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

      if (poll.schedule.toString() !== req.params.scheduleId.toString()) {
        throw Error('Incorrect data sent, please try again later');
      }

      // if the user who made the request is the same as the one who created the poll
      if (poll.createdBy.user.toString() === req.user.id.toString()) {
        poll.pollName = req.body.pollName;
      } else {
        throw Error('Unauthorized user');
      }

      await poll.save();

      res.json(poll);
    } catch (err) {
      console.error(err.message.red);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
