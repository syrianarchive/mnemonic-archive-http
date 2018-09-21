/* global locale */
import {find} from 'lodash/fp';
import locations from '../../../../locations.json';


export const unitTitle = u =>
  u[`summary_${locale}`] ||
  u[`online_title_${locale}`] ||
  u.description;

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
