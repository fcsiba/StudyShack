import React from 'react';
import { View, Dimensions, } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';

class NotificationUtils {

    static shared = new NotificationUtils()

    async registerForPushNotificationsAsync() {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            showMessage({
                message: "Warning",
                type: 'danger',
                description: 'Permission to send Push Notification was denied',
            });
            return undefined;
        }
        let token = await Notifications.getExpoPushTokenAsync();
        console.log({ expotoken: token })
        return token;
    }

}
let notificationUtils = NotificationUtils.shared;
export {notificationUtils}

