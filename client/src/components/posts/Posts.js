import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import PostForm from "./PostForm";
import Spinner from '../layout/Spinner';
import { getPosts, addLike, removeLike, deletePost } from '../../actions/post';
import '../../styles/Posts.css';

//Material UI import
import Paper from '@material-ui/core/Paper';

//Moment import
import Moment from 'react-moment';

const Posts = ({
  getPosts,
  post: { posts, loading },
  scheduleId,
  addLike,
  removeLike,
  deletePost,
  showActions,
  auth,
}) => {
  useEffect(() => {
    getPosts(scheduleId);
  }, [getPosts]);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {console.log(posts)}
      {/* <PostForm /> */}
      <div id="posts">
        {posts.map((post) => (
          <Paper elevation={2}>
            <div class="post" key={post._id}>
              <div class="post-header">
                {/* <img class="round-img" src={avatar} alt="" /> */}
                <h4 className="post-name">{post.name}</h4>
                <p class="post-date">
                  Posted on <Moment format="YYYY/MM/DD">{post.date}</Moment>
                </p>
              </div>
              <div class="post-body">
                <p class="my-1">{post.text}</p>
              </div>
              Comments{' '}
              {post.comments.length > 0 && (
                <span className="comment-count">{post.comments.length}</span>
              )}
              <button
                onClick={() => addLike(post._id)}
                type="button"
                class="btn btn-light"
              >
                <i class="fas fa-thumbs-up"></i>{' '}
                <span>
                  {post.likes.length > 0 && <span>{post.likes.length}</span>}
                </span>
              </button>
            </div>
          </Paper>
        ))}
      </div>
    </Fragment>
  );
};

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  showActions: true,

  auth: PropTypes.object.isRequired,
  removeLike: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPosts,
  addLike,
  removeLike,
  deletePost,
})(Posts);
