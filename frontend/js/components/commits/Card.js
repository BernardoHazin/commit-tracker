import PropTypes from 'prop-types';
import React from 'react';

const Card = ({ commit }) => {
  const { format } = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return (
    <div className="card-container column jb">
      <div className="header jb">
        <p className="title">{commit.project}</p>
        <p className="sha">{commit.sha}</p>
      </div>
      <div className="content">
        <p className="message pl-4">{commit.message}</p>
      </div>
      <div className="footer jb">
        <p className="committer">
          <b>Autor:</b> {commit.committer}
        </p>
        <p className="date">{format(new Date(commit.date))}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  commit: PropTypes.object.isRequired,
};

export default Card;
