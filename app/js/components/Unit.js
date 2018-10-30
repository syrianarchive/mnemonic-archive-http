/* global locale */
import React, { Component } from 'react';
import {isEmpty, map, compact} from 'lodash/fp';
import t from '../../../translations';

import {unitTitle, unitLoc} from '../containers/helpers';
// import {mediaUrl} from '../../../../env';

const mapW = map.convert({cap: false});
// const mapW = map.convert({cap: false});
// {mapW((v, k) =>
//   <div><b>{k}</b>: {String(v)}</div>
// , omit('type_of_violation', i))}

// const fixurl = url => url.replace('/var/www/files', mediaUrl);

export default class Unit extends Component {
  componentDidMount() {
    window.onpopstate = this.props.clear;
  }

  render() {
    const i = this.props.unit;
    if (isEmpty(i)) {
      document.getElementsByTagName('html')[0].classList.remove('fixmod');
      return <div />;
    }
    const graphic = !(i.graphic_content === false);
    document.getElementsByTagName('html')[0].classList.add('fixmod');

    const content = (
      <div className="columns unit">
        <div className="col-6 col-sm-12 meta">

          {graphic &&
            <small className="warning"> {t('Warning: this video may contain graphic content')} </small>
          }

          {i.annotations.filename && (i.annotations.filename.includes('.mp4') || i.annotations.filename.includes('.webm') || i.annotations.filename.includes('.ogv')) &&
          <video src={(i.annotations.sa_link || '')} controls>
            {`Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="videofile.webm">download it</a>
             and watch it with your favorite video player!`}
          </video>
          }

          <h6><br /><a href={(i.annotations.sa_link || '')} download>{t('Download file')} ↓</a></h6>

          <small>
            {t('Online Link')}
          </small>
          <h6><a href={i.annotations.online_link}>{i.annotations.online_link}</a></h6>

          <small>
            {t('Meta')}
          </small>
          <h6>md5 {i.annotations.md5_hash} - {t('acquired')} {i.annotations.date_of_acquisition}</h6>

        </div>
        <div className="col-6 col-sm-12 meta">

          {!this.props.subtitle ?
            <div>
              <small>
                {t('Incidents')}:
              </small>
              <h6>{map(incident =>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`/${locale}/collections/all/database?incident=${incident}`}
                  onClick={() => {
                    this.props.clear();
                  }}
                >
                  {incident}
                </a>
                  , i.clusters.incidents)}</h6>
            </div>
              : ''}

          <small>
            {t('Online Title')}:
          </small>
          <h6>{i.annotations[`online_title_${locale}`]}</h6>

          <small>
            {t('Summary')}
          </small>
          <p>{unitTitle(i)}</p>

          <small>
            {t('Incident Occurred at')}:
          </small>
          <h4>{i.annotations.incident_date}</h4>
          <h5>{i.annotations.incident_time}</h5>

          <small>
            {t('Location')}:
          </small>
          <h6>
            {unitLoc(i)}
          </h6>

          <small>
            {t('Precise Location')}:
          </small>
          <h6>
            {i.annotations.latitude} {i.annotations.longitude}
          </h6>

          <small>
            {t('Acquired From')}:
          </small>
          <h6>
            {i.annotations.acquired_from}
          </h6>

          <small>
            {t('Weapons Used')}:
          </small>
          <h6>
            {compact(i.clusters.weapons).join(', ')}
          </h6>

          <small>
            {t('Collections')}:
          </small>
          <h6>
            {compact(i.clusters.collections).join(', ')}
          </h6>

          <small>
            {t('Type of Violation')}:
          </small>
          <h6>
            {compact(mapW((k, v) => (k ? t(v) : ''), i.annotations.type_of_violation)).join(', ')}
          </h6>


        </div>
      </div>);
    return (
      <div className="modal modal-lg active">
        <div // eslint-disable-line
          className="modal-overlay"
          onClick={this.props.clear}
        />
        <div className="modal-container">
          <div className="modal-body">
            <div className="modal-header">
              <button onClick={this.props.clear} className="btn btn-clear float-right" />
              {t('Verified Observation')}: {i.reference_code} /
              <a href="/">{t('Syrian Archive')}</a>
              {this.props.subtitle ?
                <span>
                  <br />
                  <small>{this.props.subtitle}</small>
                </span>
              : ''}
            </div>
            <div className="content">
              {content}
            </div>
            <small>{i.id}</small>
            <div className="modal-footer">
              <button onClick={this.props.clear} className="btn">
                {t('Close')}
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }
}
