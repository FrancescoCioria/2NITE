import React from 'react';
import { t, propTypes } from 'tcomb-react';
import View from 'react-flexview';

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

  getDayOfWeek(index) {
    return [
      'Domenica',
      'Lunedì',
      'Martedì',
      'Mercoledì',
      'Giovedì',
      'Venerdì',
      'Sabato'
    ][index];
  }

  render() {
    const { date } = this.props;
    return (
      <View className='date-header' shrink={false}>
        <span className='day-of-week'>{this.getDayOfWeek(date.getDay())}</span>
        <span className='date'>{`· ${date.getDate()} ${this.getMonth(date.getMonth())}`}</span>
      </View>
    );
  }
}
