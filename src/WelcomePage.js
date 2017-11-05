import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import ChoosePlacesModal from './ChoosePlacesModal';

import './welcomePage.css';

export default class WelcomePage extends React.Component {

  static propTypes = propTypes({
    onAddPlaces: t.Function,
    onLogin: t.Function,
    isLogged: t.Boolean
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

  onLogin = () => {
    window.FB.login(response => {
      this.props.onLogin(response.authResponse);
    });
  }

  render() {
    const { showModal } = this.state;
    const { isLogged } = this.props;

    return (
      <View className='welcome-page' hAlignContent='center'>
        {showModal && (
          <ChoosePlacesModal onDismiss={this.closeModal} onSave={this.onSave} buttonLabel='Start using 2NITE' />
        )}
        <View className='body' grow column>
          <h1>2NITE</h1>
          <p>Login with Facebook and choose your places to get started.</p>
          {!isLogged && (
            <button onClick={this.onLogin} style={{ background: '#4868AC', borderColor: '#4868AC' }}>
              Login with Facebook
            </button>
          )}
          {isLogged && (
            <button onClick={this.openModal}>
              Choose Places
            </button>
          )}
          <img className='frame' alt='' src={process.env.NODE_ENV === 'development' ? '/welcome.jpg' : '/2NITE/welcome.jpg'} />
        </View>
      </View>
    );
  }
}
