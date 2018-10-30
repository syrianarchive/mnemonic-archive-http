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
              path="/:locale/collections/russian-airstrikes/civilian-database"
              collections={['Civilian casualties as a result of alleged russian attacks', 'Alleged Russian airstrikes on civilian infrastructure']}
              component={Collection}
            />
            <Route
              path="/:locale/collections/russian-airstrikes/civilian-database.html"
              collections={['Civilian casualties as a result of alleged russian attacks', 'Alleged Russian airstrikes on civilian infrastructure']}
              component={Collection}
            />

            <Route
              path="/:locale/collections/russian-airstrikes/russianMoDdatabase"
              collections={['Attacks claimed by Russian Ministry of Defense']}
              component={Collection}
            />

            <Route path="/:locale/collections/chemical-weapons/database" collections={['Chemical weapons']} component={Collection} />
            <Route path="/:locale/collections/chemical-weapons/database.html" collections={['Chemical weapons']} component={Collection} />

            <Route path="/:locale/" component={Home} />
          </Switch>
        </div>
      </div>
    );
  }
}
