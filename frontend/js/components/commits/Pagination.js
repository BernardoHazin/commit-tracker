import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { INITIAL_PAGE, INITIAL_PER_PAGE } from '../../constants';

const Pagination = ({ fetch, total }) => {
  const [page, setPage] = useState(INITIAL_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_PER_PAGE);

  const onPageChange = (selectedPage) => {
    setPage(selectedPage);
    fetch(selectedPage, itemsPerPage);
  };

  const onItemsPerPageChange = (event) => {
    const perPage = Number(event.target.value);
    const pages = Math.ceil(total / perPage);
    setItemsPerPage(perPage);

    if (page > pages) {
      setPage(pages);
      return fetch(pages, perPage);
    }

    return fetch(page, perPage);
  };

  return (
    <div className="pagination-container row ac jb">
      <div className="items">
        {[...new Array(Math.ceil(total / itemsPerPage)).keys()].map((element) => (
          <button
            key={`element-${element}`}
            className={`item ${element + 1 === page ? '-selected' : ''}`}
            type="button"
            onClick={() => onPageChange(element + 1)}
          >
            {element + 1}
          </button>
        ))}
      </div>
      <p className="total">Total: {total}</p>
      <select
        className="options"
        id="options"
        title="Items por página"
        value={itemsPerPage}
        onChange={onItemsPerPageChange}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
      </select>
    </div>
  );
};

Pagination.propTypes = {
  fetch: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

export default Pagination;
