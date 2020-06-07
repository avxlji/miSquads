const express = require("express");
const axios = require("axios");
const config = require("config");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
require("dotenv").config();
const Schedule = require("../../models/Schedule");
const User = require("../../models/User");

/* ADD AUTH MIDDLEWARE TO ROUTES AFTER TESTING */

// @route    GET api/schedule/:schedule_id
// @desc     Get schedule by id
// @access   Private
router.get("/:schedule_id", auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);

    if (!schedule) {
      return res.status(400).json({ msg: "This schedule no longer exists" });
    }
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
      console.log("unverified");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    PUT api/schedule/:schedule_id
// @desc     UPDATE schedule name by id
// @access   Private
// @FIX      throw error if user isn't authenticated with a custom message
router.put("/:schedule_id", auth, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.schedule_id);
    const users = await User.find({
      schedules: { $elemMatch: { schedule_id: schedule._id } },
    });

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
    res.status(500).send("Server Error");
  }
});

// @route    POST api/schedule/:roomKey
// @desc     Create a schedule
// @access   Private
router.post(
  "/",
  [auth, [check("scheduleName", "scheduleName is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const user = await User.findById(req.user.id).select("-password");
      if (req.body.roomKey === null || req.body.roomKey.length === 0) {
        throw err;
      }
      const promptedUser = await User.findById(req.user.id);
      const newSchedule = new Schedule({
        //name, user and avatar are fetched from db using req token
        roomKey: req.body.roomKey,
        scheduleName: req.body.scheduleName,
        users: [{ user_id: req.user.id, user_name: promptedUser.name }],
      });
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
      res.status(500).send("Server Error");
    }
  }
);

// @route    DELETE api/schedule/:schedule_id/:event_id
// @desc     Delete event from schedule
// @access   Private
// @FIX      check if user who made the request is in the scope of the schedule
router.delete("/:schedule_id/:event_id", auth, async (req, res) => {
  try {
    const foundSchedule = await Schedule.findById(req.params.schedule_id);

    var authenticatedUser = false;

    for (var i = 0; i < foundSchedule.users.length; i++) {
      if (foundSchedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    if (authenticatedUser) {
      // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
      foundSchedule.events = foundSchedule.events.filter(
        (event) => event._id.toString() !== req.params.event_id
      );

      await foundSchedule.save();
      return res.status(200).json(foundSchedule);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    PUT api/schedule/event/:schedule_id
// @desc     Add schedule event
// @access   Private
// @FIX      check if user who made the request is in the scope of the schedule
router.put(
  "/event/:schedule_id",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      // check("start", "Start is required").not().isEmpty(),
      check("allDay", "All day is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //checks request for specified validation
    }
    console.log("add event called in api");
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

      var authenticatedUser = false;

      for (var i = 0; i < schedule.users.length; i++) {
        if (schedule.users[i].user_id.toString() === req.user.id) {
          authenticatedUser = true;
          break;
        }
      }

      if (authenticatedUser) {
        schedule.events.unshift(newEvent); //add at the beginning of the array to keep the most recent elements at the start
        await schedule.save();
        res.json(schedule);
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    DELETE api/schedule/:schedule_id
// @desc     Delete schedule
// @access   Private
// @FIX      check if user who made the request is in the scope of the schedule
router.delete("/:schedule_id", auth, async (req, res) => {
  //since our route is private, we have access to the jwt token
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const users = await User.find({
      schedules: { $elemMatch: { schedule_id: schedule._id } },
    });
    console.log(users);
    console.log("-------------------------------------------------");

    var authenticatedUser = false;

    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

    if (authenticatedUser) {
      for (var i = 0; i < users.length; i++) {
        var schedulesArray = [];
        schedulesArray = users[i].schedules;
        // add argument to the filter function | element
        var alter = function (element) {
          // console.log(typeof element.schedule_id.toString());
          // console.log(element.schedule_id.toString());
          // console.log(typeof schedule._id.toString());
          // console.log(schedule._id.toString());
          return (
            element.schedule_id.toString() !== req.params.schedule_id.toString()
          ); //use the argument here.
        };
        var filter = schedulesArray.filter(alter);
        users[i].schedules = filter;
        users[i].save();
      }

      //Remove profile
      await schedule.remove();
      res.json({ msg: "Schedule deleted" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/schedule/check/:schedule_id
// @desc     Check roomKey match
// @access   Private
router.post("/check/:schedule_id", auth, async (req, res) => {
  var verifiedRoomKey = false;
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    if (schedule.roomKey.toString() === req.body.roomKey.toString()) {
      verifiedRoomKey = true;
    }
    console.log(verifiedRoomKey);
    res.send({ verifiedRoomKey });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route    GET api/schedule/:schedule_id/:roomKey
// @desc     Add user to schedule
// @access   Private
router.put("/:schedule_id/:roomKey", auth, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const user = await User.findById(req.user.id);

    if (schedule.roomKey === req.params.roomKey) {
      //check to see if user is already apart of schedule users
      var uniqueUser = true;
      for (var i = 0; i < schedule.users.length; i++) {
        if (schedule.users[i].user_id.toString() === req.user.id) {
          console.log(schedule.users[i].user_id.toString());
          console.log(req.user.id);
          console.log(req.params.schedule_id);
          uniqueUser = false;
          break;
        }
      }

      if (uniqueUser) {
        schedule.users.unshift({ user_id: req.user.id, user_name: user.name }); //add at the beginning of the array to keep the most recent elements at the start
        user.schedules.unshift({
          roomKey: req.params.roomKey,
          schedule_id: schedule._id,
          scheduleName: schedule.scheduleName,
        }); //add at the beginning of the array to keep the most recent elements at the start
        await schedule.save();
        await user.save();
        res.json(schedule);
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// @route    PUT api/schedule/removeuser/:schedule_id
// @desc     Remove user from schedule
// @access   Private
// @FIX      check if user who made the request is in the scope of the schedule
router.post("/:schedule_id", auth, async (req, res) => {
  console.log("reached");

  //since our route is private, we have access to the jwt token
  try {
    const schedule = await Schedule.findById(req.params.schedule_id);
    const promptedUser = await User.findById(req.user.id);

    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        schedule.users.splice(i, 1);
        if (schedule.users.length < 1) {
          //if user that was just removed from the schedule was the last user
          await schedule.remove();
        }
        break;
      }
    }

    schedule.save().catch((err) => console.log(err.message));

    for (var i = 0; i < promptedUser.schedules.length; i++) {
      if (
        promptedUser.schedules[i].schedule_id.toString() ===
        schedule._id.toString()
      ) {
        promptedUser.schedules.splice(i, 1);
        break;
      }
    }

    promptedUser.save().catch((err) => console.log(err.message));

    res.json({ msg: "Departed team" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// // @route    PUT api/schedule/:schedule_id
// // @desc     UPDATE schedule name by id
// // @access   Private
// router.put("/:schedule_id", auth, async (req, res) => {
//   try {
//     let schedule = await Schedule.findById(req.params.schedule_id);
//     const users = await User.find({
//       schedules: { $elemMatch: { schedule_id: schedule._id } },
//     });

//     // Update the schedule name in all of the users associated with the schedule_id
//     for (var i = 0; i < users.length; i++) {
//       for (var j = 0; j < users[i].schedules.length; j++) {
//         if (
//           users[i].schedules[j].schedule_id.toString() ===
//           schedule._id.toString()
//         ) {
//           users[i].schedules[j].scheduleName = req.body.name;
//           users[i].save();
//           break;
//         }
//       }
//     }
//     //Directly update the schedules name
//     schedule.scheduleName = req.body.name;
//     schedule.save();
//     res.json(schedule);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// @route    PUT api/schedule/:schedule_id/:event_id
// @desc     UPDATE schedule event by id
// @access   Private
// @FIX      check if user who made the request is in the scope of the schedule
router.post("/:schedule_id/:event_id", auth, async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.schedule_id);

    var authenticatedUser = false;

    for (var i = 0; i < schedule.users.length; i++) {
      if (schedule.users[i].user_id.toString() === req.user.id) {
        authenticatedUser = true;
        break;
      }
    }

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
    res.status(500).send("Server Error");
  }
});

module.exports = router;
