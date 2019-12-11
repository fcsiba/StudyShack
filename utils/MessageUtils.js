import { View, Dimensions, } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';

class MessageUtils {

    static shared = new MessageUtils()

    NotificatioPermissionDenied(){
        showMessage({
            message: "Warning",
            type: 'danger',
            description: 'Permission to send Push Notification was denied',
        });
    }


}
let messageUtils = MessageUtils.shared;
export {messageUtils}

