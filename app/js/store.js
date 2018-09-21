import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import moment from 'moment';

import reader from './redux/reducers';

import {updateParams} from './params';

const d = localStorage.getItem('sydate');

if (!d || moment().subtract(1, 'days') > moment.unix(d)) {
  console.log('clearing local storage');
  localStorage.clear();
}

const persistedState =
 localStorage.getItem('reduxState') ?
   JSON.parse(localStorage.getItem('reduxState')) : {};

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, logger];
}

export const store = createStore(
  reader,
  persistedState,
  applyMiddleware(...middleware)
);

store.subscribe(() => {
  localStorage.setItem('sydate', Date.now());
  localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

store.subscribe(() => {
  updateParams(store.getState());
});

export default {store};
