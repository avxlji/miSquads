import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import PostForm from "./PostForm";
import Spinner from '../layout/Spinner';
import { getPosts, addLike, removeLike, deletePost } from '../../actions/post';
import '../../styles/Posts.css';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import Paginate from './Paginate';

//Material UI import
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

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
  sendPageNumber,
}) => {
  useEffect(() => {
    getPosts(scheduleId);
  }, [getPosts]);

  //default to starting page
  const [currentPage, setCurrentPage] = useState(1);

  const [postsPerPage] = useState(5);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (event, value) => {
    sendPageNumber(value);
    setCurrentPage(value);
  };

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      {/* <PostForm /> */}
      <div id="posts">
        {currentPosts.map((post) => (
          <Paper elevation={2}>
            <div class="post" key={post._id}>
              {auth.user._id === post.user && (
                <button
                  id="delete-post-button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you'd like to delete this post? This cannot be undone"
                      )
                    )
                      deletePost(post._id);
                    // {
                    //   posts.length % 5 === 0 && setCurrentPage(currentPage - 1);
                    // }
                  }}
                >
                  <i class="fas fa-trash"></i>
                </button>
              )}
              <div class="post-header">
                {/* <img class="round-img" src={avatar} alt="" /> */}
                <h4 className="post-name">{post.name} says...</h4>
                <p class="post-date">
                  Posted on <Moment format="YYYY/MM/DD">{post.date}</Moment>
                </p>
              </div>
              <div class="post-body">
                <p class="my-1">{post.text}</p>
              </div>
              <div className="post-footer">
                <button
                  onClick={() => addLike(post._id)}
                  type="button"
                  className="like-button"
                >
                  <span className="number-of-likes">
                    <i class="fas fa-thumbs-up"></i>
                  </span>{' '}
                  <span className="number-of-likes-text">
                    {post.likes.length}
                  </span>
                </button>
                <div>
                  <i class="far fa-comments" id="number-of-comments"></i>
                  <span className="number-of-comments-text">
                    &nbsp;({post.comments.length})
                  </span>
                </div>
              </div>
              <CommentForm postId={post._id} user={auth.user}></CommentForm>
              <>
                {post.comments.map((comment) => (
                  <CommentItem comment={comment} postId={post._id} />
                ))}
              </>
            </div>
          </Paper>
        ))}
      </div>
      <Paginate
        postsPerPage={postsPerPage}
        totalPosts={posts.length}
        paginate={paginate}
      />
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
