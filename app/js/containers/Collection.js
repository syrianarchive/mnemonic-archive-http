import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

import CollectionComponent from '../components/CollectionComponent';

import {updateIncidentFilters, resetFilters, unsetUnit, selectIncident, retrieveIncident, unsetIncident, retrieveUnit} from '../redux/actions';

const mapStateToProps = (state) => ({
  filters: state.database.filters,
  stats: state.database.stats,
  possibilities: state.database.possibilities,
  updating: state.collection.updating,
  incidents: state.collection.ds,
  meta: state.meta,
  selectedIncident: state.incident.meat,
  selectedUnit: state.unit.meat,
});

const mapDispatchToProps = (dispatch) => ({
  update: (f) => dispatch(updateIncidentFilters(f)),
  reset: () => dispatch(resetFilters()),
  getIncident: (id) => dispatch(retrieveIncident(id)),
  selectIncident: (u) => dispatch(selectIncident(u)),
  clearIncident: () => dispatch(unsetIncident()),
  getUnit: (id) => dispatch(retrieveUnit(id)),
  clearUnit: () => dispatch(unsetUnit()),
});

const Collection = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CollectionComponent));

export default Collection;
