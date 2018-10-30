import React, { Component } from 'react';
import {map, intersectionBy, size, pick, isEqual, uniqBy, concat, isEmpty, filter, xorBy, sortBy, reverse} from 'lodash/fp';
import moment from 'moment';

import {params} from '../params';
import {timeMeOut} from '../containers/helpers';

// import Filters from './Filters';
import ListIncident from './ListIncident';
import Incident from './Incident';

import CollectionMapComponent from './CollectionMapComponent';
import Slider from './CollectionRangeComponent';

import translator from '../../../translations';

const filterByRange = (incidents, range) =>
  filter((d) =>
    (moment(d.annotations.incident_date || d.annotations.ru_upload) >= moment(range[0])
    && moment(d.annotations.incident_date || d.annotations.ru_upload) <= moment(range[1]))
    , incidents);

const filterByMapVisible = (incidents, visible) => (size(visible) > 0
      ? intersectionBy('id', incidents, visible)
      : incidents);

export default class DatabaseComponent extends Component {
  constructor(props) {
    super(props);
    this.typing = this.typing.bind(this);
    this.search = this.search.bind(this);
    this.visible = this.visible.bind(this);
    this.hover = this.hover.bind(this);
    this.setSort = this.setSort.bind(this);
    this.range = this.range.bind(this);

    this.updateFrontentView = this.updateFrontentView.bind(this);

    this.state = {
      incidents: [],
      nolocationIncidents: [],
      locationIncidents: [],
      visiblebyrange: [],
      visiblebymap: [],
      visible: [],
      invisible: [],
      searchterm: params.filters.term || this.props.filters.term,
      typing: false,
      hoverUnit: false,
      range: [moment('2013-01-01').valueOf(), moment().valueOf()],
      visibleMarkers: [],
      sort: params.filters.term || this.props.filters.term ? 'relevance' : 'observationcount'
    };
  }


  componentWillMount() {
    const collection = this.props.collections;
    this.props.update({collections: collection});
  }

  componentDidMount() {
    // stuff in url gets priority over stuff from localstorage

    const h = params.incident;
    if (h) {
      this.props.getIncident(h);
    } else {
      this.props.clearIncident();
    }
  }

