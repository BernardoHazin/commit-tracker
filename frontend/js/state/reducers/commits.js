const commits = (state = [], action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch (action.type) {
    case 'SET_COMMITS':
      return action.commits;
    default:
      return state;
  }
};

export default commits;
