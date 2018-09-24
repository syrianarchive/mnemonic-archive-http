import React, { Component } from 'react';
import moment from 'moment';
import noUiSlider from 'nouislider';

import {timeMeOut} from '../containers/helpers';

import t from '../../../translations';

// Add a range slider
let slider = document.getElementById('slider');

export default class CollectionRangeComponent extends Component {
  constructor(props) {
    super(props);
    this.updateRange = this.updateRange.bind(this);

    this.state = {
      units: this.props.units,
      selectedStartDate: moment('2013-01-01').valueOf(),
      selectedEndDate: moment().valueOf(),
    };
  }

  componentDidMount() {
    // Add a range slider
    slider = document.getElementById('slider');

    noUiSlider.create(slider, {
      range: {
        min: this.state.selectedStartDate,
        max: this.state.selectedEndDate
      },
      tooltips: true,
      connect: true,
      step: 24 * 60 * 60 * 1000,
      start: [this.state.selectedStartDate, this.state.selectedEndDate],
    });


    const dateValues = [
      document.getElementsByClassName('noUi-tooltip')[0],
      document.getElementsByClassName('noUi-tooltip')[1]
    ];


    slider.noUiSlider.on('update', (values) => {
      dateValues[0].innerHTML = `From: ${moment(+values[0]).format('YYYY-MM-DD')}`;
      dateValues[1].innerHTML = `To: ${moment(+values[1]).format('YYYY-MM-DD')}`;

      const s = moment(+values[0]).format('YYYY-MM-DD');
      const e = moment(+values[1]).format('YYYY-MM-DD');
      timeMeOut(() => {
        this.updateRange([s, e]);
      }, 30);
    });
  }


  // call this function with this.updaterange when the sliders have been determined
  updateRange(range) {
    this.setState({
      selectedStartDate: range[0],
      selectedEndDate: range[1]
    });
    this.props.updateRange(range);
  }


  render() {
    return (
      <div className="sliderarea">
        <div className="rangemeta">
          <i className="fa fa-clock-o" />
          {t('From')}:
          <b>{moment(this.state.selectedStartDate).format('MMM Do YYYY')}</b>
          {t('To')}:
          <b>{moment(this.state.selectedEndDate).format('MMM Do YYYY')}</b>
        </div>
        <div className="slider" id="slider" />
      </div>
    );
  }
}
