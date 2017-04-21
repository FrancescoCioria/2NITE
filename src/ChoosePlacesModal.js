import React from 'react';
import { t, propTypes } from 'tcomb-react';
import debounce from 'lodash/debounce';
import { get } from './request';
import Dropdown from 'react-select';
import View from 'react-flexview';
import Modal from './Modal';

import 'react-select/dist/react-select.css';
import './choosePlacesModal.css';

export default class ChoosePlacesModal extends React.Component {

  static propTypes = propTypes({
    defaultPlaces: t.maybe(t.list(t.interface({
      id: t.String,
      name: t.String
    }))),
    onDismiss: t.Function,
    onSave: t.Function
  })

  state = {
    places: this.props.defaultPlaces ? this.props.defaultPlaces.map(p => ({
      value: p.id,
      label: p.name
    })) : []
  }

  onAddPlace = (place) => this.setState({ places: [place].concat(this.state.places) })

  onRemovePlace = (p) => this.setState({ places: this.state.places.filter(place => place.value !== p.value) })

  searchPlaces(input) {
    return get('https://graph.facebook.com/search', { q: input, type: 'place' }, false);
  }

  onSave = () => this.props.onSave(this.state.places);

  templateAddedPlaces({ places, onRemovePlace }) {
    return (
      <View className='added-places' column grow>
        {places.map(p => (
          <View className='added-place' shrink={false}>
            {p.label}
            <View className='remove' marginLeft='auto' onClick={() => onRemovePlace(p)}>
              Remove
            </View>
          </View>
        ))}
      </View>
    )
  }

  render() {
    const {
      state: { places },
      props: { onDismiss },
      onAddPlace,
      onRemovePlace,
      onSave
    } = this;

    const loadOptions = debounce((input, cb) => {
      if (input.length > 0) {
        this.searchPlaces(input).then(({ data: places }) => {
          cb(null, { options: places.map(p => ({ value: p.id, label: p.name })) });
        })
      } else {
        cb(null, { options: [] });
      }
    }, 200);

    return (
      <Modal className='choose-places-modal' onDismiss={onDismiss} title='Choose your places'>
        <Dropdown.Async loadOptions={loadOptions} onChange={onAddPlace} />
        {this.templateAddedPlaces({ places, onRemovePlace })}
        <button onClick={onSave} disabled={!places || places.length === 0}>
          Start using 2NITE
        </button>
      </Modal>
    )
  }
}
