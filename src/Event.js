import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import Modal from 'buildo-react-components/lib/modal';
import FormattedParagraph from 'buildo-react-components/lib/formatted-paragraph';

import 'buildo-react-components/lib/modal/modal.css';
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

  templateModal({ name, description, onDismiss }) {
    return (
      <Modal
        className='event-modal'
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        onDismiss={onDismiss}
        iconClose={(
          <svg width="64" version="1.1" height="64" viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
            <g>
              <path fill="#1D1D1B" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
            </g>
          </svg>
        )}
        title={name}
      >
        <FormattedParagraph content={description} paragraphSpacing={24} />
    </Modal>
    )
  }

  render() {
    const { name, id, place, description, start_time, end_time } = this.props;
    const { showModal } = this.state;

    const startDateTime = new Date(start_time);
    const endDateTime = new Date(end_time);

    const startTime = `${this.pad2(startDateTime.getHours())}:${this.pad2(startDateTime.getMinutes())}`;
    const endTime = `${this.pad2(endDateTime.getHours())}:${this.pad2(endDateTime.getMinutes())}`;

    return (
      <View className='event' basis={200}>
        {showModal && this.templateModal({ name, description, onDismiss: this.closeModal })}
        <View shrink={false}>
          <div
            className='image'
            style={{
              backgroundImage: `url(https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large)`
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
            {`${startTime} - ${endTime} @`}
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
