import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import {
  getPolls,
  updateChoice,
  updatePollName,
  deletePoll,
  castVote,
} from '../../actions/poll';
import '../../styles/Polls.css';
import Paginate from '../posts/Paginate';

//Material UI import
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

//Moment import
import Moment from 'react-moment';

const Polls = ({
  poll: { polls, loading },
  scheduleId,
  showActions,
  auth,
  sendPageNumber,
  getPolls,
  updateChoice,
  updatePollName,
  deletePoll,
  castVote,
}) => {
  useEffect(() => {
    getPolls(scheduleId);
  }, [getPolls]);

  //default to starting page
  const [currentPage, setCurrentPage] = useState(1);

  const [pollsPerPage] = useState(5);

  // Get current posts
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);

  // Change page
  const paginate = (event, value) => {
    sendPageNumber(value);
    setCurrentPage(value);
  };

  /* start toggle comments display */
  // const [showCommentForm, setShowCommentForm] = useState(false);

  // const toggleCommentFormDisplay = () => {
  //   setShowCommentForm(!showCommentForm);
  // };
  /* end toggle comments display */

  return loading ? <Spinner /> : <Fragment>{console.log(polls)}</Fragment>;
};

Polls.propTypes = {
  getPolls: PropTypes.func.isRequired,
  poll: PropTypes.object.isRequired,
  showActions: true,
  auth: PropTypes.object.isRequired,
  updateChoice: PropTypes.func.isRequired,
  updatePollName: PropTypes.func.isRequired,
  deletePoll: PropTypes.func.isRequired,
  castVote: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  poll: state.poll,
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getPolls,
  updateChoice,
  updatePollName,
  deletePoll,
  castVote,
})(Polls);
