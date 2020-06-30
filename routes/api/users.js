const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Schedule = require('../../models/Schedule');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// @ROUTE POST api/users
// @DESC register user
// @ACCESS public
router.post(
  '/',
  [
    //using express-validator to check data passed to backend
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      //checking to see if user exists  by email
      let user = await User.findOne({ email });

      if (user) {
        //if user exists
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        //.id instead of _id due to mongoose abstraction
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //if no error, send token back to client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    DELETE api/users
// @desc     Delete user
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const schedules = await Schedule.find({
      users: { $elemMatch: { user_id: req.user.id } },
    });

    // const posts = await Post.find({user: req.user.id, schedule: schedules[i]._id});
    //   if (posts){
    //     for (var j = 0; j < posts.length; j++) {
    //       await posts[i].remove();
    //     }
    //   }

    //go through all schedules the user was apart of
    for (var i = 0; i < schedules.length; i++) {
      var usersArray = [];
      usersArray = schedules[i].users;
      var abandonedSchedule = false;
      if (usersArray.length <= 1) abandonedSchedule = true; //The schedule will be abandoned since this user is the last user within this schedule
      // add argument to the filter function | element
      var alter = function (element) {
        //use the argument here.
        return element.user_id.toString() !== req.user.id.toString();
      };

      //filter out user being deleted from usersArray in current schedule iteration
      var filter = usersArray.filter(alter);
      schedules[i].users = filter;
      schedules[i].save();
      if (abandonedSchedule) schedules[i].remove(); //TT remove schedule from db as no users have access to it
    }

    //Remove user
    await user.remove();
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
