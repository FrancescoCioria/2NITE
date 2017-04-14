import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';

import './event.css';

export default class Event extends React.Component {

  static propTypes = propTypes({
    id: t.String,
    name: t.String,
    description: t.String,
    start_time: t.String,
    end_time: t.String,
    place: t.struct({
      id: t.String,
      name: t.String
    })
  });

  pad2(value) {
    return value > 9 ? value : `0${value}`;
  }

  render() {
    const { name, id, place, description, start_time, end_time } = this.props;

    const startDateTime = new Date(start_time);
    const endDateTime = new Date(end_time);

    const startTime = `${this.pad2(startDateTime.getHours())}:${this.pad2(startDateTime.getMinutes())}`;
    const endTime = `${this.pad2(endDateTime.getHours())}:${this.pad2(endDateTime.getMinutes())}`;

    return (
      <View className='event' basis={200}>
        <View shrink={false}>
          <img
            alt=''
            src={`https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large`}
          />
        </View>
        <View grow column className='content'>
          <View className='title'>
            <a href={`https://www.facebook.com/events/${id}/`} target='_blank'>
              {name}
            </a>
          </View>
          <View className='place'>
            {`${startTime} - ${endTime} @`}
            <a href={`https://www.facebook.com/${place.id}/`} target='_blank'>
              {` ${place.name}`}
            </a>
          </View>
          <View className='description'>{description}</View>
        </View>
      </View>
    );
  }
}
