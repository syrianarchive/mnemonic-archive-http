import React, { Component } from 'react';
import {isEmpty} from 'lodash/fp';

import {unitTitle} from '../containers/helpers';
// import {mediaUrl} from '../../../../env';


// const fixurl = url => url.replace('/var/www/files', mediaUrl);

export default class Unit extends Component {
  render() {
    const i = this.props.unit;
    if (isEmpty(i)) {
      document.getElementsByTagName('html')[0].classList.remove('fixmod');
      return <div />;
    }

    return (
      <div className="card">
        <div // eslint-disable-line
          onClick={this.props.get}
          className="card-header"
        >

          <div className="videodiv">
            {i.annotations.filename && (i.annotations.filename.includes('.mp4') || i.annotations.filename.includes('.webm') || i.annotations.filename.includes('.ogv')) &&
            <video
              preload="metadata"
            >
              <source src={`${(i.annotations.filename || '')}`} type="video/mp4" />
              {`Sorry, your browser doesnt support embedded videos, but dont worry, you can <a href="videofile.webm">download it</a>
               and watch it with your favorite video player!`}
            </video>
            }
          </div>

          {i.annotations.filename && (i.annotations.filename.includes('.mp4') || i.annotations.filename.includes('.webm') || i.annotations.filename.includes('.ogv')) &&
            <icon className="largeplayicon fa fa-play-circle" />
          }
          <div className="card-title">
            <div className="tcontent">
              <small><h6>{unitTitle(i).substr(0, 140)}...</h6></small>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
