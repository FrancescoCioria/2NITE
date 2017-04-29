import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import FormattedText from 'buildo-react-components/lib/formatted-text';
import Modal from './Modal';

import './event.css';

export default class Event extends React.Component {

  static propTypes = propTypes({
    id: t.String,
    name: t.String,
    description: t.maybe(t.String),
    startTime: t.String,
    endTime: t.maybe(t.String),
    cover: t.interface({
      id: t.String,
      source: t.maybe(t.String)
    }),
    place: t.struct({
      id: t.maybe(t.String),
      name: t.String
    })
  });

  state = {
    showModal: false
  }

  pad2(value) {
    return value > 9 ? value : `0${value}`;
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  templateModal({ name, description, onDismiss, cover, id }) {
    return (
      <Modal className='event-modal' onDismiss={onDismiss} title={name}>
        <img className='image' alt='cover' src={cover.source || `https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large`} />
        <FormattedText>
          {description}
        </FormattedText>
      </Modal>
    );
  }

  render() {
    const { name, id, place, description, startTime, endTime, cover } = this.props;
    const { showModal } = this.state;

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    const startTimeLabel = `${this.pad2(startDateTime.getHours())}:${this.pad2(startDateTime.getMinutes())}`;
    const endTimeLabel = endTime ?
      `${this.pad2(endDateTime.getHours())}:${this.pad2(endDateTime.getMinutes())}` :
      'N/A';

    return (
      <View className='event' basis={200}>
        {showModal && this.templateModal({ name, description, onDismiss: this.closeModal, cover, id })}
        <View shrink={false}>
          <div
            className='image'
            style={{
              backgroundImage: `url(${cover.source || `https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large`})`
            }}
          />
        </View>
        <View grow column className='content'>
          <View className='title'>
            <a href={`https://www.facebook.com/events/${id}/`} target='_blank'>
              {name}
            </a>
          </View>
          <View className='place'>
            {`${startTimeLabel} - ${endTimeLabel} @`}
            <a href={`https://www.facebook.com/${place.id}/`} target='_blank'>
              {` ${place.name}`}
            </a>
          </View>
          <View className='description' onClick={this.openModal}>
            {description}
          </View>
        </View>
      </View>
    );
  }
}
