import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';
import '../../styles/CommentForm.css';

//MaterialUI imports
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const CommentForm = ({ postId, addComment, user }) => {
  const [text, setText] = useState('');

  const onCommentSubmit = () => {
    if (text !== '') {
      addComment(postId, { text });
      setText('');
    }
  };

  return (
    <div className="post-form-container">
      <Divider />
      <div className="post-form">
        <h4>{user.name}</h4>
        <TextField
          id="comment-form-text-field"
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

        <div className="comment-submit-button-container">
          <Button
            variant="contained"
            size="medium"
            color="primary"
            onClick={() => onCommentSubmit()}
            id="comment-submit-button"
          >
            <i class="far fa-paper-plane"></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
