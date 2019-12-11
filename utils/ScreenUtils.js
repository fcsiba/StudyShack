import { Dimensions, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class ScreenUtils {

  static shared = new ScreenUtils()

  windowwidth = width
  windowheight = height
  additionalWidth = width * 0.5 - 180;
  additionalHeight = height * 0.22 - 120;
  screenRatioWidth = width / 414;
  screenRatioHeight = height / 896;

}
let screenUtils = ScreenUtils.shared;
export { screenUtils }

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812)
  );
}

export function ifIphoneX(iphoneXStyle, regularStyle) {
  if (isIphoneX()) {
    return iphoneXStyle;
  }
  return regularStyle;
}

export function isAndroid() {
  return (Platform.OS === 'android');
}

export function ifAndroid(androidStyle, regularStyle) {
  if (isAndroid()) {
    return androidStyle;
  }
  return regularStyle;
}

const isFunction = input => typeof input === 'function';
export function renderIf(predicate) {
  return function(elemOrThunk) {
    return predicate ? (isFunction(elemOrThunk) ? elemOrThunk() : elemOrThunk) : null;
  }
} 