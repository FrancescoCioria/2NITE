import React from 'react';
import View from 'react-flexview';
import pure from 'buildo-react-pure';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import DateHeader from './DateHeader';
import Event from './Event';

class Events extends React.Component {
  render() {
    const { events } = this.props;
    const eventsByDate = groupBy(sortBy(events, e => e.start_time), e => e.start_time.slice(0, 10));

    return (
      <View className='events' column>
        {Object.keys(eventsByDate).map(k => (
          <View column shrink={false} key={k}>
            {<DateHeader date={new Date(k)} />}
            {eventsByDate[k].map(e => <Event {...e} key={e.id} />)}
          </View>
        ))}
      </View>
    );
  }
}
pure(Events);

export default Events;
