import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';
import '../../styles/PostForm.css';

//MaterialUI imports
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const PostForm = ({ scheduleId, addPost, user }) => {
  const [text, setText] = useState('');

  const onPostSubmit = () => {
    if (text !== '') {
      addPost({ text }, scheduleId);
      setText('');
    }
  };

  return (
    <div id="create-post-form-container">
      {/* <Divider /> */}
      <Divider />
      <div id="create-post-form">
        <h4>Create post</h4>
        <TextField
          id="create-post-text-field"
          label="Leave a Comment"
          multiline
          rowsMax={5}
          placeholder="Comment the post"
          value={text}
          fullWidth="true"
          onChange={(e) => setText(e.target.value)}
          required
        />
        <br />

        <div id="create-post-button-container">
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => onPostSubmit()}
            id="comment-submit-button"
          >
            <i class="far fa-paper-plane"></i>
          </Button>
        </div>
        {/* <Divider /> */}
      </div>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);
