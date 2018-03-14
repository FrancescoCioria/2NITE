import React from 'react';
import debounce from 'lodash/debounce';
import Swipeable from 'react-swipeable'
import Dropdown from 'react-select';
import { t, propTypes } from 'tcomb-react';
import cx from 'classnames';
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
    place: t.maybe(t.struct({
      id: t.maybe(t.String),
      name: t.String
    })),
    rsvpStatus: t.maybe(t.String),
    onSwiped: t.Function,
    onRSVPChange: t.Function
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

  onRSVPChange = (o) => this.props.onRSVPChange(this.props.id, o.value);

  templateModal({ name, description = '', onDismiss, cover, id, rsvpStatus }) {
    const options = [
      { label: 'Going',
        value: 'attending'
      },
      { label: 'Interested',
        value: 'unsure'
      },
      { label: 'Not interested',
        value: 'not_attending'
      }
    ];
    return (
      <Modal className='event-modal' onDismiss={onDismiss} title={name}>
        <img
          className='image'
          alt='cover'
          style={{ width: 'calc(100% + 30px)' }}
          src={cover.source || `https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large`}
        />
        <View style={{ position: 'relative' }}>
          <View style={{ position: 'absolute', width: 150, right: 10, top: -75 }}>
            <Dropdown
              style={{ width: 150 }}
              clearable={false}
              searchable={false}
              placeholder='RSVP'
              options={options}
              value={rsvpStatus}
              onChange={this.onRSVPChange}
            />
          </View>
        </View>
        <FormattedText>
          {description}
        </FormattedText>
      </Modal>
    );
  }

  onSwipingLeft = debounce((e, absX) => {
    if (this.ref) {
      this.ref.style.transform = `translate3d(${-absX}px, 0, 0)`
      this.ref.style.opacity = 1 - (Math.abs(absX) / 200)
      this.ref.style.transition = 'none'
    }
  }, 10)

  onSwipingRight = debounce((e, absX) => {
    if (this.ref) {
      this.ref.style.transform = `translate3d(${absX}px, 0, 0)`
      this.ref.style.opacity = 1 - (Math.abs(absX) / 200)
      this.ref.style.transition = 'none'
    }
  }, 10)

  onSwiped = (e, deltaX, isFlick, velocity) => {
    if (isFlick) {
      this.props.onSwiped(this.props.id)
    } else {
      this.ref.style.transform = 'translate3d(0, 0, 0)';
      this.ref.style.opacity = 1
      this.ref.style.transition = ''
    }
  }

  render() {
    const { name, id, place, description, startTime, endTime, cover, rsvpStatus } = this.props;
    const { showModal } = this.state;

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    const startTimeLabel = `${this.pad2(startDateTime.getHours())}:${this.pad2(startDateTime.getMinutes())}`;
    const endTimeLabel = endTime ?
      `${this.pad2(endDateTime.getHours())}:${this.pad2(endDateTime.getMinutes())}` :
      'N/A';

    return (
      <Swipeable
        className='event'
        style={{ display: 'flex', flex: '0 0 200px' }}
        onSwipingLeft={this.onSwipingLeft}
        onSwipingRight={this.onSwipingRight}
        onSwipedLeft={this.onSwiped}
        onSwipedRight={this.onSwiped}
        innerRef={ref => this.ref = ref}
      >
        {showModal && this.templateModal({ name, description, onDismiss: this.closeModal, cover, id, rsvpStatus })}
        <View shrink={false}>
          <div
            className='image'
            style={{
              backgroundImage: `url(${cover.source || `https://graph.facebook.com/${id}/picture?access_token=963390470430059|bGCaVUpEO9xur5e05TOFQdF7uUY&type=large`})`
            }}
          />
        </View>
        <View grow column className='content'>
          <i className={cx('fa fa-thumb-tack pin', { pinned: rsvpStatus === 'attending' || rsvpStatus === 'unsure' })} aria-hidden='true' />
          <View className='title' width='100%'>
            <a href={`https://www.facebook.com/events/${id}/`} target='_blank'>
              {name}
            </a>
          </View>
          <View className='place'>
            {`${startTimeLabel} - ${endTimeLabel} @`}
            <a href={place ? `https://www.facebook.com/${place.id}/` : ''} target='_blank'>
              {` ${place ? place.name : 'N/A'}`}
            </a>
          </View>
          <View className='description' onClick={this.openModal}>
            {description}
          </View>
        </View>
      </Swipeable>
    );
  }
}
