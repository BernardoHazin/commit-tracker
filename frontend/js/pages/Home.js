import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Profile from '../components/home/Profile';
import { setCommits, setTotal } from '../state/actions';
import { search, me } from '../utils';

const Home = ({ dispatch }) => {
  const history = useHistory();
  const [project, setProject] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});

  const onSubmit = (event) => {
    event.preventDefault();

    setError('');

    // eslint-disable-next-line babel/camelcase
    const params = { project, per_page: 5, page: 1 };
    search({
      params,
      onSuccess: (res) => {
        if (res.data.message === 'Not Found') {
          setError('Projeto não encontrado');
          return;
        }
        dispatch(setCommits(res.data.data));
        dispatch(setTotal(res.data.total));
        history.push('/commits/');
      },
      onError: (err) => {
        if (err.response.status === 403) {
          window.location.replace('/');
        }
      },
    });
  };

  useEffect(() => {
    me({
      onSuccess: (res) => {
        setProfile(res.data);
      },
    });
  }, [window.location]);

  return (
    <div className="home-container column jc ac">
      <form className="form column js as slideUp" onSubmit={onSubmit}>
        <Profile profile={profile} />
        <p className="title fs-5">Olá {profile.name || 'usuário'}, Bem vindo ao Commit Tracker!</p>
        <p className="description fs-4">
          Ao inserir um de seus projetos abaixo o <b>Commit Tracker</b> irá capturar os commits
          feitos no repositório desde o último mês e os armazenará junto com outros commits de
          outros usuários.
          <br />
          <br />
          Após a captura você terá acesso a uma lista contendo todos eles!
          <br />
          <br />
          Insira um projeto abaixo para começar!
        </p>
        <label className="fs-5 mt-4" htmlFor="project">
          Insira o projeto para capturar os commits!
        </label>
        <input
          aria-placeholder={`${profile.login}/`}
          className="textfield"
          id="project"
          placeholder={`${profile.login}/`}
          onChange={(ev) => setProject(ev.target.value)}
        />
        <button className="mt-4 px-4 py-1 btn-primary btn-small" disabled={!project} type="submit">
          Capturar
        </button>
        <p className="error mt-4">{error}</p>
      </form>
    </div>
  );
};

Home.propTypes = {
  dispatch: PropTypes.func,
};

export default connect()(Home);
