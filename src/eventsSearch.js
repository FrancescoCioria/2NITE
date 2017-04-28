/* eslint-disable */
import rp from 'request-promise';

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    events: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          coverPicture: {
            type: ['string', 'null']
          },
          profilePicture: {
            type: 'string'
          },
          description: {
            type: ['string', 'null']
          },
          distance: {
            type: 'string'
          },
          startTime: {
            type: 'string'
          },
          endTime: {
            type: ['string', 'null']
          },
          timeFromNow: {
            type: 'integer'
          },
          category: {
            type: ['string', 'null']
          },
          stats: {
            type: 'object',
            properties: {
              attending: {
                type: 'integer'
              },
              declined: {
                type: 'integer'
              },
              maybe: {
                type: 'integer'
              },
              noreply: {
                type: 'integer'
              }
            },
            required: [
              'attending',
              'declined',
              'maybe',
              'noreply'
            ]
          },
          venue: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              },
              name: {
                type: 'string'
              },
              about: {
                type: ['string', 'null']
              },
              emails: {
                type: ['array', 'null']
              },
              coverPicture: {
                type: 'string'
              },
              profilePicture: {
                type: 'string'
              },
              category: {
                type: ['string', 'null']
              },
              categoryList: {
                type: ['array', 'null']
              },
              location: {
                type: 'object',
                properties: {
                  city: {
                    type: 'string'
                  },
                  country: {
                    type: 'string'
                  },
                  latitude: {
                    type: 'number'
                  },
                  longitude: {
                    type: 'number'
                  },
                  state: {
                    type: 'string'
                  },
                  street: {
                    type: 'string'
                  },
                  zip: {
                    type: 'string'
                  }
                },
                required: [
                  'latitude',
                  'longitude'
                ]
              }
            },
            required: [
              'id',
              'name',
              'location'
            ]
          }
        },
        required: [
          'id',
          'name',
          'distance',
          'startTime',
          'timeFromNow',
          'stats',
          'venue'
        ]
      }
    },
    metadata: {
      type: 'object',
      properties: {
        venues: {
          type: 'integer'
        },
        venuesWithEvents: {
          type: 'integer'
        },
        events: {
          type: 'integer'
        }
      },
      required: [
        'venues',
        'venuesWithEvents',
        'events'
      ]
    }
  },
  required: [
    'events',
    'metadata'
  ]
};

const EventSearch = function(options) {

  let self = this,
    allowedSorts = ['time', 'distance', 'venue', 'popularity'];

  self.latitude = options.lat || null;
  self.longitude = options.lng || null;
  self.distance = options.distance || 100;
  self.accessToken = options.accessToken ? options.accessToken : (process.env.FEBL_ACCESS_TOKEN && process.env.FEBL_ACCESS_TOKEN !== '' ? process.env.FEBL_ACCESS_TOKEN : null);
  self.query = options.query ? encodeURIComponent(options.query) : '';
  self.sort = options.sort ? (allowedSorts.indexOf(options.sort.toLowerCase()) > -1 ? options.sort.toLowerCase() : null) : null;
  self.version = options.version ? options.version : 'v2.7';
  self.since = options.since || (new Date().getTime() / 1000).toFixed();
  self.until = options.until || null;
  self.schema = schema;

};

EventSearch.prototype.calculateStarttimeDifference = function(currentTime, dataString) {
  return (new Date(dataString).getTime() - (currentTime * 1000)) / 1000;
};

EventSearch.prototype.compareVenue = function(a, b) {
  if (a.venue.name < b.venue.name)
    {return -1;}
  if (a.venue.name > b.venue.name)
    {return 1;}
  return 0;
};

EventSearch.prototype.compareTimeFromNow = function(a, b) {
  if (a.timeFromNow < b.timeFromNow)
    {return -1;}
  if (a.timeFromNow > b.timeFromNow)
    {return 1;}
  return 0;
};

EventSearch.prototype.compareDistance = function(a, b) {
  const aEventDistInt = parseInt(a.distance, 10);
  const bEventDistInt = parseInt(b.distance, 10);
  if (aEventDistInt < bEventDistInt)
    {return -1;}
  if (aEventDistInt > bEventDistInt)
    {return 1;}
  return 0;
};

