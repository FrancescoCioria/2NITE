import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import Events from './Events';
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
      startTime: t.String,
      endTime: t.maybe(t.String),
      place: t.maybe(t.struct({
        id: t.maybe(t.String),
        name: t.String
      }))
    }))),
    toggleOnlyPinned: t.Function,
    pinnedOnly: t.Boolean,
    view: t.String,
    transitionTo: t.Function,
    onSwiped: t.Function,
    onRSVPChange: t.Function
  });

  templateByPlace({ events, transitionTo, view, onSwiped, toggleOnlyPinned, pinnedOnly, onRSVPChange }) {
    return (
      <Events
        events={events}
        transitionTo={transitionTo}
        view={view}
        onSwiped={onSwiped}
        toggleOnlyPinned={toggleOnlyPinned}
        pinnedOnly={pinnedOnly}
        onRSVPChange={onRSVPChange}
      />
    );
  }

  render() {
    const { places, events, transitionTo, view, onSwiped, toggleOnlyPinned, pinnedOnly, onRSVPChange } = this.props;

    const ready = !!places && !!events;
    return (
      <View className='events-page' grow hAlignContent='center'>
        {!ready && (
          <View className='body' grow column>
            <Placeholder />
          </View>
        )}
        {ready && this.templateByPlace({ events, transitionTo, view, onSwiped, toggleOnlyPinned, pinnedOnly, onRSVPChange })}
      </View>
    );
  }
}
