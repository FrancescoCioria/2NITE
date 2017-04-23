import React from 'react';
// import cx from 'classnames';
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
    onSearch: t.Function,
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

  onSearch = ({ target: { value } }) => this.props.onSearch(value)

  render() {
    const {
      props: { places },
      state: { showModal },
      closeModal, openModal, onEditPlaces, onSearch
    } = this;
    return (
      <View className='places-header' width='100%' hAlignContent='center'>
        {showModal && (
          <ChoosePlacesModal onDismiss={closeModal} onSave={onEditPlaces} defaultPlaces={places} buttonLabel='Save places' />
        )}
        <View className='places-header-body' grow vAlignContent='center'>
          <View shrink={false} marginRight={10}>
            <img
              className='logo'
              src={process.env.NODE_ENV === 'development' ? '/logo.png' : '/2NITE/logo.png'}
              alt=''
            />
          </View>
          <View grow className='search'>
            <input placeholder='Search for places or events' onChange={onSearch} />
          </View>
          <View className='plus' shrink={false} marginLeft={10} onClick={openModal} hAlignContent='center'>
            +
          </View>
        </View>
      </View>
    );
  }
}
