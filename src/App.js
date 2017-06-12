import React from 'react';
import debounce from 'lodash/debounce';
import flatten from 'lodash/flatten';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import View from 'react-flexview';
import { TimerToast } from 'buildo-react-components/lib/toaster';
import TextOverflow from 'buildo-react-components/lib/text-overflow';
import { t } from 'tcomb-react';
import { get } from './request';
import EventSearch from './eventsSearch';
import EventsPage from './EventsPage';
import WelcomePage from './WelcomePage';
import PlacesHeader from './PlacesHeader';
import Toaster from './Toaster';

import 'buildo-normalize-css';
import 'buildo-normalize-css/fullscreenApp.css';
import 'react-flexview/lib/flexView.css';
import './app.css';

t.interface.strict = true;

const savedPlacesIds = localStorage.getItem('savedPlacesIds') ? localStorage.getItem('savedPlacesIds').split(',') : null;

const WELCOME_VIEW = 'welcome_view';
const EVENTS_VIEW = 'events_view';
const NEARBY_VIEW = 'nearby_view';

export default class App extends React.Component {

  state = {
    savedPlacesIds,
    view: !savedPlacesIds ? WELCOME_VIEW : EVENTS_VIEW,
    nearbyEvents: null,
    events: null,
    places: null,
    searchQuery: null,
    toasts: []
  }

  componentDidMount() {
    const { view } = this.state;

    switch (view) {
      case EVENTS_VIEW:
        this.getPlaces();
        this.getEvents();
        break;

      case NEARBY_VIEW:
        this.getPlaces();
        this.getNearbyEvents();
        break;

      case WELCOME_VIEW:
      default:
        break;
    }
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
      this.pad2(today.getMonth() + 1),
      this.pad2(today.getDate())
    ].join('-');

    const eventsRequest = savedPlacesIds.map(v => get(`https://graph.facebook.com/${v}/events`, {
      since: todayString,
      fields: 'cover.fields(id,source), id, name, description, place, start_time, end_time'
    }));

    Promise.all(eventsRequest).then(eventsResponse => {
      const flattenEvents = flatten(eventsResponse.map(r => r.data));
      const events = flattenEvents
        .map(({ start_time, end_time, ...e }) => ({
          ...e,
          startTime: start_time,
          endTime: end_time
        }))
        .filter(e => new Date(e.startTime) > today);

      this.setState({ events: uniqBy(events, 'id') });
    });
  }

  getNearbyEvents() {
    navigator.geolocation.getCurrentPosition((position) => {
      const es = new EventSearch({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        distance: 2500,
        accessToken: '963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY'
      });

      es.search()
        .then(data => {
          const nearbyEvents = data.events.map(e => ({
            id: e.id,
            name: e.name,
            description: e.description,
            startTime: e.startTime,
            endTime: e.endTime,
            cover: {
              id: '',
              source: e.coverPicture
            },
            place: {
              id: e.venue.id,
              name: e.venue.name
            }
          }));

          this.setState({ nearbyEvents: uniqBy(nearbyEvents, 'id') });
        })
        .catch(this.pushError);
    }, this.pushError);
  }

  pushError = (error) => {
    const toastStyle = {
      backgroundColor: '#feeced',
      color: '#fb242c',
      border: '1px solid #fb242c',
      height: 50,
      padding: 20,
      borderRadius: 4,
      marginTop: 10,
      marginRight: 20
    };

    const key = String(Math.random());

    const onTimeout = key => {
      this.setState({
        toasts: this.state.toasts.filter(t => t.key !== key)
      });
    };

    const toast = (
      <TimerToast onTimeout={onTimeout} duration={5000} key={key}>
        <View vAlignContent='center' style={toastStyle}>
          <TextOverflow label={error.message} />
        </View>
      </TimerToast>
    );

    this.setState({ toasts: [toast].concat(this.state.toasts) });
    this.transitionTo(EVENTS_VIEW);
  }

  onAddPlaces = places => {
    const savedPlacesIds = places.map(p => p.value);

    localStorage.setItem('savedPlacesIds', savedPlacesIds.join(','));
    this.setState({ savedPlacesIds, view: EVENTS_VIEW }, () => {
      this.getPlaces();
      this.getEvents();
    });
  }

  onSearch = debounce(searchQuery => this.setState({ searchQuery }), 300)

  filterEvents = (events, searchQuery) => {
    if (events && searchQuery) {
      const searchQueries = searchQuery.toLowerCase().split(' ').filter(s => s.length > 0);
      return events.filter(e => !!searchQueries.find(s => `${e.name}${e.place ? e.place.name : ''}${e.description || ''}`.toLowerCase().indexOf(s) !== -1));
    }

    return events;
  }

  transitionTo = (view) => {
    view !== this.state.view && this.setState({ view });
  }

  render() {
    const {
      state: { places, events, nearbyEvents, searchQuery, view, toasts },
      onAddPlaces, onSearch, filterEvents, transitionTo
    } = this;

    return (
      <View className='app' hAlignContent='center'>
        {view === WELCOME_VIEW && <WelcomePage onAddPlaces={onAddPlaces} />}
        {view !== WELCOME_VIEW && (
          <PlacesHeader
            places={places || []}
            onSearch={onSearch}
            onEditPlaces={onAddPlaces}
          />
        )}
        {view !== WELCOME_VIEW && (
          <EventsPage
            places={places}
            events={filterEvents(view === NEARBY_VIEW ? nearbyEvents : events, searchQuery)}
            transitionTo={transitionTo}
            view={view}
          />
        )}
        <Toaster>
          {toasts}
        </Toaster>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.state.nearbyEvents && nextState.view === NEARBY_VIEW && this.state.view !== NEARBY_VIEW) {
      this.getNearbyEvents();
    }

    return true;
  }
}
