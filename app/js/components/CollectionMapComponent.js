import React, { Component } from 'react';
import { Map, TileLayer, CircleMarker } from 'react-leaflet';
import {filter, isEmpty, uniqBy, isEqual, pick } from 'lodash/fp';
// // Import JS from Leaflet and plugins.
// import 'leaflet/dist/leaflet';
// import 'leaflet.markercluster/dist/leaflet.markercluster';

import Timeline from './CollectionTimelineComponent';
import {VisibleCluster, InvisibleCluster} from './CollectionMapClusterComponent';

// const mapW = map.convert({cap: false});

// dirty dirty hack
let tmap;
let a = true;
let humanchange = false;
let humanviewport = false;


const DEFAULT_VIEWPORT = {
  center: [34.7000, 38.9968],
  zoom: 7,
};

let vp = DEFAULT_VIEWPORT;
let zoomedvp = DEFAULT_VIEWPORT;
let individual = false;

export default class CollectionMapComponent extends Component {
  constructor(props) {
    super(props);
    this.updateBounds = this.updateBounds.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const p = pick(['visibleIncidents', 'hoverUnit', 'incidents', 'individual']);
    individual = nextProps.individual;
    if (a || !isEqual(nextProps.hoverUnit, this.props.hoverUnit)) {
      humanviewport = false;
      // this.updateBounds('visiblemarkers');
    }
    return !(isEqual(p(nextProps), p(this.props)) && isEqual(this.state, nextState));
  }


  componentDidUpdate(prevProps) {
    if (a || !isEqual(prevProps.incidents, this.props.incidents)) {
      humanchange = false;
      this.updateBounds('visiblemarkers');
      a = false;
    }
  }


  onViewportChanged(nvp) {
    if (!individual) {
      vp = nvp;
    } else {
      zoomedvp = nvp;
    }
    if (tmap && humanchange) {
      const visible = filter(m => tmap.getBounds().contains(m), this.markerData);
      this.visible(visible);
      this.updateFrontentView();
    }
    humanchange = true;
    humanviewport = true;
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
    // const makemarkers = (ms, visible = true) => mapW((i, n) =>
    //   (<Marker
    //     key={i.aid}
    //     position={[i.lat, i.lon]}
    //     ref={`marker${n}`} // eslint-disable-line
    //     icon={visible ? image : noimage}
    //     onClick={() => this.props.selector(i)}
    //   >
    //     <Popup>
    //       <span>
    //         {i.incident_code}
    //       </span>
    //     </Popup>
    //   </Marker>)
    // , ms);
    //

    // console.time('making markers');
    // const markers = this.state.markers;
    // const visiblemarkers = makemarkers(uniqBy('id', this.props.visibleIncidents));
    // console.timeEnd('making markers');
    //


    if (!humanviewport && this.props.individual && this.props.hoverUnit) {
      zoomedvp = {
        center: [this.props.hoverUnit.lat, this.props.hoverUnit.lon],
        zoom: 14
      };
    }

    const viewport = this.props.individual ? zoomedvp : vp;

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
          viewport={viewport}
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

          <InvisibleCluster
            incidents={this.props.incidents}
            visibleIncidents={this.props.visibleIncidents}
            selector={this.props.selector}
          />

          <VisibleCluster
            incidents={this.props.incidents}
            visibleIncidents={this.props.visibleIncidents}
            selector={this.props.selector}
          />


        </Map>
        <Timeline
          units={uniqBy('incident_code', this.props.visibleIncidents)}
          updateRange={this.props.updateRange}
        />
      </div>
    );
  }
}
