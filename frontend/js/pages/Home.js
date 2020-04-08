import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Profile from '../components/home/Profile';
import { setCommits } from '../state/actions';
import client from '../utils/axios';

// eslint-disable-next-line react/prop-types
const Home = ({ dispatch }) => {
  const history = useHistory();
  const [project, setProject] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});

  function submit(ev) {
    ev.preventDefault();
    setError('');
    client
      .get('/search/', {
        params: {
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

  useEffect(() => {
    client.get('/me/').then((res) => {
      setProfile(res.data);
    });
  }, [window.location]);

  return (
    <div className="home-container column jc ac">
      <form className="form column as slideUp" onSubmit={submit}>
        <Profile profile={profile} />
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

export default connect()(Home);
