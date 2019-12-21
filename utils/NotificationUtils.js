import React from 'react';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { appStateManager } from '../singletons';

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
        Notifications.getExpoPushTokenAsync().then((value) => {
            appStateManager.user.token = value
        });
    }

}
let notificationUtils = NotificationUtils.shared;
export {notificationUtils}

