import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const Commits = ({ commits }) => {
  return (
    <div className="home-container column jc ac">
      {commits.map((el, i) => (
        <div key={i}>{el.sha}</div>
      ))}
    </div>
  );
};

Commits.propTypes = {
  commits: PropTypes.array.isRequired,
};

export default connect((state) => ({
  commits: state.commits,
}))(Commits);
