import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';
import '../../styles/CommentForm.css';

//MaterialUI imports
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const CommentForm = ({ postId, addComment }) => {
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
        <TextField
          id="comment-form-text-field"
          label="Leave a Comment"
          multiline
          rowsMax={5}
          placeholder="Comment the post"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <Button
          variant="contained"
          size="medium"
          color="primary"
          onClick={onCommentSubmit}
          id="comment-button"
        >
          <i className="fas fa-times" />
        </Button>
      </div>
    </div>
  );
};

CommentForm.propTypes = {
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
