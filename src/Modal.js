import React from 'react';
import cx from 'classnames';
import { t, propTypes } from 'tcomb-react';
import BRCModal from 'buildo-react-components/lib/modal';

import 'buildo-react-components/lib/modal/modal.css';
import './modal.css';

export default class Modal extends React.Component {

  static propTypes = propTypes({
    title: t.String,
    className: t.String,
    onDismiss: t.Function,
    children: t.ReactChildren
  });

  render() {
    const { title, children, className, onDismiss } = this.props;
    return (
      <BRCModal
        className={cx('_modal', className)}
        transitionEnterTimeout={0}
        transitionLeaveTimeout={0}
        onDismiss={onDismiss}
        iconClose={(
          <svg width="64" version="1.1" height="64" viewBox="0 0 64 64" enableBackground="new 0 0 64 64">
            <g>
              <path fill="#1D1D1B" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
            </g>
          </svg>
        )}
        title={title}
      >
        {children}
    </BRCModal>
    )
  }
}
