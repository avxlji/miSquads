import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import { addLike, removeLike, deletePost } from '../../actions/post';

const PostItem = ({
  auth,
  post: { _id, text, name, user, likes, comments, date },
  addLike,
  removeLike,
  deletePost,
  showActions,
}) => (
  <div class="post bg-white p-1 my-1">
    <div>
      {/* <img class="round-img" src={avatar} alt="" /> */}
      <h4>{name}</h4>
    </div>
    <div>
      <p class="my-1">{text}</p>
      <p class="post-date">
        Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
      </p>
      {showActions && (
        <Fragment>
          <button
            onClick={() => addLike(_id)}
            type="button"
            class="btn btn-light"
          >
            <i class="fas fa-thumbs-up"></i>{' '}
            <span>{likes.length > 0 && <span>{likes.length}</span>}</span>
          </button>
          Comments{' '}
          {comments.length > 0 && (
            <span className="comment-count">{comments.length}</span>
          )}
          {!auth.loading && user === auth.user._id && (
            <button
              onClick={() => deletePost(_id)}
              type="button"
              class="btn btn-danger"
            >
              <i class="fas fa-times"></i>
            </button>
          )}
        </Fragment>
      )}
    </div>
  </div>
);

PostItem.defaultProps = {
  showActions: true,
};

PostItem.propTypes = {
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  removeLike: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { addLike, removeLike, deletePost })(
  PostItem
);
