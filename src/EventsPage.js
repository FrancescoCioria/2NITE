import React from 'react';
import sortBy from 'lodash/sortBy';
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
    selectedPlaceId: null
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
    const { places, events, onEditPlaces } = this.props;
    const { selectedPlaceId } = this.state;

    const ready = !!places && !!events;
    return (
      <View className='events-page' grow hAlignContent='center'>
        <PlacesHeader
          places={places || []}
          selectedPlaceId={selectedPlaceId}
          onSelect={(selectedPlaceId) => this.setState({ selectedPlaceId })}
          onEditPlaces={onEditPlaces}
        />
        <View className='body' grow column>
          {!ready && this.templatePlaceholder()}
          {ready && this.templateByPlace(events, selectedPlaceId)}
        </View>
      </View>
    );
  }
}
