import React, { Component } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';

const margin = {top: 20, right: 0, bottom: 0, left: 0};
let width = 800 - margin.left - margin.right;
let height = 50 - margin.top - margin.bottom;

let x = d3.scaleTime()
    .range([0, width]);

let y = d3.scaleLinear()
      .range([height, 0]);

let xAxis = d3.axisTop(x).tickFormat(d3.timeFormat('%e %b %y'));
let yAxis = d3.axisLeft(y).ticks(4);

const resizeChart = () => {
  width = document.getElementById('mapcol').offsetWidth - margin.left - margin.right;
  height = 50 - margin.top - margin.bottom;

  x = d3.scaleTime()
      .range([0, width]);

  y = d3.scaleLinear()
        .range([height, 0]);

  xAxis = d3.axisTop(x).tickFormat(d3.timeFormat('%e %b %y'));
  yAxis = d3.axisLeft(y).ticks(4);
};

const line = d3.line()
.x((d) => x(d.date))
.y((d) => y(d.counts));

const cleanData = incidentData => {
  let units = incidentData.filter((obj) => obj.annotations.incident_date !== '');
  units.forEach((d) => {
    const formatedDate = moment(d.annotations.incident_date).format('YYYY-MM-DD');
    if (formatedDate === 'Invalid date') {
      d.annotations.incident_date = moment(d.annotations.incident_date, 'DD-MM-YYYY').format('YYYY-MM-DD'); // eslint-disable-line
    } else {
      d.annotations.incident_date = formatedDate; // eslint-disable-line
    }
  });

  // group incidents by dates
  units = _.groupBy(units, (value) =>
    value.annotations.incident_date
  );

  // build a data array
  const data = [];
  const existDates = [];
  const formatDate = d3.utcParse('%Y-%m-%d');

  for (const d in units) { // eslint-disable-line
    data.push({
      date: formatDate(d),
      counts: Object.values(units[d]).length,
      incidents: Object.values(units[d])
    });
    existDates.push(formatDate(d).getTime());
  }

  // generate all dates between the start and end dates.
  const findDate = data.map((d) => moment(d.date, 'YYYY-MM-DD'));
  const startDate = moment.min(findDate);
  const endDate = moment.max(findDate);

  for (let date = moment(startDate); date.diff(endDate) <= 0; date.add(1, 'days')) {
    let D = moment(date).format('YYYY-MM-DD');
    D = formatDate(D);
    if (existDates.indexOf(D.getTime()) === -1) { data.push({date: D, counts: 0}); }
  }

// sort the data array so the chart will plot correctly
  return data.sort((a,b) => ((a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0))); // eslint-disable-line
};

export default class CollectionTimelineComponent extends Component {
  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this);

    this.state = {
      units: this.props.units,
      selectedStartDate: moment('2013-01-01').valueOf(),
      selectedEndDate: moment().valueOf(),
    };
  }

  componentDidMount() {
    resizeChart();
    const data = cleanData(this.props.units);

    const chart = d3.select('.chart')
        .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom);

    chart.selectAll('g').remove();

    const g = chart.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')'); // eslint-disable-line

    x.domain(d3.extent(data, (d) => d.date));
    y.domain([0, d3.max(data, (d) => d.counts)]);

    g.append('g')
      .attr('transform', 'translate(0,' + '0' + ')') // eslint-disable-line
      .attr('class', 'x axis')
      .call(xAxis)
      .select('.domain');

    g.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
      .append('text')
      .attr('fill', '#000')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em');

    g.append('path')
      .attr('class', 'path')
      .data([data])
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('stroke-width', 1.5)
      .attr('d', line)
      .exit().remove(); // eslint-disable-line
  }


  shouldComponentUpdate(newProps) {
    return _.size(this.props.units) !== _.size(newProps.units);
  }

  componentDidUpdate() {
    // exclude incidents don't have dates
    this.updateChart(cleanData(this.props.units));
  }

  updateChart(data) { // eslint-disable-line
    const chart = d3.select('.chart');
    const fData = data;
    x.domain(d3.extent(fData, (d) => d.date));
    y.domain([0, d3.max(fData, (d) => d.counts)]);
    chart.selectAll('g.y.axis')
    .call(yAxis);
    chart.selectAll('g.x.axis')
    .call(xAxis);
    chart.selectAll('.path')
    .data([fData])
    .attr('d', line);
  }

  render() {
    return <div className="chartarea"><svg className="chart" /></div>;
  }
}
