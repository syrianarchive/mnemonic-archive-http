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
      searchterm: params.filters.term || this.props.filters.term,
      typing: false,
      hoverUnit: false,
      range: [moment('2013-01-01').valueOf(), moment().valueOf()],
      visibleMarkers: [],
      sort: params.filters.term || this.props.filters.term ? 'relevance' : 'observationcount'
    };
  }


  componentWillMount() {
    const collection = this.props.match.params.collection;
    let cols = [];
    switch (collection) {
      case 'chemical-weapons':
        cols = ['Chemical weapons'];
        break;
      case 'russian-airstrikes':
        cols = ['Civilian casualties as a result of alleged russian attacks', 'Russian airstrikes in Syria'];
        break;
      case 'russian-mod-airstrikes':
        cols = ['Attacks claimed by Russian Ministry of Defense'];
        break;
      default:
        cols = [];
    }
    this.props.update({collections: cols});
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


  shouldComponentUpdate(nextProps, nextState) {
    const a = pick(['selectedIncident', 'incidents', 'updating']);
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
    this.setState({visibleMarkers: codes});
  }

  range(range) {
    this.setState({range});
  }

  hover(unit) {
    timeMeOut(() => {
      this.setState({hoverUnit: unit});
    }, 30);
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
    const visible = this.state.visibleMarkers;

    const incidents = this.props.incidents;

    const locationIncidents = filter(i => i.lat && i.lon, incidents);
    const nolocationIncidents = filter(i => !i.lat && !i.lon, incidents);

    const visiblebymap = size(visible) > 0
          ? intersectionBy('id', incidents, visible)
          : locationIncidents;

    const visibleIncidents =
      filter((d) =>
      (moment(d.annotations.incident_date || d.annotations.ru_upload) >= moment(this.state.range[0])
        && moment(d.annotations.incident_date || d.annotations.ru_upload) <= moment(this.state.range[1])), visiblebymap); // eslint-disable-line

    const invisibleIncidents = size(visible) > 0
          ? uniqBy('id', concat(xorBy('id', incidents, visible), nolocationIncidents))
          : nolocationIncidents;

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

    const leafletMap = (
      <CollectionMapComponent
        incidents={locationIncidents}
        visible={this.visible}
        visibleIncidents={visibleIncidents}
        hoverUnit={this.state.hoverUnit}
        updateFrontentView={this.updateFrontentView}
        selector={this.props.selectIncident}
        updateRange={this.range}
      />);

    const singleMap = (
      <CollectionMapComponent
        incidents={[this.props.selectedIncident]}
        visibleIncidents={[this.props.selectedIncident]}
        visible={() => {}}
        updateFrontentView={() => {}}
        updateRange={() => {}}
      />);


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
              {singleMap}
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
