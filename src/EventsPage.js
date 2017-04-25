import React from 'react';
import debounce from 'lodash/debounce';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import Events from './Events';
import PlacesHeader from './PlacesHeader';
import Placeholder from './Placeholder';

export default class EventsPage extends React.Component {

  static propTypes = propTypes({
    places: t.maybe(t.list(t.interface({
      id: t.String,
      name: t.String
    }))),
    events: t.maybe(t.list(t.interface({
      id: t.String,
      name: t.String,
      description: t.maybe(t.String),
      start_time: t.String,
      end_time: t.String,
      place: t.struct({
        id: t.maybe(t.String),
        name: t.String
      })
    }))),
    onEditPlaces: t.Function
  });

  state = {
    selectedPlaceId: null,
    searchQuery: null
  }

  onSearch = debounce(searchQuery => this.setState({ searchQuery }), 300)

  templateByPlace(events, searchQuery) {
    if (searchQuery) {
      const searchQueries = searchQuery.toLowerCase().split(' ').filter(s => s.length > 0);
      const filteredEvents = events.filter(e => !!searchQueries.find(s => `${e.name}__${e.place.name}`.toLowerCase().indexOf(s) !== -1));
      return <Events events={filteredEvents} />;
    } else {
      return <Events events={events} />;
    }
  }

  render() {
    const {
      props: { places, events, onEditPlaces },
      state: { searchQuery },
      onSearch
    } = this;

    const ready = !!places && !!events;
    return (
      <View className='events-page' grow hAlignContent='center'>
        <PlacesHeader
          places={places || []}
          onSelect={(selectedPlaceId) => this.setState({ selectedPlaceId })}
          onSearch={onSearch}
          onEditPlaces={onEditPlaces}
        />
          {!ready && (
            <View className='body' grow column>
              <Placeholder />
            </View>
          )}
          {ready && this.templateByPlace(events, searchQuery)}
      </View>
    );
  }
}
