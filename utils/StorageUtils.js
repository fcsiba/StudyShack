import { View, Dimensions, AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';

class StorageUtils {

    static shared = new StorageUtils()

    async _storeData(key, data) {
        try {
            if (key !== undefined || key !== null) {
                const response = await AsyncStorage.setItem(String(key), data);
                // console.log(response);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async _retrieveData(key) {
        try {
            if (key !== undefined || key !== null) {
                const value = await AsyncStorage.getItem(String(key));
                if (value !== null) {
                    // console.log(value);
                    return value;
                }
            }
            return undefined;
        } catch (error) {
            console.log(error);
            return undefined;
        }
    }
    async _deleteData(key) {
        try {
            if (key !== undefined || key !== null) {
                const response = await AsyncStorage.removeItem(String(key));
                // console.log(response);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    setAccessToken = async (data) => { return await this._storeData("access_token", data); }
    getAccessToken = async () => { return await this._retrieveData("access_token"); }
    removeAccessToken = async () => { return await this._deleteData("access_token"); }

}
let storageUtils = StorageUtils.shared;
export { storageUtils }

