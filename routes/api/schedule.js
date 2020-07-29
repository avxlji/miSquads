const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const Schedule = require('../../models/Schedule');
const User = require('../../models/User');

// @route    GET api/schedule/:schedule_id
// @desc     Get schedule by id
// @access   Private
router.get('/:schedule_id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);

    if (!schedule) {
      return res.status(400).json({ msg: 'This schedule no longer exists' });
    }

    //check to see if the user making the request is apart of the schedule
    var verifiedUser = false;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        verifiedUser = true;
        break;
      }
    }

    if (verifiedUser) {
      res.json(schedule);
    } else {
      console.log('unverified');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/schedule/:schedule_id
// @desc     UPDATE schedule name by id
// @access   Private
// @FIX      throw error if user isn't authenticated with a custom message
router.put('/:schedule_id', auth, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.schedule_id);
    const users = await User.find({
      schedules: { $elemMatch: { schedule_id: schedule._id } },
    });

    //check to see if the user making the request is apart of the schedule
    var authenticatedUser = false;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    if (authenticatedUser) {
      // Update the schedule name in all of the users associated with the schedule_id
      for (var i = 0; i < users.length; i++) {
        for (var j = 0; j < users[i].schedules.length; j++) {
          if (
            users[i].schedules[j].schedule_id.toString() ===
            schedule._id.toString()
          ) {
            users[i].schedules[j].scheduleName = req.body.name;
            users[i].save();
            break;
          }
        }
      }
      //Directly update the schedules name
      schedule.scheduleName = req.body.name;
      schedule.save();
      res.json(schedule);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/schedule
// @desc     Create a schedule
// @access   Private
router.post(
  '/',
  [auth, [check('scheduleName', 'scheduleName is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      if (req.body.roomKey === null || req.body.roomKey.length === 0) {
        throw err;
      }
      const promptedUser = await User.findById(req.user.id);

      //create a new schedule and set the user sending the request as the first user
      const newSchedule = new Schedule({
        roomKey: req.body.roomKey,
        // adminId: req.user.id,
        scheduleName: req.body.scheduleName,
        users: [{ user_id: req.user.id, user_name: promptedUser.name }],
      });

      //upon creating the schedule, add the schedule to the user object
      newSchedule.save().then((schedule) => {
        User.findById(req.user.id).then((user) => {
          user.schedules.unshift({
            roomKey: req.body.roomKey,
            schedule_id: schedule._id,
            scheduleName: schedule.scheduleName,
          });
          user.save().then((updatedUser) => {
            // console.log(updatedUser);
          });
        });

        res.json(schedule);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/schedule/:schedule_id/:event_id
// @desc     Delete event from schedule
// @access   Private
router.delete('/:schedule_id/:event_id', auth, async (req, res) => {
  try {
    const foundSchedule = await Schedule.findById(req.params.schedule_id);

    //check if the user who made the request is in the scope of the schedule
    var authenticatedUser = false;
    for (var i = 0; i < foundSchedule.users.length; i++) {
      if (foundSchedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    //filter out the event if it matches the event_id passed as an argument
    if (authenticatedUser) {
      foundSchedule.events = foundSchedule.events.filter(
        (event) => event._id.toString() !== req.params.event_id
      );

      //save the updated schedule
      await foundSchedule.save();
      return res.status(200).json(foundSchedule);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

// @route    PUT api/schedule/event/:schedule_id
// @desc     Add schedule event
// @access   Private
router.put(
  '/event/:schedule_id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      // check("start", "Start is required").not().isEmpty(),
      check('allDay', 'All day is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //checks request for specified validation
    }
    const { title, memo, start, allDay, end } = req.body;

    const newEvent = {
      title,
      memo,
      start,
      allDay,
      end,
    };

    try {
      const schedule = await Schedule.findById(req.params.schedule_id);

      //check if the user who made the request is in the scope of the schedule
      var authenticatedUser = false;
      for (var i = 0; i < schedule.users.length; i++) {
        if (schedule.users[i].user_id.toString() === req.user.id) {
          authenticatedUser = true;
          break;
        }
      }

      //add new the new event to the schedule
      if (authenticatedUser) {
        schedule.events.unshift(newEvent); //add at the beginning of the array to keep the most recent elements at the start
        await schedule.save();
        res.json(schedule);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/schedule/:schedule_id
// @desc     Delete schedule
// @access   Private
router.delete('/:schedule_id', auth, async (req, res) => {
  //since our route is private, we have access to the jwt token
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const users = await User.find({
      schedules: { $elemMatch: { schedule_id: schedule._id } },
    });
    // console.log(users);
    // console.log("-------------------------------------------------");

    //check if the user who made the request is in the scope of the schedule
    var authenticatedUser = false;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    //remove the schedule passed as an argument from each user in the said schedule
    if (authenticatedUser) {
      for (var i = 0; i < users.length; i++) {
        var schedulesArray = [];
        schedulesArray = users[i].schedules;
        // add argument to the filter function | element
        var alter = function (element) {
          return (
            //use the argument here.
            element.schedule_id.toString() !== req.params.schedule_id.toString()
          );
        };
        var filter = schedulesArray.filter(alter);
        users[i].schedules = filter;
        users[i].save();
      }

      //Remove schedule
      await schedule.remove();
      res.json({ msg: 'Schedule deleted' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/schedule/check/:schedule_id
// @desc     Check roomKey match
// @access   Private
router.post('/check/:schedule_id', auth, async (req, res) => {
  var verifiedRoomKey = false;
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);

    //returns true if roomKey sent by user matches the roomKey of the schedule they'd like to join
    if (schedule.roomKey.toString() === req.body.roomKey.toString()) {
      verifiedRoomKey = true;
    }
    res.send({ verifiedRoomKey });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/schedule/:schedule_id/:roomKey
// @desc     Add user to schedule
// @access   Private
router.put('/:schedule_id/:roomKey', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const user = await User.findById(req.user.id);

    //if the schedule of interests roomKey matches the roomKey passed as an argument
    if (schedule.roomKey === req.params.roomKey) {
      //check to see if user is already apart of schedule users
      var uniqueUser = true;
      for (var i = 0; i < schedule.users.length; i++) {
        if (schedule.users[i].user_id.toString() === req.user.id) {
          uniqueUser = false;
          break;
        }
      }

      if (uniqueUser) {
        //add user to the schedule object (beginning of the users array in the schedule object)
        schedule.users.unshift({ user_id: req.user.id, user_name: user.name });

        //add schedule to the user object (beginning of the schedules array in the user object)
        user.schedules.unshift({
          roomKey: req.params.roomKey,
          schedule_id: schedule._id,
          scheduleName: schedule.scheduleName,
        });

        await schedule.save();
        await user.save();
        res.json(schedule);
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

// @route    PUT api/schedule/:schedule_id
// @desc     Remove user from schedule
// @access   Private
router.post('/:schedule_id', auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const promptedUser = await User.findById(req.user.id);

    for (var i = 0; i < schedule.users.length; i++) {
      // remove the user at the current index from the users array in the schedule object
      if (schedule.users[i].user_id.toString() === req.user.id) {
        schedule.users.splice(i, 1);

        //Remove the schedule from the db if the user leaving the schedule is the last user in the schedule
        if (schedule.users.length < 1) {
          await schedule.remove();
        }
        break;
      }
    }

    schedule.save().catch((err) => console.log(err.message));

    // look for schedule that the user just left in the schedules array within the user object and remove the schedule
    for (var i = 0; i < promptedUser.schedules.length; i++) {
      if (
        promptedUser.schedules[i].schedule_id.toString() ===
        schedule._id.toString()
      ) {
        promptedUser.schedules.splice(i, 1);
        break;
      }
    }

    //save updated user
    promptedUser.save().catch((err) => console.log(err.message));

    res.json({ msg: 'Departed squad' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/schedule/:schedule_id/:event_id
// @desc     UPDATE schedule event by id
// @access   Private
router.post('/:schedule_id/:event_id', auth, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.schedule_id);

    //check if user who made the request is in the scope of the schedule
    var authenticatedUser = false;
    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    //override existing event details with new event details
    if (authenticatedUser) {
      const { title, memo, start, allDay, end } = req.body;

      for (var i = 0; i < schedule.events.length; i++) {
        if (
          schedule.events[i]._id.toString() === req.params.event_id.toString()
        ) {
          schedule.events[i].title = title;
          schedule.events[i].memo = memo;
          schedule.events[i].start = start;
          schedule.events[i].end = end;
          schedule.events[i].allDay = allDay;
          break;
        }
      }
      schedule.save();
      res.json(schedule);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
