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
    onSearch: t.Function,
    onEditPlaces: t.Function
  });

  state = {
    showModal: false,
    querySearch: '',
    focused: false
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

  onSearch = ({ target: { value: querySearch } }) => {
    this.setState({ querySearch });
    this.props.onSearch(querySearch)
  }

  onFocus = () => this.setState({ focused: true })

  onBlur = () => this.setState({ focused: false })

  onClear = () => {
    this.onSearch({ target: { value: '' } });
  }

  render() {
    const {
      props: { places },
      state: { showModal, focused, querySearch },
      closeModal, openModal, onEditPlaces, onSearch,
      onFocus, onBlur, onClear
    } = this;
    return (
      <View className={cx('places-header', { 'search-is-active': focused || !!querySearch })} width='100%' hAlignContent='center'>
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
            <input placeholder='Search for places or events' value={querySearch} onChange={onSearch} onFocus={onFocus} onBlur={onBlur} />
            <svg className='icon-clear' width="64" version="1.1" height="64" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" onClick={onClear}>
              <g>
                <path fill="#1D1D1B" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z"/>
              </g>
            </svg>
          </View>
          <View className='plus' shrink={false} marginLeft={10} onClick={openModal} hAlignContent='center'>
            +
          </View>
        </View>
      </View>
    );
  }
}
