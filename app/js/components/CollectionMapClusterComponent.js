import React, { Component } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { map, uniqBy, isEqual, pick, size, isEmpty } from 'lodash/fp';
import MarkerClusterGroup from 'react-leaflet-markercluster';
// // Import JS from Leaflet and plugins.
// import 'leaflet/dist/leaflet';
// import 'leaflet.markercluster/dist/leaflet.markercluster';
import * as L from 'leaflet';


const mapW = map.convert({cap: false});


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


export class InvisibleCluster extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    const p = pick(['incidents']);
    return !(isEqual(p(nextProps), p(this.props)) && isEqual(this.state, nextState));
  }

  render() {
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

    const markers = makemarkers(uniqBy('id', this.props.incidents), false);

    if (size(markers) > 1) {
      return (
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
      );
    }
    if (size(markers) === 1) return markers[0];
    return isEmpty(markers) ? null : markers;
  }
}


export class VisibleCluster extends Component { // eslint-disable-line

  shouldComponentUpdate(nextProps, nextState) {
    const p = pick(['visibleIncidents']);
    return !(isEqual(p(nextProps), p(this.props)) && isEqual(this.state, nextState));
  }


  render() {
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

    const visiblemarkers = makemarkers(uniqBy('id', this.props.visibleIncidents));

    if (size(visiblemarkers) > 1) {
      return (
        <MarkerClusterGroup
          showCoverageOnHover={false}
          maxClusterRadius={20}
          ref="visiblemarkers" // eslint-disable-line
        >
          {visiblemarkers}
        </MarkerClusterGroup>
      );
    }
    if (size(visiblemarkers) === 1) return visiblemarkers[0];
    return isEmpty(visiblemarkers) ? null : visiblemarkers;
  }
}

export default {
  InvisibleCluster, VisibleCluster
};
