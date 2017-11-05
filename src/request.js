import request from 'request-promise';

export const get = (uri, qs, getAll = true) => {
  const _request = request({
    uri,
    method: 'GET',
    qs: {
      access_token: '963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY',
      ...qs
    },
    json: true
  });

  return _request.then(res => getAll && res.paging && res.paging.next ?
    get(res.paging.next).then(r => ({ data: res.data.concat(r.data), paging: r.paging })) :
    res
  );
};

export const getPreferences = userId => {
  return fetch('https://jsonblob.com/api/jsonBlob/79a9f907-c23f-11e7-ae0d-6b2a6474f4cc')
    .then(res => res.json())
    .then(json => json[userId] || {});
};

export const updatePreferences = (userId, savedPlacesIds = [], pinnedEventIds = []) => {
  return fetch('https://jsonblob.com/api/jsonBlob/79a9f907-c23f-11e7-ae0d-6b2a6474f4cc')
    .then(res => res.json())
    .then(json => {
      request({
        method: 'PUT',
        uri: 'https://jsonblob.com/api/jsonBlob/79a9f907-c23f-11e7-ae0d-6b2a6474f4cc',
        body: {
          ...json,
          [userId]: { savedPlacesIds, pinnedEventIds }
        },
        json: true
      });
    });
};
