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
    var verifiedUser = true;
    // schedule.users.forEach((user) => {
    //   if (user.user_id.toString() === req.user.id.toString()) {
    //     verifiedUser = true;
    //   }
    // });
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
router.put("/:schedule_id", async (req, res) => {
  try {
    let schedule = await Schedule.findOneAndUpdate({
      scheduleName: req.body.name,
    });
    let updatedSchedule = await schedule;
    updatedSchedule.scheduleName = req.body.name;
    res.json(updatedSchedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/schedule/:roomKey
// @desc     Create a schedule
// @access   Private
router.post(
  "/:roomKey",
  [auth, [check("scheduleName", "scheduleName is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // const user = await User.findById(req.user.id).select("-password");
      if (req.params.roomKey == null || req.params.roomKey.length == 0) {
        throw err;
      }
      const newSchedule = new Schedule({
        //name, user and avatar are fetched from db using req token
        roomKey: req.params.roomKey,
        scheduleName: req.body.scheduleName,
        users: [{ user_id: req.user.id }],
      });
      newSchedule.save().then((schedule) => {
        User.findById(req.user.id).then((user) => {
          user.schedules.unshift({
            roomKey: req.params.roomKey,
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
router.delete("/:schedule_id/:event_id", auth, async (req, res) => {
  try {
    const foundSchedule = await Schedule.findById(req.params.schedule_id);

    // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
    foundSchedule.events = foundSchedule.events.filter(
      (event) => event._id.toString() !== req.params.event_id
    );

    await foundSchedule.save();
    return res.status(200).json(foundSchedule);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

// @route    PUT api/schedule/event/:schedule_id
// @desc     Add schedule event
// @access   Private
router.put(
  "/event/:schedule_id",
  [
    [
      check("title", "Title is required").not().isEmpty(),
      check("start", "Start is required").not().isEmpty(),
      check("allDay", "All day is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //checks request for specified validation
    }
    console.log("add event called in api");
    const { title, start, allDay, end } = req.body;

    const newEvent = {
      title,
      start,
      allDay,
      end,
    };

    try {
      const schedule = await Schedule.findById(req.params.schedule_id);
      schedule.events.unshift(newEvent); //add at the beginning of the array to keep the most recent elements at the start
      await schedule.save();
      res.json(schedule);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    DELETE api/schedule/:schedule_id
// @desc     Delete schedule
// @access   Private
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
    console.log(user);
    if (schedule.roomKey === req.params.roomKey) {
      if (!schedule.users.includes(req.user.id)) {
        schedule.users.unshift({ user_id: req.user.id }); //add at the beginning of the array to keep the most recent elements at the start
        user.schedules.unshift({
          roomKey: req.params.roomKey,
          schedule_id: schedule._id,
          scheduleName: schedule.scheduleName,
        }); //add at the beginning of the array to keep the most recent elements at the start
        await schedule.save();
        await user.save();
        res.json(schedule);
      }
    } else {
      throw err;
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

// // @route    GET api/profile/user/:user_id
// // @desc     Get profile by user id
// // @access   Public
// router.get("/user/:user_id", async (req, res) => {
//   //we are searching for profiles by the USER ID, not profile id
//   try {
//     const profile = await Profile.findOne({
//       user: req.params.user_id,
//     }).populate("user", ["name", "avatar"]); //get all profiles WITH name and avatar from each user

//     if (!profile) return res.status(400).json({ msg: "Profile not found" });

//     res.json(profile);
//   } catch (err) {
//     console.error(err);
//     if (err.message.includes("ObjectId")) {
//       //err.kind == "ObjectId" returns undefined so check entirety of message
//       return res.status(400).json({ msg: "Profile not found" });
//     }
//     res.status(500).send("Server Error");
//   }
// });

// // @route    DELETE api/profile
// // @desc     Delete profile, user & posts
// // @access   Private
// router.delete("/", auth, async (req, res) => {
//   //since our route is private, we have access to the jwt token
//   //we are searching for profiles by the USER ID, not profile id
//   try {
//     //Remove users posts

//     //Remove profile
//     await Profile.findOneAndRemove({ user: req.user.id }); //user id explicity defined in Profile model

//     //Remove user
//     await User.findOneAndRemove({ _id: req.user.id }); //_id implicity defined in mongodb

//     res.json({ msg: "User deleted" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// // @route    DELETE api/profile/experience/:exp_id
// // @desc     Delete experience from profile
// // @access   Private
// router.delete("/experience/:exp_id", auth, async (req, res) => {
//   try {
//     const foundProfile = await Profile.findOne({ user: req.user.id });

//     // Filter exprience array using _id (NOTE: _id is a BSON type needs to be converted to string)
//     foundProfile.experience = foundProfile.experience.filter(
//       (exp) => exp._id.toString() !== req.params.exp_id
//     );

//     await foundProfile.save();
//     return res.status(200).json(foundProfile);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });

// // @route    PUT api/profile/education
// // @desc     Add profile education
// // @access   Private
// router.put(
//   "/education",
//   [
//     auth,
//     [
//       check("school", "School is required").not().isEmpty(),
//       check("degree", "Degree is required").not().isEmpty(),
//       check("fieldofstudy", "Field of study is required").not().isEmpty(),
//       check("from", "From date is required").not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() }); //checks request for specified validation
//     }

//     const {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description,
//     } = req.body;

//     const newEdu = {
//       school,
//       degree,
//       fieldofstudy,
//       from,
//       to,
//       current,
//       description,
//     };

//     try {
//       const profile = await Profile.findOne({ user: req.user.id });
//       profile.education.unshift(newEdu); //add at the beginning of the array to keep the most recent elements at the start
//       await profile.save();
//       res.json(profile);
//     } catch (err) {
//       console.err(err.message);
//       res.status(500).send("Server error");
//     }
//   }
// );

// // @route    DELETE api/profile/education/:edu_id
// // @desc     Delete education from profile
// // @access   Private
// router.delete("/education/:edu_id", auth, async (req, res) => {
//   try {
//     const foundProfile = await Profile.findOne({ user: req.user.id });
//     const eduIds = foundProfile.education.map((edu) => edu._id.toString());
//     // if i dont add .toString() it returns this weird mongoose coreArray and the ids are somehow objects and it still deletes anyway even if you put /education/5
//     const removeIndex = eduIds.indexOf(req.params.edu_id);
//     if (removeIndex === -1) {
//       //if no id found
//       return res.status(500).json({ msg: "Server error" });
//     } else {
//       foundProfile.education.splice(removeIndex, 1);
//       await foundProfile.save();
//       return res.status(200).json(foundProfile);
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// });

// // @route    GET api/profile/github/:username
// // @desc     Get user repos from Github
// // @access   Public
// router.get("/github/:username", async (req, res) => {
//   try {
//     const uri = encodeURI(
//       `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
//     );
//     const headers = {
//       "user-agent": "node.js",
//       Authorization: `token ${process.env.GITHUB_TOKEN}`,
//     };

//     const gitHubResponse = await axios.get(uri, { headers });
//     return res.json(gitHubResponse.data);
//   } catch (err) {
//     console.error(err.message);
//     return res.status(404).json({ msg: "No Github profile found" });
//   }
// });

module.exports = router;

// //NEED TO ADD ROUTE TO UPDATE EXPERIENCE
