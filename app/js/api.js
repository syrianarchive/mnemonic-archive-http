import {databaseApiUrl} from '../../../env';

export const api = {
  get: resource => fetch(`${databaseApiUrl}/${resource}`, // eslint-disable-line
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(r => r.json()),
  post: (resource, params) => fetch(`${databaseApiUrl}/${resource}`, // eslint-disable-line
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    })
    .then(r => r.json())
};

export default {api};
