import React from 'react';
import debounce from 'lodash/debounce';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import LoadingSpinner from 'buildo-react-components/lib/loading-spinner';
import 'buildo-react-components/lib/loading-spinner/loadingSpinner.css';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';
import Events from './Events';
import PlacesHeader from './PlacesHeader';

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
              {this.templatePlaceholder()}
            </View>
          )}
          {ready && this.templateByPlace(events, searchQuery)}
      </View>
    );
  }
}
