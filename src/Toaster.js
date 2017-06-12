import React from 'react';
import BRCToaster from 'buildo-react-components/lib/toaster';
import { t, propTypes } from 'tcomb-react';

const transitionStyles = {
  enter: {
    opacity: '0.2',
    transform: 'translateX(100%)',
    WebkitTransition: 'opacity .8s ease-out, -webkit-transform .8s ease-out',
    transition: 'opacity .8s ease-out, transform .8s ease-out'
  },
  enterActive: {
    opacity: '1',
    transform: 'translateX(0)'
  },
  leave: {
    opacity: '1',
    transform: 'translateX(0)',
    WebkitTransition: 'opacity .8s ease-out, -webkit-transform .8s ease-out',
    transition: 'opacity .8s ease-out, transform .8s ease-out'
  },
  leaveActive: {
    opacity: '0.01',
    transform: 'translateX(100%)'
  },
  default: {
    WebkitTransition: '-webkit-transform 0.3s ease-in-out',
    transition: 'transform 0.3s ease-in-out'
  }
};

export default class Toaster extends React.Component {

  static propTypes = propTypes({
    children: t.ReactChildren
  });

  render() {
    return (
      <BRCToaster
        transitionStyles={transitionStyles}
        transitionEnterTimeout={800}
        transitionLeaveTimeout={800}
      >
        {this.props.children}
      </BRCToaster>
    );
  }
}
