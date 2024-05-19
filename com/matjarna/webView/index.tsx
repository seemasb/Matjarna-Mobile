import React from 'react';
import {View} from 'react-native';
import ChevronLeftIcon from '../assets/icons/chevronLeftIcon';
import IconButton from '../sharedComponents/iconButton';
import {BASE_URL_WEBVIEW} from '../commons/constants';
import {WebView} from 'react-native-webview';

function WebViewWrapper({route, navigation}: any) {
  const url = route.params.url;
  return (
    <View
      style={{
        padding: 12,
        flex: 1,
        backgroundColor: 'white',
      }}>
      <View>
        <IconButton
          icon={<ChevronLeftIcon />}
          onPress={() => navigation.goBack()}
        />
      </View>
      <WebView source={{uri: BASE_URL_WEBVIEW + url}} />
    </View>
  );
}

export default WebViewWrapper;
