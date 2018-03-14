import React from 'react';
import ReactDOM from 'react-dom';
import { getPreferences } from './request';
import App from './App';

const appNode = document.getElementById('app');

const fbAsyncInit = function() {
  window.FB.init({
    appId: '219909391458551',
    cookie: true,  // enable cookies to allow the server to access
                        // the session
    xfbml: true,  // parse social plugins on this page
    version: 'v2.8' // use graph api version 2.8
  });

  window.FB.getLoginStatus(response => {
    const { authResponse } = response;
    getPreferences(authResponse ? authResponse.userID : null)
      .then(preferences => {
        ReactDOM.render(
          <App
            authResponse={authResponse}
            savedPlacesIds={preferences.savedPlacesIds}
            dismissedEventIds={preferences.dismissedEventIds}
          />,
          appNode
        );
      });
  });
};

if (!window.FB) {
  window.fbAsyncInit = fbAsyncInit;
} else {
  fbAsyncInit();
}
