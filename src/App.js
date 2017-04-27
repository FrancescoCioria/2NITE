import React from 'react';
import debounce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import View from 'react-flexview';
import { t } from 'tcomb-react';
import { get } from './request';
import EventsPage from './EventsPage';
import WelcomePage from './WelcomePage';
import PlacesHeader from './PlacesHeader';

import 'buildo-normalize-css';
import 'buildo-normalize-css/fullscreenApp.css';
import 'react-flexview/lib/flexView.css';
import './app.css';

t.interface.strict = true;

export default class App extends React.Component {

  state = {
    savedPlacesIds: localStorage.getItem('savedPlacesIds') ? localStorage.getItem('savedPlacesIds').split(',') : null,
    events: null,
    places: null,
    searchQuery: null
  }

  pad2(value) {
    return value > 9 ? value : `0${value}`;
  }

  getPlaces() {
    const { savedPlacesIds } = this.state;
    const placesRequest = savedPlacesIds.map(v => get(`https://graph.facebook.com/${v}`));

    Promise.all(placesRequest).then(placesResponse => {
      this.setState({ places: sortBy(placesResponse, p => p.name.toLowerCase()) });
    });
  }

  getEvents() {
    const { savedPlacesIds } = this.state;

    const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const todayString = [
      today.getFullYear(),
      this.pad2(today.getMonth()),
      this.pad2(today.getDate())
    ].join('-');

    const eventsRequest = savedPlacesIds.map(v => get(`https://graph.facebook.com/${v}/events`, { since: todayString }));

    Promise.all(eventsRequest).then(eventsResponse => {
      const flattenEvents = flatten(eventsResponse.map(r => r.data));
      const events = flattenEvents.filter(e => new Date(e.start_time) > today);

      this.setState({ events });
    });
  }

  componentDidMount() {
    if (this.state.savedPlacesIds) {
      this.getPlaces();
      this.getEvents();
    }
  }

  onAddPlaces = places => {
    const savedPlacesIds = places.map(p => p.value);

    localStorage.setItem('savedPlacesIds', savedPlacesIds.join(','));
    this.setState({ savedPlacesIds }, () => {
      this.getPlaces();
      this.getEvents();
    });
  }

  onSearch = debounce(searchQuery => this.setState({ searchQuery }), 300)

  filterEvents = (events, searchQuery) => {
    if (events && searchQuery) {
      const searchQueries = searchQuery.toLowerCase().split(' ').filter(s => s.length > 0);
      return events.filter(e => !!searchQueries.find(s => `${e.name}__${e.place.name}`.toLowerCase().indexOf(s) !== -1));
    }

    return events;
  }

  render() {
    const {
      state: { places, events, searchQuery, savedPlacesIds },
      onAddPlaces, onSearch, filterEvents
    } = this;

    const showWelcomePage = !savedPlacesIds;
    const showEventsPage = !showWelcomePage;

    return (
      <View className='app' hAlignContent='center'>
        {showWelcomePage && <WelcomePage onAddPlaces={onAddPlaces} />}
        {showEventsPage && (
          <PlacesHeader
            places={places || []}
            onSearch={onSearch}
            onEditPlaces={onAddPlaces}
          />
        )}
        {showEventsPage && (
          <EventsPage
            places={places}
            events={filterEvents(events, searchQuery)}
          />
        )}
      </View>
    );
  }
}
