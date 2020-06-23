import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };
    case GET_POST:
      return {
        ...state,
        post: payload,
        loading: false,
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter((post) => post._id !== payload),
        loading: false,
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false,
      };
    case ADD_COMMENT:
      return {
        ...state,
        post: { ...state.post, comments: payload },
        loading: false,
      };
    case REMOVE_COMMENT:
      console.log(payload.id, payload.commentId);
      let selectedPost = null;
      let postIndex = null;
      let commentsArray = null;
      let changedPost = state.posts.map((post, index) =>
        post._id === payload.id ? (postIndex = index) : ''
      );
      selectedPost = state.posts[postIndex];
      console.log(payload.id, payload.commentId);
      commentsArray = selectedPost.comments.filter(
        (comment) => comment._id !== payload.commentId.toString()
      );
      selectedPost.comments = commentsArray;
      console.log(selectedPost);
      const newState = {
        ...state,
        // posts: state.posts.map((post) =>
        //   post._id === payload.id ? { ...post, likes: payload.comments } : post
        // ),
        // loading: false,
      };
      console.log(newState);
      return newState;
    default:
      return state;
  }
}
