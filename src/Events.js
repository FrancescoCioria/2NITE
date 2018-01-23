import React from 'react';
import debounce from 'lodash/debounce';
import cx from 'classnames';
import pure from 'buildo-react-pure';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import Toggle from './Toggle';
import DateHeader from './DateHeader';
import Event from './Event';

import './events.css';

const EVENTS_VIEW = 'events_view';
const NEARBY_VIEW = 'nearby_view';

class Events extends React.Component {

  static propTypes = propTypes({
    events: t.list(t.interface({
      id: t.String,
      name: t.String,
      description: t.maybe(t.String),
      startTime: t.String,
      endTime: t.maybe(t.String),
      place: t.maybe(t.struct({
        id: t.maybe(t.String),
        name: t.String
      }))
    })),
    toggleOnlyPinned: t.Function,
    pinnedOnly: t.Boolean,
    pinnedEventIds: t.list(t.String),
    view: t.String,
    transitionTo: t.Function,
    onPin: t.Function,
    onSwiped: t.Function
  })

  state = {
    slice: 20
  }

  onScroll = debounce(scrollTop => {
    const { slice } = this.state;
    const { clientHeight } = this.container;
    const total = this.props.events.length;

    if (slice < total && scrollTop > clientHeight * 0.7) {
      this.setState({ slice: Math.min(Math.round(slice * 0.7 * 2), total) });
    } else if (slice > 20 && scrollTop < clientHeight * 0.2) {
      this.setState({ slice: Math.max(Math.round(slice * 0.3), 20) });
    }
  }, 50);

  _onScroll = (e) => this.onScroll(e.target.scrollTop);

  render() {
    const {
      props: { events, transitionTo, view, onPin, onSwiped, pinnedEventIds, toggleOnlyPinned, pinnedOnly },
      state: { slice },
      _onScroll: onScroll
    } = this;

    const eventsByDate = groupBy(sortBy(events, e => e.startTime).slice(0, slice), e => e.startTime.slice(0, 10)); // TODO: remove slice perf hack!!!
    const keys = Object.keys(eventsByDate);

    return (
      <View className='events' hAlignContent='center' grow onScroll={onScroll}>
        <View column>
          <div className='events-container' ref={r => { this.container = r; }}>
            <View shrink={false} className='tabs'>
              <div
                className={cx('tab', { 'is-selected': view === EVENTS_VIEW })}
                onClick={() => transitionTo(EVENTS_VIEW)}
              >
                My Places Events
              </div>
              <div
                className={cx('tab', { 'is-selected': view === NEARBY_VIEW })}
                onClick={() => transitionTo(NEARBY_VIEW)}
              >
                Nearby Events
              </div>
              <View className='show-only-pinned' marginLeft='auto' shrink={false} vAlignContent='center'>
                <Toggle onChange={toggleOnlyPinned} value={pinnedOnly} />
                <span style={{ marginLeft: 5 }}>Only pinned</span>
              </View>
            </View>
            {keys.length > 0 ?
              keys.map(k => (
                <View column shrink={false} key={k}>
                  {<DateHeader date={new Date(k)} />}
                  {eventsByDate[k].map(e => (
                    <Event {...e} key={e.id} onSwiped={onSwiped} onPin={onPin} pinned={pinnedEventIds.indexOf(e.id) !== -1}/>
                  ))}
                </View>
              )) : <View marginTop={100} hAlignContent='center'>No results</View>
            }
          </div>
        </View>
      </View>
    );
  }
}
pure(Events);

export default Events;
