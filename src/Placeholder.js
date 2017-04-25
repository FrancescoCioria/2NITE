import React from 'react';
import { propTypes } from 'tcomb-react';
import View from 'react-flexview';
import LoadingSpinner from 'buildo-react-components/lib/loading-spinner';
import 'buildo-react-components/lib/loading-spinner/loadingSpinner.css';
import { TextBlock, RectShape } from 'react-placeholder/lib/placeholders';

import './placeholder.css';

export default class Placeholder extends React.Component {

  static propTypes = propTypes({})

  render() {
    return (
      <View className='placeholder' marginTop={120} marginBottom={30}>
        <View style={{ position: 'absolute', top: -65 }} width='100%' height={30}>
          <LoadingSpinner overlayColor='transparent' size={30} />
        </View>
        <View className='placeholder-event' grow>
          <RectShape className='image' color='#eaeaea' style={{ flexShrink: 0, width: 200, height: 200 }} />
          <View className='content' column grow>
            <TextBlock rows={1} color='#eaeaea' style={{ height: 15 }} />
            <View width='30%' basis={8} marginTop={8} style={{ background: '#eaeaea' }} />
            <TextBlock className='description' rows={3} color='#efefef' />
          </View>
        </View>
      </View>
    );
  }
}