  componentWillReceiveProps(nextProps) {
  // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.incidents !== this.state.incidents) {
      const visiblebyrange = filterByRange(this.state.locationIncidents, this.state.range);
      const visiblebymap =
        filterByMapVisible(this.state.locationIncidents, this.state.visibleMarkers);
      const locationIncidents = filter(i => i.lat && i.lon, nextProps.incidents);
      const nolocationIncidents = filter(i => !i.lat && !i.lon, nextProps.incidents);
      this.setState({
        incidents: nextProps.incidents,
        locationIncidents,
        nolocationIncidents,
        visiblebyrange,
        visiblebymap,
        visible: intersectionBy('id', visiblebyrange, visiblebymap),
        invisible: (size(this.state.visibleMarkers) > 0
              ? uniqBy('id', concat(xorBy('id', nextProps.incidents, visiblebymap), nolocationIncidents))
              : nolocationIncidents)
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const a = pick(['selectedIncident', 'incidents', 'updating', 'selectedUnit']);
    return !(isEqual(a(nextProps), a(this.props)) && isEqual(this.state, nextState));
  }

  setSort(field) {
    this.setState({sort: field});
  }

  search(e) {
    this.setState({typing: true, sort: 'relevance'});
    const term = e.target.value;
    this.setState({searchterm: term});
    timeMeOut(() => {
      this.props.update({term});
      this.setState({typing: false});
    });
  }

  typing(b) {
    this.setState({typing: b});
  }


  visible(codes) {
    const visible = this.state.visibleMarkers;
    if (codes !== visible) {
      const visiblebymap = filterByMapVisible(this.state.locationIncidents, codes);
      this.setState({
        visibleMarkers: codes,
        visiblebymap,
        visible: intersectionBy('id', this.state.visiblebyrange, visiblebymap),
        invisible: (size(codes) > 0
              ? uniqBy('id', concat(xorBy('id', this.props.incidents, visiblebymap), this.state.nolocationIncidents))
              : this.state.nolocationIncidents)
      });
    }
  }


  range(range) {
    if (range !== this.state.range) {
      const visiblebyrange = filterByRange(this.state.locationIncidents, range);
      this.setState({
        range,
        visiblebyrange,
        visible: intersectionBy('id', visiblebyrange, this.state.visiblebymap),
        invisible: (size(this.state.visibleMarkers) > 0
              ? uniqBy('id', concat(xorBy('id', this.state.incidents, this.state.visiblebymap), this.state.nolocationIncidents))
              : this.state.nolocationIncidents)
      });
    }
  }

  hover(unit) {
    timeMeOut(() => {
      this.setState({hoverUnit: unit});
    }, 1);
  }

  updateFrontentView() { // eslint-disable-line
    const ii = document.getElementsByClassName('scrolltome')[0];
    const t = document.getElementsByClassName('top')[0];
    const s = document.getElementsByClassName('subheader')[0];
    const p = ii ? ii.offsetTop : 0;
    const v = t ? t.offsetHeight : 0;
    const y = s ? s.offsetHeight : 0; // offsetheight
    // window.scrollTo(0, p - v - y); // eslint-disable-line
    window.scrollTo({
      top: p - v - y,
      left: 0,
      behavior: 'smooth'
    });
  }

  render() {
    const updating = this.props.updating || this.state.typing;

    // const incidents = this.state.incidents;
    const locationIncidents = this.state.locationIncidents;
    // const nolocationIncidents = this.state.nolocationIncidents;

    // const visible = this.state.visibleMarkers;
    //
    //
    // const visiblebyrange = this.state.visiblebyrange;
    // const visiblebymap = this.state.visiblebymap;

    const visibleIncidents = this.state.visible;

    const invisibleIncidents = this.state.invisible;


    const makeIncidents = (is) => map(i =>
                                      <div // eslint-disable-line
                                        onMouseEnter={() => this.hover(i)}
                                        onMouseLeave={() => this.hover(false)}
                                      >
                                        <ListIncident
                                          incident={i}
                                          selector={() => this.props.selectIncident(i)}
                                        />
                                      </div>
                                      , is);

    const sort = (l) => {
      const by = this.state.sort;
      if (isEmpty(by)) { return l; }
      if (by === 'relevance') {
        return reverse(l);
      }
      if (by === 'observationcount') {
        return sortBy(i => size(i.units), l);
      }
      if (by === 'date') {
        return sortBy('annotations.incident_date', l);
      }
      if (by === 'confidence') {
        return sortBy('annotations.confidence', l);
      }
    };

    const vlist = makeIncidents(reverse(sort(visibleIncidents)));
    const ilist = makeIncidents(reverse(sort(invisibleIncidents)));

    const hu = (!isEmpty(this.props.selectedIncident) ?
      this.props.selectedIncident :
      this.state.hoverUnit);

    const hoverunit = (hu.lat && hu.lon) ? hu : undefined;

    const individual = !isEmpty(this.props.selectedIncident);

    const leafletMap = (
      <CollectionMapComponent
        incidents={locationIncidents}
        visible={this.visible}
        visibleIncidents={visibleIncidents}
        hoverUnit={hoverunit}
        updateFrontentView={this.updateFrontentView}
        selector={this.props.selectIncident}
        updateRange={this.range}
        individual={individual}
      />);

    // const singleMap = (
    //   <CollectionMapComponent
    //     incidents={[this.props.selectedIncident]}
    //     visibleIncidents={[this.props.selectedIncident]}
    //     visible={() => {}}
    //     updateFrontentView={() => {}}
    //     updateRange={() => {}}
    //   />);


    if (!isEmpty(this.props.selectedIncident)) {
      return (
        <div className="container collection">
          <div className="columns">
            <div className="col-8 col-sm-12 scrolltome">
              <Incident
                incident={this.props.selectedIncident}
                clear={this.props.clearIncident}
                getUnit={this.props.getUnit}
                unit={this.props.selectedUnit}
                clearUnit={this.props.clearUnit}
                scroll={this.updateFrontentView}
              />
            </div>
            <div className="col-4 col-sm-12">
              {leafletMap}
            </div>
          </div>

        </div>
      );
    }
    return (
      <div className="container collection">
        <div className="columns">
          <div
            className="col-6 col-sm-12 scrolltome"
            id="incidentlist"
          >
            <div className="collectionsearch">
              <input placeholder={translator('Type to Search...')} value={this.state.searchterm} type="text" onChange={this.search} />
            </div>

            <Slider
              updateRange={this.range}
            />

            <div className="resultsMeta">
              <span>
                <i className="fa fa-map-marker" />
                <a href="#onmap">
                  {` ${size(vlist)} ${translator('results on map')}`}
                </a>
                <a href="#offmap">
                  {size(ilist) > 0 ? ` / ${size(ilist)} ${translator('off map')} ` : ' '}
                </a>
              </span>
              <span>
                | {translator('Sort')}:
                <span // eslint-disable-line
                  onClick={() => this.setSort('date')}
                  className={this.state.sort === 'date' ? 'boldme clickme' : 'clickme'}
                >
                  <icon className="fa fa-calendar" />
                  {translator('Date')}
                </span>
                <span // eslint-disable-line
                  onClick={() => this.setSort('observationcount')}
                  className={this.state.sort === 'observationcount' ? 'boldme clickme' : 'clickme'}
                >
                  <icon className="fa fa-video-camera" />
                  {translator('Observations')}
                </span>
                <span // eslint-disable-line
                  onClick={() => this.setSort('relevance')}
                  className={this.state.sort === 'relevance' ? 'boldme clickme' : 'clickme'}
                >
                  <icon className="fa fa-list-ol" />
                  {translator('Search Relevance')}
                </span>
                <span // eslint-disable-line
                  onClick={() => this.setSort('confidence')}
                  className={this.state.sort === 'confidence' ? 'boldme clickme' : 'clickme'}
                >
                  <icon className="fa fa-bullseye" />
                  {translator('Confidence')}
                </span>
              </span>
            </div>

            <div id="onnmap" className="visibleincidents" style={updating ? {opacity: '.3'} : {}}>
              {vlist}
            </div>
            <div style={{textAlign: 'center', color: '#aaa', padding: '3rem'}} >
              <div>▲</div>
              <div>{translator('On Map')}</div>
              <div>{translator('Off Map')}</div>
              <div>▼</div>
            </div>
            <div id="offmap" className="invisibleincidents" style={updating ? {opacity: '.3'} : {}}>
              {ilist}
            </div>
          </div>
          <div className="col-6 col-sm-12" style={updating ? {opacity: '.3'} : {}}>
            {leafletMap}
          </div>
        </div>

      </div>
    );
  }
}
