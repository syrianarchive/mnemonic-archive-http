/* global locale */
import {merge} from 'lodash/fp';

import basic from './translations.json';

let custom;

try {
  custom = require('../custom-translations.json'); // eslint-disable-line
} catch (ex) {
  custom = {};
}

const translations = merge(basic, custom);

const t = (s, l = locale) => {
  try {
    return translations[l][s.toLowerCase()] ? translations[l][s.toLowerCase()] : s;
  } catch (e) {
    return s;
  }
};
export default t;
