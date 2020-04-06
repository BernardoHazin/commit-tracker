import React from 'react';

import client from '../utils/axios';

const Home = () => {
  function submit(ev) {
    ev.preventDefault();
    client
      .get('/search/', {
        params: {
          user: 'bernardohazin',
          project: 'commit-tracker',
        },
      })
      .then((res) => {
        console.log(JSON.parse(res.data));
      })
      .catch((err) => {
        if (err.response.status === 403) {
          window.location.replace('/');
        }
      });
  }

  return (
    <div className="home-container column jc ac">
      <form className="form" onSubmit={submit}>
        <label className="fs-5" htmlFor="user">
          Insira o nome do usuário
        </label>
        <input
          aria-placeholder="Nome do usuario"
          className="textfield"
          id="user"
          placeholder="Nome do usuario"
        />
        <label className="fs-5 mt-4" htmlFor="repository">
          Insira o projeto para ver os commits!
        </label>
        <input
          aria-placeholder="Nome do projeto"
          className="textfield"
          id="repository"
          placeholder="Nome do projeto"
        />
        <button className="mt-4 px-4 py-1 btn-primary btn-small" type="submit">
          Buscar
        </button>
      </form>
    </div>
  );
};

export default Home;
