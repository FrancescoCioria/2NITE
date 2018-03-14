import request from 'request-promise';
import config from '../config.json';

export const get = (accessToken, uri, qs, getAll = true) => {
  const _request = request({
    uri,
    method: 'GET',
    qs: {
      access_token: accessToken,
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
  return fetch(`https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE?api_key=${config.airTableApiKey}`)
    .then(res => res.json())
    .then(json => {
      const userData = json.records.filter(r => r.fields.UserId === userId)[0];
      if (userData) {
        userDataId = userData.id;
        return {
          savedPlacesIds: JSON.parse(userData.fields.Pages || '[]'),
          pinnedEventIds: JSON.parse(userData.fields.Pinned || '[]'),
          dismissedEventIds: JSON.parse(userData.fields.Dismissed || '[]')
        };
      }
      return {};
    });
};

export const updatePlaces = (userId, savedPlacesIds) => {
  request({
    method: 'PATCH',
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE/${userDataId}?api_key=${config.airTableApiKey}`,
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
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE/${userDataId}?api_key=${config.airTableApiKey}`,
    body: {
      fields: {
        Pinned: JSON.stringify(pinnedEventIds)
      }
    },
    json: true
  });
};

export const updateDismissed = (userId, dismissedEventIds) => {
  request({
    method: 'PATCH',
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE/${userDataId}?api_key=${config.airTableApiKey}`,
    body: {
      fields: {
        Dismissed: JSON.stringify(dismissedEventIds)
      }
    },
    json: true
  });
};

export const createUser = (userId, savedPlacesIds) => {
  request({
    method: 'POST',
    uri: `https://api.airtable.com/v0/appdkslzk5QlO95EW/2NITE?api_key=${config.airTableApiKey}`,
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
