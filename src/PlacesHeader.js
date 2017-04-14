import React from 'react';
import cx from 'classnames';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';

import './placesHeader.css';

export default class DateHeader extends React.Component {

  static propTypes = propTypes({
    places: t.list(t.interface({
      id: t.String,
      name: t.String
    })),
    selectedPlaceId: t.maybe(t.String),
    onSelect: t.Function,
  });

  onSelect = (id) => {
    const { selectedPlaceId, onSelect } = this.props;

    onSelect(id === selectedPlaceId ? null : id);
  }

  render() {
    const { places, selectedPlaceId } = this.props;
    return (
      <View className='places-header' width='100%' hAlignContent='center'>
        <View className='places-header-body' grow>
          {places.map(p => (
            <View className={cx('place', { 'is-selected': selectedPlaceId === p.id })} shrink={false} onClick={() => this.onSelect(p.id)} key={p.id}>
              {p.name}
            </View>
          ))}
        </View>
      </View>
    );
  }
}
