import { View, Dimensions, } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';

class LocationUtils {

    static shared = new LocationUtils()

    async getCurrentLocationAsync() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            showMessage({
                message: "Warning",
                type: 'danger',
                description: 'Permission to access location was denied',
            });
            return undefined;
        }
        let location = await Location.getCurrentPositionAsync({});
        return location;
    }

}
let locationUtils = LocationUtils.shared;
export {locationUtils}

