import React, { Component } from 'react';

import {map, isEmpty} from 'lodash/fp';

import ListObservation from './ListObservation';
import Unit from './Unit';
import Filters from './Filters';

import t from '../../../translations';
import {params} from '../params';

export default class DatabaseComponent extends Component {
  constructor(props) {
    super(props);
    this.typing = this.typing.bind(this);
    this.state = {
      typing: false,
    };
  }

  componentDidMount() {
    // stuff in url gets priority over stuff from localstorage
    const h = params.unit;
    if (h) {
      this.props.getUnit(h);
    } else {
      this.props.clearUnit();
    }
    this.props.update(params.filters);
  }

  typing(b) {
    this.setState({typing: b});
  }

  render() {
    const updating = this.props.updating || this.state.typing;
    const {
      stats,
      clearUnit,
      selectUnit,
      selectedUnit,
      meta,
      units,
    } = this.props;

    const us = map(i =>
      <ListObservation unit={i} selector={() => selectUnit(i)} />
      , units);

    return (
      <div className="container database">
        <Unit unit={selectedUnit} clear={clearUnit} />

        <div className="columns stats">
          <div className="col-3" />
          <div className="col-6">
            {t('Results')}: {stats.current} ({t('Page')} {stats.page})
          </div>
          <div className="col-3">
            {meta.verified} {t('verified')} {meta.total} {t('collected')}
          </div>
        </div>

        <div className="columns dbwrapper">

          <div className="col-3 col-sm-12 filters">
            <Filters
              update={this.props.update}
              typing={this.typing}
              filters={this.props.filters}
              meta={this.props.meta}
              reset={this.props.reset}
            />
          </div>

          <div className="col-9 col-sm-12 db" style={updating ? {opacity: '.3'} : {}}>
            {isEmpty(us) ?
              <h4 className="noresults">{t('No results. Please try a different search.')}</h4>
            : us}
          </div>
        </div>

        <div className="columns">
          <div className="col-3 col-sm-12" />
          <div className="col-9 col-sm-12">
            {stats.current - 50 > 0 ?
              <h3>... {stats.current - 50} {t('more.  Contact us for the full set')}</h3>
            : ''}
          </div>
        </div>

      </div>
    );
  }
}
