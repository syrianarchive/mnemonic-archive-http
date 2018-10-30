import React, { Component } from 'react';
import {unitTitle, unitLoc} from '../containers/helpers';
import t from '../../../translations';

export default class ListObservation extends Component {
  render() {
    const i = this.props.unit;
    return (
      <div className="columns item">
        <div className="col-1 col-sm-12"><small>{i.annotations.incident_date}</small></div>
        <div className="col-7 dtitle col-sm-12"><span>{unitTitle(i)}</span></div>
        <div className="col-1 col-sm-12">
          <small>
            {i.annotations.reference_code}
          </small>
        </div>
        <div className="col-2 col-sm-12"><small>{unitLoc(i)}</small></div>
        <div className="col-1 col-sm-12">
          <button className="btn" onClick={this.props.selector}>
            {t('view')}
          </button>
        </div>
      </div>
    );
  }
}
