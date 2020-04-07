import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Card from '../components/commits/Card';

const Commits = ({ commits }) => {
  return (
    <div className="commits-container column ac">
      <ul className="list">
        {commits.map((el) => (
          <li key={el.sha} className="item">
            <Card commit={el} />
          </li>
        ))}
      </ul>
    </div>
  );
};

Commits.propTypes = {
  commits: PropTypes.array.isRequired,
};

export default connect((state) => ({
  commits: state.commits,
}))(Commits);
