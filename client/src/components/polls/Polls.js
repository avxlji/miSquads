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
import Pollbar from './Pollbar';

//Material UI import
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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

  const [pollsPerPage] = useState(2);

  // Get current posts
  const indexOfLastPoll = currentPage * pollsPerPage;
  const indexOfFirstPoll = indexOfLastPoll - pollsPerPage;
  const currentPolls = polls.slice(indexOfFirstPoll, indexOfLastPoll);

  // Change page
  const paginate = (event, value) => {
    sendPageNumber(value);
    setCurrentPage(value);
  };

  // handle radio button value change
  const [votes, setVotes] = useState([]);

  function updateVotesArray(index, newValue) {
    //copy the array first
    console.log(index, newValue);
    setActivePoll(index);
    const updatedArray = [...votes];
    updatedArray[index] = newValue;
    setVotes(updatedArray);
  }

  const something = (event) => {
    console.log(votes);
  };

  /* active poll effect */

  const [activePoll, setActivePoll] = useState(null);

  return loading ? (
    <Spinner />
  ) : (
    <Fragment>
      <div id="polls">
        {currentPolls.map((poll, index) => (
          <div className="poll-paper-container">
            <Paper
              elevation={index === activePoll ? 6 : 0}
              className="poll-paper"
            >
              <>
                <div className="poll-container">
                  <Pollbar question={poll.pollName} />
                  <FormControl component="fieldset">
                    <RadioGroup
                      aria-label="poll"
                      name="poll"
                      // value={vote}
                      onChange={(e) => updateVotesArray(index, e.target.value)}
                    >
                      {poll.choices.map((choice) => (
                        <FormControlLabel
                          value={choice.choiceName}
                          control={<Radio />}
                          // defaultChecked={choice.votes.map((vote) =>
                          //   vote.user_id.toString() === auth.user._id
                          //     ? true
                          //     : false
                          // )}
                          label={choice.choiceName}
                        />
                      ))}
                    </RadioGroup>
                    <div className="poll-buttons-container">
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={something}
                        >
                          Submit
                        </Button>
                      </div>

                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={something}
                        >
                          Submit
                        </Button>
                      </div>
                    </div>
                  </FormControl>
                </div>
              </>
            </Paper>
          </div>
        ))}
      </div>
      <Paginate
        postsPerPage={pollsPerPage}
        totalPosts={polls.length}
        paginate={paginate}
      />
    </Fragment>
  );
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
