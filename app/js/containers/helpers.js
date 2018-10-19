/* global locale */
import {find} from 'lodash/fp';
import locations from '../../../../locations.json';


export const unitTitle = u =>
  u.annotations[`summary_${locale}`] ||
  u.annotations[`online_title_${locale}`] ||
  u.annotations.description;

export const incidentTitle = i => i.annotations[`title_${locale}`];

export const incidentSummary = i => i.annotations[`summary_${locale}`];

let timeout = null;
export const timeMeOut = (func, time = 500) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    func();
  }, time);
};

const finda = a =>
  (find(l => l.name_ar === a, locations) ? find(l => l.name_ar === a, locations).name : a);

export const location = (arloc) =>
  (locale === 'ar' ? arloc : finda(arloc));

export default {unitTitle, timeMeOut, location};
