import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';
import jwt_decode from 'jwt-decode';
import { setAuthToken } from './util/session_api_util';
import { logout } from './actions/session_actions';
import axios from 'axios'
import io from 'socket.io-client';
import config from './config';

document.addEventListener('DOMContentLoaded', () => {
  let store;
  const socket = io(config[process.env.NODE_ENV].endpoint);
  if (localStorage.jwtToken) {

    setAuthToken(localStorage.jwtToken);
    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = { session: { isAuthenticated: true, user: decodedUser }};
    store = configureStore(preloadedState);
    const currentTime = Date.now() / 1000;

    if (decodedUser.exp < currentTime) {

      store.dispatch(logout());
      window.location.href = '/login';
    }
  } else {
    store = configureStore({});
  }
  window.axios = axios

  const root = document.getElementById('root');

  ReactDOM.render(<Root store={store} socket={socket}/>, root);
});
