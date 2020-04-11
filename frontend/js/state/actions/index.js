import { SET_COMMITS, SET_TOTAL } from '../../constants';

export const setCommits = (commits) => {
  return {
    type: SET_COMMITS,
    commits,
  };
};

export const setTotal = (total) => {
  return {
    type: SET_TOTAL,
    total,
  };
};
