import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Commits from '../pages/Commits';
import Home from '../pages/Home';

export default function App() {
  return (
    <Router basename="/track">
      <Switch>
        <Route component={Commits} path="/commits/" />
        <Route component={Home} path="/" />
      </Switch>
    </Router>
  );
}
