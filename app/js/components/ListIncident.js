import React, { Component } from 'react';
import {size} from 'lodash/fp';
import {location, incidentTitle} from '../containers/helpers';

export default class ListEvidence extends Component {
  render() {
    const i = this.props.incident;
    return (
      <div // eslint-disable-line
        className={`listincident item confidence-${i.confidence}`}
        onClick={this.props.selector}
      >
        <div className="columns">
          <div className="col-12 col-sm-12">
            <h5>{incidentTitle(i) || 'Chemical Attack'}</h5>
          </div>
        </div>
        <div className="columns metameta">
          <div className="col-3 col-sm-12" >
            <small>
              {i.incident_code}
            </small>
          </div>

          <div className="col-5 col-sm-12">
            <small>
              {location(i.location)}
            </small>
          </div>
          <div className="col-2 col-sm-12">
            <small>{i.incident_date}</small>
          </div>
          <div className="col-2 col-sm-12 countu">
            {size(i.units) > 0 ?
              <small>{size(i.units)} <i className="fa fa-video-camera" /></small>
            : ''}
          </div>

        </div>
      </div>
    );
  }
}
