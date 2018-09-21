import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Investigations from './Investigations';
import Database from './Database';
import Collection from './Collection';
import Home from './Home';

import {store} from '../store';

import {getMeta} from '../redux/actions';

store.dispatch(getMeta());

export default class App extends Component {

  render() {
    return (
      <div>
        <div>
          <Switch>
            <Route path="/:locale/investigations" component={Investigations} />
            <Route path="/:locale/database" component={Database} />
            <Route path="/:locale/collections/:collection/database" component={Collection} />
            <Route path="/:locale/collections/:collection/database.html" component={Collection} />
            <Route path="/:locale/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}
