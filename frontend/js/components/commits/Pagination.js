import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { INITIAL_PAGE, INITIAL_PER_PAGE } from '../../constants';

const PaginationButton = ({ element, key, page, onClick, enabled = true }) => (
  <button
    key={`element-${key || element}`}
    className={`item ${element === page ? '-selected' : ''}`}
    disabled={!enabled}
    type="button"
    onClick={onClick}
  >
    {enabled ? element : '...'}
  </button>
);

function getPaginationButtons({ pages, totalPages, page, onPageChange }) {
  if (totalPages < 9) {
    return [...pages].map((element) =>
      PaginationButton({ element: element + 1, page, onClick: () => onPageChange(element + 1) })
    );
  }
  if (page - 1 > 3 && page < totalPages - 3) {
    return [
      ...[...new Array(2).keys()].map((element) =>
        PaginationButton({ element: element + 1, page, onClick: () => onPageChange(element + 1) })
      ),
      PaginationButton({ enabled: false, key: 'dot-1', page }),
      ...[...new Array(3).keys()].map((element, index) =>
        PaginationButton({
          element: page + (index - 1),
          page,
          onClick: () => onPageChange(page + (index - 1)),
        })
      ),
      PaginationButton({ enabled: false, page, key: 'dot-2' }),
      PaginationButton({
        element: totalPages - 1,
        page,
        onClick: () => onPageChange(totalPages - 1),
      }),
      PaginationButton({
        element: totalPages,
        page,
        onClick: () => onPageChange(totalPages),
      }),
    ];
  }
  if (page - 1 > 3) {
    return [
      ...[...new Array(2).keys()].map((element) =>
        PaginationButton({ element: element + 1, page, onClick: () => onPageChange(element + 1) })
      ),
      PaginationButton({ enabled: false, page, key: 'dot-2' }),
      ...[...new Array(5).keys()].map((element, index) =>
        PaginationButton({
          element: totalPages - (4 - index),
          page,
          onClick: () => onPageChange(totalPages - (4 - index)),
        })
      ),
    ];
  }
  return [
    ...[...pages]
      .slice(0, 5)
      .map((element) =>
        PaginationButton({ element: element + 1, page, onClick: () => onPageChange(element + 1) })
      ),
    PaginationButton({ enabled: false, page, key: 'dot-2' }),
    ...[...new Array(2).keys()].map((element, index) =>
      PaginationButton({
        element: totalPages - (1 - index),
        page,
        onClick: () => onPageChange(totalPages - (1 - index)),
      })
    ),
  ];
}

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

  const totalPages = Math.ceil(total / itemsPerPage);
  const pages = new Array(totalPages).keys();

  const buttons = getPaginationButtons({
    pages,
    totalPages,
    page,
    onPageChange,
  });

  return (
    <div className="pagination-container">
      <div className="items">{buttons}</div>
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

PaginationButton.propTypes = {
  element: PropTypes.number,
  key: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  page: PropTypes.number,
  onClick: PropTypes.func,
  enabled: PropTypes.bool,
};

export default Pagination;
