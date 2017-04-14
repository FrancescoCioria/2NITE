import React from 'react';
import flatten from 'lodash/flatten';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import request from 'request-promise';
import View from 'react-flexview';
import Event from './Event';
import DateHeader from './DateHeader';
import PlacesHeader from './PlacesHeader';

import 'buildo-normalize-css';
import 'buildo-normalize-css/fullscreenApp.css';
import 'react-flexview/lib/flexView.css';
import './app.css';

const venues = [
  'bikocultureclub',
  'bonaventura.mi',
  'santeriasocialclub',
  'circolomagnolia',
  'alcatrazmilano'
].sort();

const get = (uri, qs) => {
  const _request = request({
    uri,
    method: 'GET',
    qs: {
      access_token: '963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY',
      ...qs
    },
    json: true
  });

  return _request.then(res => res.paging && res.paging.next ?
    get(res.paging.next).then(r => ({ data: res.data.concat(r.data), paging: r.paging })) :
    res
  );
}

export default class App extends React.Component {

  state = {
    loading: true,
    events: [],
    places: []
  }

  pad2(value) {
    return value > 9 ? value : `0${value}`;
  }

  componentDidMount() {
    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const todayString = [
      today.getFullYear(),
      this.pad2(today.getMonth()),
      this.pad2(today.getDate())
    ].join('-');

    const eventsRequest = venues.map(v => get(`https://graph.facebook.com/${v}/events`, { since: todayString }));
    const placesRequest = venues.map(v => get(`https://graph.facebook.com/${v}`, { since: todayString }));

    const requests = Promise.all([
      Promise.all(eventsRequest),
      Promise.all(placesRequest)
    ]);

    requests.then(([eventsResponse, placesResponse]) => {
      const flattenEvents = flatten(eventsResponse.map(r => r.data));
      const events = flattenEvents.filter(e => new Date(e.start_time) > today);

      this.setState({
        events,
        places: placesResponse
      });
    });
  }

  templateByDate(events) {
    const eventsByDate = groupBy(sortBy(events, e => e.start_time), e => e.start_time.slice(0, 10));

    return Object.keys(eventsByDate).map(k => {
      return (
        <View column shrink={false} key={k}>
          {<DateHeader date={new Date(k)} />}
          {eventsByDate[k].map(e => <Event {...e} key={e.id} />)}
        </View>
      );
    });
  }

  templateByPlace(events, placeId) {
    const placeEvents = sortBy(events, e => e.start_time).filter(e => e.place.id === placeId);

    return placeId ? this.templateByDate(placeEvents) : this.templateByDate(events);
  }

  render() {
    return (
      <View className='app' hAlignContent='center'>
        <PlacesHeader
          places={this.state.places}
          selectedPlaceId={this.state.selectedPlaceId}
          onSelect={(selectedPlaceId) => this.setState({ selectedPlaceId })}
        />
        <View className='body' grow column>
          {this.templateByPlace(this.state.events, this.state.selectedPlaceId)}
        </View>
      </View>
    );
  }
}
