import React from 'react';
import cx from 'classnames';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import ChoosePlacesModal from './ChoosePlacesModal';

import './placesHeader.css';

export default class DateHeader extends React.Component {

  static propTypes = propTypes({
    places: t.list(t.interface({
      id: t.String,
      name: t.String
    })),
    selectedPlaceId: t.maybe(t.String),
    onSelect: t.Function,
    onEditPlaces: t.Function
  });

  state = {
    showModal: false
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  onEditPlaces = (places) => {
    this.props.onEditPlaces(places);
    this.closeModal();
  }

  onSelect = (id) => {
    const { selectedPlaceId, onSelect } = this.props;

    onSelect(id === selectedPlaceId ? null : id);
  }

  render() {
    const {
      state: { showModal },
      props: { places, selectedPlaceId },
      closeModal, openModal, onEditPlaces
    } = this;
    return (
      <View className='places-header' width='100%' hAlignContent='center'>
        {showModal && <ChoosePlacesModal onDismiss={closeModal} onSave={onEditPlaces} />}
        <View className='places-header-body' grow>
          <View shrink={false} marginLeft={10}>
            LOGO
          </View>
          <View grow>
            {places.map(p => (
              <View className={cx('place', { 'is-selected': selectedPlaceId === p.id })} shrink={false} onClick={() => this.onSelect(p.id)} key={p.id}>
                {p.name}
              </View>
            ))}
          </View>
          <View shrink={false} marginRight={10} onClick={openModal}>
            +
          </View>
        </View>
      </View>
    );
  }
}
