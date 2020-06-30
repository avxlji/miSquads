import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteComment } from '../../actions/post';
import '../../styles/CommentItem.css';

//Material UI import
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const CommentItem = ({ comment, postId, auth, deleteComment }) => {
  return (
    <div className="comment-container">
      <Divider />
      <div className="comment-content-container">
        <div className="comment-header">
          <h4>{comment.name} replied...</h4>
          <p>
            Posted on <Moment format="YYYY/MM/DD">{comment.date}</Moment>
          </p>
        </div>
        <div className="comment-body">
          <p>{comment.text}</p>
        </div>
        <div className="comment-button-container">
          {!auth.loading && comment.user === auth.user._id && (
            <Button
              variant="contained"
              size="medium"
              color="primary"
              onClick={() => {
                if (
                  window.confirm(
                    'Are you sure you would like to delete this comment? This cannot be undone'
                  )
                ) {
                  deleteComment(postId, comment._id);
                }
              }}
              id="comment-button"
            >
              <i className="fas fa-times" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);
