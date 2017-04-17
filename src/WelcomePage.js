import React from 'react';
import { t, propTypes } from 'tcomb-react';
import debounce from 'lodash/debounce';
import View from 'react-flexview';
import Dropdown from 'react-select';
import { get } from './request';
import Modal from './Modal';

import 'react-select/dist/react-select.css';
import './welcomePage.css';

export default class WelcomePage extends React.Component {

  static propTypes = propTypes({
    onAddPlaces: t.Function
  })

  state = {
    showModal: false,
    modal: {
      options: [],
      isLoadingOptions: false
    }
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  searchPlaces(input) {
    return get('https://graph.facebook.com/search', { q: input, type: 'place' }, false);
  }

  onAddPlace = (places) => this.setState({ places })

  onSave = () => {
    this.props.onAddPlaces(this.state.places);
  }

  templateModal({ onDismiss, searchPlaces, onAddPlace, onSave, places }) {
    const loadOptions = debounce((input, cb) => {
      if (input.length > 0) {
        searchPlaces(input).then(({ data: places }) => {
          cb(null, { options: places.map(p => ({ value: p.id, label: p.name })) });
        })
      } else {
        cb(null, { options: [] });
      }
    }, 200);

    return (
      <Modal className='choose-places-modal' onDismiss={onDismiss} title='Choose your places'>
        <Dropdown.Async multi value={places} loadOptions={loadOptions} onChange={onAddPlace} />
        <button onClick={onSave} disabled={!places || places.length === 0}>
          Start using 2NITE
        </button>
      </Modal>
    )
  }

  render() {
    const { showModal, places } = this.state;

    return (
      <View className='welcome-page' hAlignContent='center'>
        {showModal && this.templateModal({
          places,
          onDismiss: this.closeModal,
          searchPlaces: this.searchPlaces,
          onAddPlace: this.onAddPlace,
          onSave: this.onSave
        })}
        <View className='body' grow column>
          <h1>2NITE</h1>
          <p>Choose your places to get started.</p>
          <button onClick={this.openModal}>
            Choose Places
          </button>
          <img className='frame' src={process.env.NODE_ENV === 'development' ? '/welcome.jpg' : '/2NITE/welcome.jpg'} />
        </View>
      </View>
    );
  }
}
