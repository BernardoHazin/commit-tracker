import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { setCommits } from '../state/actions';
import client from '../utils/axios';

// eslint-disable-next-line react/prop-types
const Home = ({ dispatch }) => {
  const history = useHistory();
  const [user, setUser] = useState('');
  const [project, setProject] = useState('');
  const [error, setError] = useState('');

  function submit(ev) {
    ev.preventDefault();
    setError('');
    client
      .get('/search/', {
        params: {
          user,
          project,
        },
      })
      .then((res) => {
        if (res.data.message === 'Not Found') {
          setError('Projeto não encontrado');
          return;
        }
        dispatch(setCommits(res.data));
        history.push('/commits/');
      })
      .catch((err) => {
        if (err.response.status === 403) {
          window.location.replace('/');
        }
      });
  }

  return (
    <div className="home-container column jc ac">
      <form className="form column as" onSubmit={submit}>
        <label className="fs-5" htmlFor="user">
          Insira o nome do usuário
        </label>
        <input
          aria-placeholder="Nome do usuario"
          className="textfield"
          id="user"
          placeholder="Nome do usuario"
          onChange={(ev) => setUser(ev.target.value)}
        />
        <label className="fs-5 mt-4" htmlFor="project">
          Insira o projeto para capturar os commits!
        </label>
        <input
          aria-placeholder="Nome do projeto"
          className="textfield"
          id="project"
          placeholder="Nome do projeto"
          onChange={(ev) => setProject(ev.target.value)}
        />
        <button
          className="mt-4 px-4 py-1 btn-primary btn-small"
          disabled={!user || !project}
          type="submit"
        >
          Capturar
        </button>
        <p className="error mt-4">{error}</p>
      </form>
    </div>
  );
};

export default connect()(Home);
