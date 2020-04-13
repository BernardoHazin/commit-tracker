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

const filteredSearch = ({ project, params, onError, onSuccess }) => {
  client
    .get(Urls['track:filtered_search'](project), {
      params,
    })
    .then(onSuccess)
    .catch(onError);
};

export { search, filteredSearch, me };
