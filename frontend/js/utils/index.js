import client from './axios';
import Urls from './urls';

const search = ({ params, onError, onSuccess }) => {
  client
    .get(Urls['track:search'](), {
      params,
    })
    .then(onSuccess)
    .catch(onError);
};

const me = ({ onSuccess }) => {
  client.get(Urls['track:me']()).then(onSuccess);
};

export { search, me };
