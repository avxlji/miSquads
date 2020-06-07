const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Schedule = require("../../models/Schedule");

// @ROUTE POST api/users
// @DESC register user
// @ACCESS public
router.post(
  "/",
  [
    //using express-validator to check data passed to backend
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],

  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email }); //checking to see if user exists  by email

      if (user) {
        //if user exists
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] }); //to keep consistent with line 25 errors.array()
      }

      // const avatar = gravatar.url(email, {
      //   s: "200",
      //   r: "pg",
      //   d: "mm",
      // });

      user = new User({
        //create a new instance of the user model
        name,
        email,
        // avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save(); //save to mongodb, returns a promise with user db info (including .id)

      const payload = {
        user: {
          id: user.id, //.id instead of _id due to mongoose abstraction
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //if no error, send token back to client
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route    DELETE api/users
// @desc     Delete user
// @access   Private
router.delete("/", auth, async (req, res) => {
  //since our route is private, we have access to the jwt token
  try {
    const user = await User.findById(req.user.id);
    const schedules = await Schedule.find({
      users: { $elemMatch: { user_id: req.user.id } },
    });
    console.log(schedules);
    console.log("-------------------------------------------------");

    for (var i = 0; i < schedules.length; i++) {
      var usersArray = [];
      usersArray = schedules[i].users;
      var abandonedSchedule = false;
      if (usersArray.length <= 1) abandonedSchedule = true; //TT if current schedule has 1 or less users
      // add argument to the filter function | element
      var alter = function (element) {
        // console.log(typeof element.schedule_id.toString());
        // console.log(element.schedule_id.toString());
        // console.log(typeof schedule._id.toString());
        // console.log(schedule._id.toString());

        return element.user_id.toString() !== req.user.id.toString(); //use the argument here.
      };
      var filter = usersArray.filter(alter);
      schedules[i].users = filter;
      schedules[i].save();
      if (abandonedSchedule) schedules[i].remove(); //TT remove schedule from db as no users have access to it
    }

    //Remove user
    await user.remove();
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
