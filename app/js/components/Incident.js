import React, { Component } from 'react';
import {map, isEmpty, concat, compact, size} from 'lodash/fp';
import Promise from 'bluebird';
import Unit from './Unit';
import CardUnit from './CardUnit';
import t from '../../../translations';
import {unitLoc, incidentTitle, incidentSummary} from '../containers/helpers';

import {api} from '../api';

const mapW = map.convert({cap: false});


export default class Incident extends Component {
  constructor(props) {
    super(props);
    this.state = {
      units: [],
    };
  }

  componentDidMount() {
    window.onpopstate = () => {
      this.props.clearUnit();
      this.props.clear();
    };
    this.props.scroll();
    if (this.props.incident && !isEmpty(this.props.incident.units)) {
      Promise.each(
        this.props.incident.units,
        (uid) => api.get(`units/${uid}`)
            .then(u => this.setState({units: concat(this.state.units, u)}))
            .catch(() => {
              console.log(`failed retrieving ${uid}`);
            })
      )
      .catch(console.log);
    }
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    console.log('receiviiiiinnggg proooopss');
    if (nextProps.incident !== this.props.incident) {
      this.setState({units: []}, () =>
        Promise.each(
          this.props.incident.units,
          (uid) => api.get(`units/${uid}`)
              .then(u => this.setState({units: concat(this.state.units, u)}))
              .catch(() => {
                console.log(`failed retrieving ${uid}`);
              })
        )
        .catch(console.log)
      );
    }
  }

  componentDidUpdate() {
    // console.log(this.props.incident.units);
    //
    // if (isEmpty(this.state.units) &&
    // this.props.incident && !isEmpty(this.props.incident.units)) {
    //   Promise.reduce(
    //     this.props.incident.units,
    //     (acc, uid) => {
    //       console.log(uid);
    //       return api.get(`units/${uid}`).then(concat(acc)).catch(() => {
    //         console.log(`failed retrieving ${uid}`);
    //         return Promise.resolve(acc);
    //       });
    //     },
    //     []
    //   ).then(us => this.setState({units: compact(us)}))
    //   .catch(console.log);
    // }
  }

  render() {
    const i = this.props.incident;
    const us = this.state.units;

    const confidence = (c) => {
      switch (c) {
        case 1:
          return 'This incident is unlikely to have occurred';
        case 2:
          return 'This incident likely to have occurred';
        case 3:
          return 'This incident has a high likelihood of having occurred';
        default:
          return 'This incident is very unlikely to have occurred';
      }
    };
    return (
      <div className="columns incident">
        <Unit
          unit={this.props.unit}
          clear={this.props.clearUnit}
          subtitle={`Incident ${i.id} - ${i.annotations.title_en}`}
        />

        <div className="col-7 incidentcol col-sm-12">
          <button className="btn btn-orange back-button" onClick={this.props.clear}>
            ← {t('back to database')}
          </button>

          <br /><br />


          <span className="lbl">{i.id}</span>

          <h3>{incidentTitle(i) || 'Chemical Attack'}</h3>
          <h6>{i.annotations.incident_date} {i.annotations.incident_time}</h6>

          <hr />

          <div>
            <small>
              {t('Confidence')}:
            </small>
            <h5>
              {confidence(i.annotations.confidence)}
            </h5>
          </div>

          <div>
            <small>
              {t('Location')}:
            </small>
            <h5>
              {unitLoc(i)}
            </h5>
          </div>

          <div className="incidentsummary">
            <p>{incidentSummary(i)}</p>
          </div>

          <div>
            <small>
              {t('Precise Location')}:
            </small>
            <h5>
              {i.annotations.latitude} {i.annotations.longitude}
            </h5>
          </div>

          <div>
            <small>
              {t('Weapons Used')}:
            </small>
            <h5>
              {compact(i.clusters.weapons).join(', ')}
            </h5>
          </div>

          <div>
            <small>
              {t('Collections')}:
            </small>
            <h5>
              {compact(i.clusters.collections).join(', ')}
            </h5>
          </div>

          <div>
            <small>
              {t('Type of Violation')}:
            </small>
            <h5>
              {compact(mapW((k, v) => (k ? t(v) : ''), i.annotations.type_of_violation)).join(', ')}
            </h5>
          </div>


          {!isEmpty(i.annotations.fr_title) ?
            <div>
              <small>
                {t('Dataset')}:
              </small>
              <p>
                This incident was included in published reports on
                chemical weapons attacks created by the French Ministry of
                Foreign Affairs
              </p>
              <p>
                {i.annotations.fr_title}
              </p>
            </div>
          : ''}

          {!isEmpty(i.annotations.un_title) ?
            <div>
              <small>
                {t('Dataset')}:
              </small>
              <p>
                This incident was included in published
                reports on chemical weapons attacks created by the
                UN Independent International Commission of Inquiry on the Syrian
                Arab Republic
              </p>
              <p>
                {i.annotations.un_title}
              </p>
            </div>
          : ''}

        </div>
        <div className="col-5 incidentcol obscol col-sm-12">
          <br />
          <br />


          <span className="lbl">Observations ({size(this.props.incident.units)})</span>
          {map(u =>
            <CardUnit
              unit={u}
              key={u.aid}
              get={() => this.props.getUnit(u.aid)}
            />
          , us)}

        </div>
      </div>
    );
  }
}
