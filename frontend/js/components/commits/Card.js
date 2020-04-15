import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ commit, isStatic, onCardClick }) => {
  const { format } = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div
      className={`card-container column jb ${!isStatic ? 'animated' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => !isStatic && onCardClick(commit)}
      onKeyPress={() => !isStatic && onCardClick(commit)}
    >
      <div className="header jb">
        <p className="title" title="Projeto">
          {commit.project}
        </p>
        <p className="sha" title="ID">
          {commit.sha}
        </p>
      </div>
      <div className="content">
        <p className="message pl-4" title={commit.message}>
          {commit.message}
        </p>
      </div>
      <div className="footer jb">
        <p className="committer" title={commit.committer}>
          <b>Autor:</b> {commit.committer}
        </p>
        <p className="date" title="Data de criação">
          {format(new Date(commit.date))}
        </p>
      </div>
      {!isStatic ? (
        <>
          <p className="informative">
            Clique para filtrar os commits de <b>{commit.project}</b>
          </p>
          <svg
            className="icon"
            clipRule="evenodd"
            fillRule="evenodd"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z" />
          </svg>
        </>
      ) : null}
    </div>
  );
};

Card.propTypes = {
  commit: PropTypes.shape({
    project: PropTypes.string,
    sha: PropTypes.string,
    message: PropTypes.string,
    committer: PropTypes.string,
    date: PropTypes.string,
  }),
  isStatic: PropTypes.bool,
  onCardClick: PropTypes.func.isRequired,
};

export default Card;
