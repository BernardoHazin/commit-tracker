import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Card from '../components/commits/Card';
import Pagination from '../components/commits/Pagination';
import Loading from '../components/global/loading';
import { INITIAL_PAGE, INITIAL_PER_PAGE } from '../constants';
import { filteredSearch } from '../utils';

const FilteredCommits = () => {
  const [commits, setCommits] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const { project } = useParams();
  const history = useHistory();

  const onCardClick = (commit) => {
    history.push(`/commits/${commit.project}`);
  };

  const fetch = (page, per_page) => {
    const params = { per_page, page };
    filteredSearch({
      project,
      params,
      onSuccess: (res) => {
        setCommits(res.data.data);
        setTotal(res.data.total);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
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
      <button type="button" onClick={() => history.push('/commits')}>
        Voltar
      </button>
      <p className="title">
        Commits de <b>{project}</b>
      </p>
      {loading ? (
        <div className="loading col jc ac">
          <Loading />
        </div>
      ) : commits.length > 0 ? (
        <ul className="list slideUp">
          {commits.map((el) => (
            <li key={el.sha} className="item">
              <Card commit={el} onCardClick={onCardClick} />
            </li>
          ))}
        </ul>
      ) : (
        <div>Nenhum item encontrado</div>
      )}
      <Pagination className="slideUp" fetch={fetch} total={total} />
    </div>
  );
};

export default FilteredCommits;
