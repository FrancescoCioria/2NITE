import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';

import './dateHeader.css';

export default class DateHeader extends React.Component {

  static propTypes = propTypes({
    date: t.Date
  });

  getMonthShort(index) {
    return [
      'Gen',
      'Feb',
      'Mar',
      'Apr',
      'Mag',
      'Giu',
      'Lug',
      'Ago',
      'Set',
      'Ott',
      'Nov',
      'Dic'
    ][index];
  }

  render() {
    const { date } = this.props;
    return (
      <View className='date-header' shrink={false}>
        {`${date.getDate()} ${this.getMonthShort(date.getMonth())}`}
      </View>
    );
  }
}
