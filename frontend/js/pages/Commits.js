import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Card from '../components/commits/Card';
import Pagination from '../components/commits/Pagination';
import { INITIAL_PAGE, INITIAL_PER_PAGE } from '../constants';
import { setCommits, setTotal } from '../state/actions';
import { search } from '../utils';

const Commits = ({ commits, total, dispatch }) => {
  const history = useHistory();
  const onCardClick = (commit) => {
    history.push(`/commits/${commit.project}`);
  };

  const fetch = (page, per_page) => {
    const params = { per_page, page };
    search({
      params,
      onSuccess: (res) => {
        dispatch(setCommits(res.data.data));
        dispatch(setTotal(res.data.total));
      },
      onError: (err) => {
        if (err.response.status === 403) {
          window.location.replace('/');
        }
      },
    });
  };

  useEffect(() => {
    fetch(INITIAL_PAGE, INITIAL_PER_PAGE);
  }, [window.location]);

  return (
    <div className="commits-container column ac">
      <ul className="list slideUp">
        {commits.map((el) => (
          <li key={el.sha} className="item">
            <Card commit={el} onCardClick={onCardClick} />
          </li>
        ))}
      </ul>
      <Pagination className="slideUp" fetch={fetch} total={total} />
    </div>
  );
};

Commits.propTypes = {
  commits: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  dispatch: PropTypes.func,
};

export default connect((state) => ({
  commits: state.commitsReducer.commits,
  total: state.commitsReducer.total,
}))(Commits);
