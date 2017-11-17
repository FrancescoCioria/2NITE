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

let userDataId = null;
export const getPreferences = userId => {
  return fetch('https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE?api_key=keyRXab9tyXiaFoAd')
    .then(res => res.json())
    .then(json => {
      const userData = json.records.filter(r => r.fields.UserId === userId)[0];
      if (userData) {
        userDataId = userData.id;
        return {
          savedPlacesIds: JSON.parse(userData.fields.Pages || '[]'),
          pinnedEventIds: JSON.parse(userData.fields.Pinned || '[]')
        };
      }
      return {};
    });
};

export const updatePlaces = (userId, savedPlacesIds) => {
  request({
    method: 'PATCH',
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE/${userDataId}?api_key=keyRXab9tyXiaFoAd`,
    body: {
      fields: {
        Pages: JSON.stringify(savedPlacesIds)
      }
    },
    json: true
  });
};

export const updatePinned = (userId, pinnedEventIds) => {
  request({
    method: 'PATCH',
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE/${userDataId}?api_key=keyRXab9tyXiaFoAd`,
    body: {
      fields: {
        Pinned: JSON.stringify(pinnedEventIds)
      }
    },
    json: true
  });
};

export const createUser = (userId, savedPlacesIds) => {
  request({
    method: 'POST',
    uri: 'https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE?api_key=keyRXab9tyXiaFoAd',
    body: {
      fields: {
        UserId: userId,
        Pages: JSON.stringify(savedPlacesIds)
      }
    },
    json: true
  }).then(res => {
    userDataId = res.id;
  });
};
