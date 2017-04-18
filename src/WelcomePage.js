import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import ChoosePlacesModal from './ChoosePlacesModal';

import './welcomePage.css';

export default class WelcomePage extends React.Component {

  static propTypes = propTypes({
    onAddPlaces: t.Function
  })

  state = {
    showModal: false
  }

  openModal = () => {
    this.setState({ showModal: true });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  onSave = (places) => {
    this.props.onAddPlaces(places);
  }

  render() {
    const { showModal } = this.state;

    return (
      <View className='welcome-page' hAlignContent='center'>
        {showModal && <ChoosePlacesModal onDismiss={this.closeModal} onSave={this.onSave} />}
        <View className='body' grow column>
          <h1>2NITE</h1>
          <p>Choose your places to get started.</p>
          <button onClick={this.openModal}>
            Choose Places
          </button>
          <img className='frame' alt='' src={process.env.NODE_ENV === 'development' ? '/welcome.jpg' : '/2NITE/welcome.jpg'} />
        </View>
      </View>
    );
  }
}
