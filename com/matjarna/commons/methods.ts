
import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import i18n from '../i18n/config';

export const changeLanguage = (lng: string) => {
    const isRtl = I18nManager.isRTL;
  
    if (lng == i18n.language) {
      return;
    }
    i18n.changeLanguage(lng).then(() => {
      const isNewRtl = i18n.dir() === 'rtl';
      I18nManager.forceRTL(isNewRtl);
  
      if (isNewRtl != isRtl) {
        RNRestart.Restart();
      }
    });
  };