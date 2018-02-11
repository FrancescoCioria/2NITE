import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';
import LocalDate from 'local-date';

import './dateHeader.css';

export default class DateHeader extends React.Component {

  static propTypes = propTypes({
    date: t.Date
  });

  getMonth(index) {
    return [
      'Gennaio',
      'Febbraio',
      'Marzo',
      'Aprile',
      'Maggio',
      'Giugno',
      'Luglio',
      'Agosto',
      'Settembre',
      'Ottobre',
      'Novembre',
      'Dicembre'
    ][index];
  }

  getDayOfWeek(date) {
    if (this.isToday(date)) {
      return 'Oggi';
    } else if (this.isTomorrow(date)) {
      return 'Domani';
    } else {
      return [
        'Domenica',
        'Lunedì',
        'Martedì',
        'Mercoledì',
        'Giovedì',
        'Venerdì',
        'Sabato'
      ][date.getDay()];
    }
  }

  isToday(date) {
    const now = new LocalDate();
    return now.toISOString() === date.toISOString();
  }

  isTomorrow(date) {
    let tomorrow = new LocalDate();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString() === date.toISOString();
  }

  render() {
    const { date } = this.props;

    return (
      <View className='date-header' shrink={false}>
        <span className='day-of-week'>{this.getDayOfWeek(date)}</span>
        <span className='date'>{`· ${date.getDate()} ${this.getMonth(date.getMonth())}`}</span>
      </View>
    );
  }
}
