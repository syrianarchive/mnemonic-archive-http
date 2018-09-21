import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

import DatabaseComponent from '../components/DatabaseComponent';

import {updateFilters, resetFilters, selectUnit, retrieveUnit, unsetUnit} from '../redux/actions';

const mapStateToProps = (state) => ({
  filters: state.database.filters,
  stats: state.database.stats,
  updating: state.database.updating,
  units: state.database.ds,
  meta: state.meta,
  selectedUnit: state.unit.meat,
});

const mapDispatchToProps = dispatch => ({
  update: (f) => dispatch(updateFilters(f)),
  reset: () => dispatch(resetFilters()),
  getUnit: (id) => dispatch(retrieveUnit(id)),
  selectUnit: (u) => dispatch(selectUnit(u)),
  clearUnit: () => dispatch(unsetUnit()),
});

const Database = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DatabaseComponent));

export default Database;
