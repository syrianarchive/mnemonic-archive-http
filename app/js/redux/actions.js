// import Promise from 'bluebird';
import {merge, isEqual, isEmpty, pick, set} from 'lodash/fp';

import {store} from '../store';

import {api} from '../api';

export const requestUnits = received => ({type: 'REQUEST_UNITS', received});
export const updateUnits = units => ({type: 'UPDATE_UNITS', units});
export const updateStats = stats => ({type: 'UPDATE_STATS', stats});

export const requestCollection = received => ({type: 'REQUEST_COLLECTION', received});
export const updateCollection = units => ({type: 'UPDATE_COLLECTION', units});

const callApi = (path, filters, dispatch, requestFunc, updateFunc) => {
  dispatch(requestFunc(true));

  return api.post(path, filters)
    .then(r => {
      dispatch(updateFunc(r.units));
      dispatch(updateStats(r.stats));
      dispatch(requestFunc(false));
      return r;
    });
};

export const updateFilters = filters =>
  dispatch => {
    const current = store.getState();
    const f = merge(current.database.filters, filters);
    dispatch({
      type: 'UPDATE_FILTERS',
      filters: f,
    });
    // only ping the api if the filters have changed.
    if (!isEqual(f, current.database.filters) || isEmpty(current.database.ds)) {
      callApi('units', f, dispatch, requestUnits, updateUnits);
    }
  };

export const updateIncidentFilters = filters =>
  dispatch => {
    const current = store.getState();
    let f = merge(current.collection.filters, filters);
    if (filters.collections) {
      f = set('collections', filters.collections, f);
    }
    dispatch({
      type: 'UPDATE_FILTERS',
      filters: pick(['term'], f),
    });

    dispatch({
      type: 'UPDATE_INCIDENT_FILTERS',
      filters: f,
    });
    callApi('incidents', f, dispatch, requestCollection, updateCollection);
  };


export const resetFilters = () =>
  dispatch => api.post('units', {})
    .then(r => {
      dispatch(updateUnits(r.units));
      dispatch(updateStats(r.stats));
      dispatch(requestUnits(false));
      dispatch({
        type: 'RESET_FILTERS',
      });
      return r;
    });

export const selectUnit = unit => ({type: 'SELECT_UNIT', unit});
export const unsetUnit = () => ({type: 'UNSET_UNIT'});

export const selectIncident = incident => ({type: 'SELECT_INCIDENT', incident});
export const unsetIncident = () => ({type: 'UNSET_INCIDENT'});

export const retrieveIncident = id =>
  dispatch => {
    const current = store.getState().incident;
    console.log(id);
    // only ping the api if the filters have changed.
    if (!isEqual(id, current.id) || isEmpty(current.meat)) {
      dispatch({
        type: 'REQUEST_INCIDENT',
        received: false,
      });

      return api.get(`incidents/${id}`)
        .then(r => {
          dispatch(selectIncident(r));
          dispatch({
            type: 'REQUEST_INCIDENT',
            received: true,
          });
          return r;
        });
    }
  };

export const retrieveUnit = unitId =>
  dispatch => {
    const current = store.getState().unit;
    // only ping the api if the filters have changed.
    if (!isEqual(unitId, current.id) || isEmpty(current.meat)) {
      dispatch({
        type: 'REQUEST_UNIT',
        received: false,
      });

      return api.get(`units/${unitId}`)
        .then(r => {
          console.log(r);
          dispatch(selectUnit(r));
          dispatch({
            type: 'REQUEST_UNIT',
            received: true,
          });
          return r;
        });
    }
  };

export const getMeta = () =>
  dispatch => {
    const current = store.getState().database.meta;

    if (!(current && current.verified)) {
      return api.get('meta')
        .then(r => dispatch({type: 'INITIATE_META', meta: r}));
    }
  };


export default {
  updateFilters, resetFilters, getMeta, retrieveUnit, unsetUnit, selectUnit
};