EventSearch.prototype.comparePopularity = function(a, b) {
  if ((a.stats.attending + (a.stats.maybe / 2)) < (b.stats.attending + (b.stats.maybe / 2)))
    {return 1;}
  if ((a.stats.attending + (a.stats.maybe / 2)) > (b.stats.attending + (b.stats.maybe / 2)))
    {return -1;}
  return 0;
};

EventSearch.prototype.haversineDistance = function(coords1, coords2, isMiles) {

    //coordinate is [latitude, longitude]
  function toRad(x) {
    return x * Math.PI / 180;
  }

  const lon1 = coords1[1];
  const lat1 = coords1[0];

  const lon2 = coords2[1];
  const lat2 = coords2[0];

  const R = 6371; // km

  const x1 = lat2 - lat1;
  const dLat = toRad(x1);
  const x2 = lon2 - lon1;
  const dLon = toRad(x2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  if (isMiles) {d = d / 1.60934;}

  return d;

};

EventSearch.prototype.search = function() {

  const self = this;

  function getPlaces(url) {
    let results;
    let temp;

    function getPlacesPaging(first, url, after) {
      let tempurl;
      if (after !== '') {
        tempurl = `${url  }&after=${  after}`;
      } else {
        tempurl = url;
      }
      return rp.get(tempurl).then((responseBody) => {
        temp = JSON.parse(responseBody);
        if (first) {
          results = temp;
        } else {
          temp.data.forEach((item, index, arr) => {
            results.data.push(item);
          });
        }
        if (temp.paging && temp.paging.cursors && temp.paging.cursors.after) {
          return getPlacesPaging(false, url, temp.paging.cursors.after);
        } else {
          return results;
        }
      });
    }
    return getPlacesPaging(true, url, '');
  }

  return new Promise((resolve, reject) => {

    if (!self.latitude || !self.longitude) {
      var error = {
        message: 'Please specify the lat and lng parameters!',
        code: 1
      };
      console.error(JSON.stringify(error));
      reject(error);
    } else if (!self.accessToken) {
      var error = {
        message: 'Please specify an Access Token, either as environment variable or as accessToken parameter!',
        code: 2
      };
      console.error(JSON.stringify(error));
      reject(error);
    } else {

      let idLimit = 50, //FB only allows 50 ids per /?ids= call
        currentTimestamp = (new Date().getTime() / 1000).toFixed(),
        venuesCount = 0,
        venuesWithEvents = 0,
        eventsCount = 0,
        placeUrl = `https://graph.facebook.com/${  self.version  }/search` +
                    '?type=place' +
                    `&q=${  self.query
                    }&center=${  self.latitude  },${  self.longitude
                    }&distance=${  self.distance
                    }&limit=100` +
                    '&fields=id' +
                    `&access_token=${  self.accessToken}`;

            //Get places as specified
      getPlaces(placeUrl).then((responseBody) => {

        let ids = [],
          tempArray = [],
          data = responseBody.data;

                //Set venueCount
        venuesCount = data.length;

                //Create array of 50 places each
        data.forEach((idObj, index, arr) => {
          tempArray.push(idObj.id);
          if (tempArray.length >= idLimit) {
            ids.push(tempArray);
            tempArray = [];
          }
        });

                // Push the remaining places
        if (tempArray.length > 0) {
          ids.push(tempArray);
        }

        return ids;
      }).then((ids) => {

        const urls = [];

                //Create a Graph API request array (promisified)
        ids.forEach((idArray, index, arr) => {
          const eventsFields = [
            'id',
            'type',
            'name',
            'cover.fields(id,source)',
            'picture.type(large)',
            'description',
            'start_time',
            'end_time',
            'category',
            'attending_count',
            'declined_count',
            'maybe_count',
            'noreply_count'
          ];
          const fields = [
            'id',
            'name',
            'about',
            'emails',
            'cover.fields(id,source)',
            'picture.type(large)',
            'category',
            'category_list.fields(name)',
            'location',
            `events.fields(${  eventsFields.join(',')  })`
          ];
          let eventsUrl = `https://graph.facebook.com/${  self.version  }/` +
                        `?ids=${  idArray.join(',')
                        }&access_token=${  self.accessToken
                        }&fields=${  fields.join(',')
                        }.since(${  self.since  })`;
          if (self.until) {
            eventsUrl = `${eventsUrl  }.until(${  self.until  })`;
          }
          urls.push(rp.get(eventsUrl));
        });

        return urls;

      }).then((promisifiedRequests) => {

                //Run Graph API requests in parallel
        return Promise.all(promisifiedRequests);

      })
            .then((results) => {

              const events = [];

                //Handle results
              results.forEach((resStr, index, arr) => {
                const resObj = JSON.parse(resStr);
                Object.getOwnPropertyNames(resObj).forEach((venueId, index, array) => {
                  const venue = resObj[venueId];
                  if (venue.events && venue.events.data.length > 0) {
                    venuesWithEvents++;
                    venue.events.data.forEach((event, index, array) => {
                      const eventResultObj = {};
                      let categoryList = null;
                      if (venue.category_list && Array.isArray(venue.category_list)) {
                        categoryList = [];
                        venue.category_list.forEach((categoryObj) => {
                          if (categoryObj.name) {
                            categoryList.push(categoryObj.name);
                          }
                        });
                      }
                      eventResultObj.id = event.id;
                      eventResultObj.name = event.name;
                      eventResultObj.type = event.type;
                      eventResultObj.coverPicture = (event.cover ? event.cover.source : null);
                      eventResultObj.profilePicture = (event.picture ? event.picture.data.url : null);
                      eventResultObj.description = (event.description ? event.description : null);
                      eventResultObj.distance = (venue.location ? (self.haversineDistance([venue.location.latitude, venue.location.longitude], [self.latitude, self.longitude], false) * 1000).toFixed() : null);
                      eventResultObj.startTime = (event.start_time ? event.start_time : null);
                      eventResultObj.endTime = (event.end_time ? event.end_time : null);
                      eventResultObj.timeFromNow = self.calculateStarttimeDifference(currentTimestamp, event.start_time);
                      eventResultObj.category = (event.category ? event.category : null);
                      eventResultObj.stats = {
                        attending: event.attending_count,
                        declined: event.declined_count,
                        maybe: event.maybe_count,
                        noreply: event.noreply_count
                      };
                      eventResultObj.venue = {};
                      eventResultObj.venue.id = venueId;
                      eventResultObj.venue.name = venue.name;
                      eventResultObj.venue.about = (venue.about ? venue.about : null);
                      eventResultObj.venue.emails = (venue.emails ? venue.emails : null);
                      eventResultObj.venue.coverPicture = (venue.cover ? venue.cover.source : null);
                      eventResultObj.venue.profilePicture = (venue.picture ? venue.picture.data.url : null);
                      eventResultObj.venue.category = (venue.category ? venue.category : null);
                      eventResultObj.venue.categoryList = categoryList;
                      eventResultObj.venue.location = (venue.location ? venue.location : null);
                      events.push(eventResultObj);
                      eventsCount++;
                    });
                  }
                });
              });

                //Sort if requested
              if (self.sort) {
                switch (self.sort) {
                  case 'time':
                    events.sort(self.compareTimeFromNow);
                    break;
                  case 'distance':
                    events.sort(self.compareDistance);
                    break;
                  case 'venue':
                    events.sort(self.compareVenue);
                    break;
                  case 'popularity':
                    events.sort(self.comparePopularity);
                    break;
                  default:
                    break;
                }
              }

                //Produce result object
              resolve({ events, metadata: { venues: venuesCount, venuesWithEvents, events: eventsCount } });

            }).catch((e) => {
              const error = {
                message: e,
                code: -1
              };
              console.error(JSON.stringify(error));
              reject(error);
            });
    }

  });

};

EventSearch.prototype.getSchema = function() {
  return this.schema;
};

module.exports = EventSearch;
