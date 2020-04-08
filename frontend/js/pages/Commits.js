import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Card from '../components/commits/Card';

const Commits = ({ commits }) => {
  const history = useHistory();
  if (!commits.length) history.push('/');
  return (
    <div className="commits-container column ac">
      <ul className="list slideUp">
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
