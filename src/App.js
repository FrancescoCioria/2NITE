import React from 'react';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import request from 'request-promise';
import View from 'react-flexview';
import LoadingSpinner from 'buildo-react-components/lib/loading-spinner';
import 'buildo-react-components/lib/loading-spinner/loadingSpinner.css';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';
import Events from './Events';
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
    events: null,
    places: null
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

    Promise.all(eventsRequest).then(eventsResponse => {
      const flattenEvents = flatten(eventsResponse.map(r => r.data));
      const events = flattenEvents.filter(e => new Date(e.start_time) > today);

      this.setState({ events });
    });

    Promise.all(placesRequest).then(placesResponse => {
      this.setState({ places: placesResponse });
    });
  }

  templateByPlace(events, placeId) {
    if (placeId) {
      const placeEvents = sortBy(events, e => e.start_time).filter(e => e.place.id === placeId);
      return <Events events={placeEvents} />;
    } else {
      return <Events events={events} />;
    }
  }

  templatePlaceholder() {
    return (
      <View className='event' marginTop={120} marginBottom={30} style={{ position: 'relative', overflow: 'visible' }}>
        <View style={{ position: 'absolute', top: -65 }} width='100%' height={30}>
          <LoadingSpinner overlayColor='transparent' size={30} />
        </View>
        <View width='100%'>
          <RectShape color='#eaeaea' style={{ flex: '0 0 200px', height: 200 }} />
          <View column grow style={{ padding: 16 }}>
            <TextBlock rows={1} color='#eaeaea' style={{ height: 15 }} />
            <View width='30%' basis={8} marginTop={8} style={{ background: '#eaeaea' }} />
            <TextBlock rows={3} color='#efefef' style={{ height: 60, marginTop: 'auto' }} />
          </View>
        </View>
      </View>
    )
  }

  render() {
    const { places, events, selectedPlaceId } = this.state;

    const ready = !!places && !!events;
    return (
      <View className='app' hAlignContent='center'>
        <PlacesHeader
          places={places || []}
          selectedPlaceId={selectedPlaceId}
          onSelect={(selectedPlaceId) => this.setState({ selectedPlaceId })}
        />
        <View className='body' grow column>
          {!ready && this.templatePlaceholder()}
          {ready && this.templateByPlace(events, selectedPlaceId)}
        </View>
      </View>
    );
  }
}
