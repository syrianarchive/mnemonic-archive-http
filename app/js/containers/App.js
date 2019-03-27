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

            <Route
              path="/:locale/collections/chemical-weapons/database"
              render={(props) =>
                <Collection
                  {...props}
                  collections={['Civilian casualties as a result of alleged coalition attacks']}
                />
              }
            />
            <Route
              path="/:locale/collections/chemical-weapons/database.html"
              render={(props) =>
                <Collection
                  {...props}
                  collections={['Civilian casualties as a result of alleged coalition attacks']}
                />
              }
            />

            <Route
              path="/:locale/collections/all"
              render={(props) =>
                <Collection
                  {...props}
                  collections={[]}
                />
              }
            />
            <Route
              path="/:locale/collections/all/database.html"
              render={(props) =>
                <Collection
                  {...props}
                  collections={[]}
                />
              }
            />

            <Route path="/:locale/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}
