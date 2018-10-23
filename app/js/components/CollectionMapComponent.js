import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { map, size, filter, isEmpty, uniqBy, isEqual, pick } from 'lodash/fp';
import MarkerClusterGroup from 'react-leaflet-markercluster';
// // Import JS from Leaflet and plugins.
// import 'leaflet/dist/leaflet';
// import 'leaflet.markercluster/dist/leaflet.markercluster';
import * as L from 'leaflet';

import Timeline from './CollectionTimelineComponent';

const mapW = map.convert({cap: false});

// dirty dirty hack
let tmap;
let a = true;
let humanchange = false;

const DEFAULT_VIEWPORT = {
  center: [34.8021, 38.9968],
  zoom: 1,
};

const image = new L.Icon({
  iconUrl: '/assets/leafleticon.png',
  iconSize: [30, 30], // size of the icon
  shadowSize: [0, 0], // size of the shadow
  iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -0]// point from which the popup should open relative to the iconAnchor
});
const noimage = new L.Icon({
  iconSize: [1, 1], // size of the icon
  iconUrl: '/assets/leafleticon.png',
  shadowSize: [0, 0], // size of the shadow
  iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -0]// point from which the popup should open relative to the iconAnchor
});


export default class CollectionMapComponent extends Component {
  constructor(props) {
    super(props);
    this.updateBounds = this.updateBounds.bind(this);

    this.state = {
      viewport: DEFAULT_VIEWPORT
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = pick(['visibleIncidents', 'hoverUnit', 'incidents']);
    return !(isEqual(p(nextProps), p(this.props)) && isEqual(this.state, nextState));
  }


  componentDidUpdate(prevProps) {
    if (a || !isEqual(prevProps.incidents, this.props.incidents)) {
      humanchange = false;
      this.updateBounds('visiblemarkers');

      a = false;
    }
  }


  onViewportChanged() {
    if (tmap && humanchange) {
      const visible = filter(m => tmap.getBounds().contains(m), this.markerData);
      this.visible(visible);
      this.updateFrontentView();
    }
    humanchange = true;
  }


  updateBounds(ref) {
    const map = this.refs.map.leafletElement;//eslint-disable-line
    tmap = map;
    if (this.refs[ref]) { // eslint-disable-line
      const markers = this.refs[ref].leafletElement;//eslint-disable-line
      map.fitBounds(markers.getBounds());
    } else if (this.refs.marker0) { // eslint-disable-line
      const marker = this.refs.marker0.leafletElement;//eslint-disable-line
      map.setView(marker.getLatLng(), 14);
    }
  }


  render() {
    console.log('rendermaaaapppppppppppppp');
    const makemarkers = (ms, visible = true) => mapW((i, n) =>
      (<Marker
        key={i.aid}
        position={[i.lat, i.lon]}
        ref={`marker${n}`} // eslint-disable-line
        icon={visible ? image : noimage}
        onClick={() => this.props.selector(i)}
      >
        <Popup>
          <span>
            {i.incident_code}
          </span>
        </Popup>
      </Marker>)
    , ms);

    console.time('making markers');
    const markers = makemarkers(uniqBy('id', this.props.incidents), false);
    const visiblemarkers = makemarkers(uniqBy('id', this.props.visibleIncidents));
    console.timeEnd('making markers');


    return (
      <div id="mapcol" className="mapcol">
        <Map
          markerData={this.props.incidents
          //   map(i => ({
          //   lat: i.lat,
          //   lon: i.lon,
          //   incident_code: i.incident_code,
          // }), this.props.incidents)
          }
          onViewportChanged={this.onViewportChanged}
          visible={this.props.visible}
          updateFrontentView={this.props.updateFrontentView}
          scrollWheelZoom={false}
          ref="map" // eslint-disable-line
        >
          <TileLayer
            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {!isEmpty(this.props.hoverUnit) ?
            <CircleMarker
              center={[this.props.hoverUnit.lat, this.props.hoverUnit.lon]}
              color="teal" fillColor="teal" radius={24}
            />
          : ''}


          {size(markers) > 1 ?
            <MarkerClusterGroup
              ref="markers" // eslint-disable-line
              maxClusterRadius={20}
              showCoverageOnHover={false}
              iconCreateFunction={(cluster) =>
                L.divIcon({ html: `<div><span>${cluster.getChildCount()}</span></div>`,
                  className: 'marker-cluster marker-cluster-small cluhidden' })
              }
            >
              {markers}
            </MarkerClusterGroup>
          : markers }
          {size(visiblemarkers) > 1 ?
            <MarkerClusterGroup
              showCoverageOnHover={false}
              maxClusterRadius={20}
              ref="visiblemarkers" // eslint-disable-line
              // iconCreateFunction={(cluster) =>
              //   L.divIcon({ html: `<div><span>${cluster.getChildCount()}</span></div>`,
              // className: 'marker-cluster marker-cluster-small clusterhidden' })
              // }
            >
              {visiblemarkers}
            </MarkerClusterGroup>
          : visiblemarkers }

        </Map>
        <Timeline
          units={uniqBy('incident_code', this.props.visibleIncidents)}
          updateRange={this.props.updateRange}
        />
      </div>
    );
  }
}
