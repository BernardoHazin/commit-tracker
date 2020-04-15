import PropTypes from 'prop-types';
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

import { INITIAL_PAGE, INITIAL_PER_PAGE } from '../../constants';

const Pagination = ({ fetch, total }) => {
  const [page, setPage] = useState(INITIAL_PAGE);
  const [itemsPerPage, setItemsPerPage] = useState(INITIAL_PER_PAGE);

  const onPageChange = ({ selected }) => {
    setPage(selected + 1);
    fetch(selected + 1, itemsPerPage);
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

  const pages = Math.ceil(total / itemsPerPage);

  return (
    <div className="pagination-container">
      <ReactPaginate
        activeClassName="-selected"
        breakClassName="break"
        containerClassName="items"
        marginPagesDisplayed={1}
        nextLabel="próximo"
        pageClassName="item"
        pageCount={pages}
        pageLinkClassName="link"
        previousLabel="anterior"
        onPageChange={onPageChange}
      />
      <p className="total" title="Total">
        Total: {total}
      </p>
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
