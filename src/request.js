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
