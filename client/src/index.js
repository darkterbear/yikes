import React from 'react';
import ReactDOM from 'react-dom';
import HomePage from './HomePage';
import LobbyPage from './LobbyPage';
import GamePage from './GamePage';
import './css/index.css'
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

ReactDOM.render(
  <Router>
    <Route path="/" exact component={HomePage} />
    <Route path="/lobby" exact component={LobbyPage} />
    <Route path="/game" exact component={GamePage} />
  </Router>,
  document.getElementById('root')
);

serviceWorker.unregister();
