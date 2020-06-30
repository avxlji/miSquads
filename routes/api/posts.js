const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');
const Schedule = require('../../models/Schedule');

// // @route    POST api/posts/:scheduleId
// // @desc     Create a post
// // @access   Private
router.post(
  '/:scheduleId',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const schedule = await Schedule.findById(req.params.scheduleId);

      var posts = await Post.find({ schedule: req.params.scheduleId });

      /* create posts limit */
      var postLimit = 99; /* 100 post limit per schedule */
      if ((await posts.length) > postLimit) {
        await posts[0].remove();
      }

      const newPost = new Post({
        //name, user and avatar are fetched from db using req token
        text: req.body.text,
        name: user.name,
        user: req.user.id,
        schedule: schedule._id,
      });

      const post = await newPost.save();

      res.json(post);
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
    const posts = await Post.find({ schedule: req.params.scheduleId }).sort({
      date: -1,
    });
    res.json(posts);
  } catch (err) {
    console.err(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/posts/post/:id
// @desc     Get post by ID
// @access   Private
router.get('/post/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    res.json(post);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// // @route    DELETE api/posts/:id
// // @desc     Delete a post
// // @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check for ObjectId format and post
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await post.remove();

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/posts/like/:id
// // @desc     Like a post
// // @access   Private
router.put('/like/:id', auth, async (req, res) => {
  //using put instead of post because we are updating the post
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked, unlike the post
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      // Get remove index
      const removeIndex = post.likes
        .map((like) => like.user.toString())
        .indexOf(req.user.id);

      //remove like at targeted index
      post.likes.splice(removeIndex, 1);

      //save updated post
      await post.save();

      return res.status(200).json(post.likes);
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    PUT api/posts/unlike/:id
// // @desc     Unlike a post
// // @access   Private
router.put('/unlike/:id', auth, async (req, res) => {
  //using put instead of post because we are updating the post
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post hasn't been liked yet" });
    }

    // Get remove index
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    //remove like at targeted index
    post.likes.splice(removeIndex, 1);

    //save updated post
    await post.save();

    //return likes array
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// // @route    POST api/posts/comment/:id
// // @desc     Comment on a post
// // @access   Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
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
