import { SET_COMMITS, SET_TOTAL } from '../../constants';

const INITIAL_STATE = {
  commits: [],
  total: 0,
};

const commitsReducer = (state = INITIAL_STATE, action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case SET_COMMITS:
      return { ...state, commits: action.commits };
    case SET_TOTAL:
      return { ...state, total: action.total };
    default:
      return state;
  }
};

export default commitsReducer;
