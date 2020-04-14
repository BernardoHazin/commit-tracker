import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Commits from '../pages/Commits';
import FilteredCommits from '../pages/FilteredCommits';
import Home from '../pages/Home';

export default function App() {
  return (
    <Router basename="/track">
      <Switch>
        <Route path="/commits/:project/">
          <FilteredCommits />
        </Route>
        <Route path="/commits/">
          <Commits />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
