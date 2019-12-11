import { View, Dimensions, } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { showMessage, hideMessage } from 'react-native-flash-message';
import moment from "moment";

class StringUtils {

    static shared = new StringUtils()

    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validatePassword(password) {
        return String(password).length > 5;
    }

    validateName(name) {
        var re = /^([A-Z]+[a-z]+ [A-Z]+[a-z]+|[A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+|[A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+)$/;
        return re.test(name.trimLeft().trimRight());
        // return String(name).length > 4;
    }

    validateUserName(username) {
        var re = /^[a-zA-Z0-9]+$/;
        return re.test(username);
        // return String(username).length > 4;
    }

    validatePhone(phone) {
        return String(phone).length > 3;
    }

    validateCountry(country) {
        return String(country).length > 3;
    }

    getTime(datetime) {
        var date = new Date(datetime);
        // date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        // console.log(date.toString());
        return date.toString()
    }

    formateDate(datetime){
        return moment(datetime).format('LLL')
    }

    validateTime(time) {
        return String(time).length > 3
    }

    validateTitle(title) {
        // var re = /^([A-Z]+[a-z]+|[A-Z]+[a-z]+ [A-Z]+[a-z]+|[A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+|[A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+ [A-Z]+[a-z]+)$/;
        // return re.test(title);
        return String(title).trimLeft().trimRight() !== ''
    }

    validateDescription(description) {
        return String(description).trimLeft().trimRight() !== '';
    }

    validateURL(text) {
        var re = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
        return re.test(text);
    }

}
let stringUtils = StringUtils.shared;
export { stringUtils }

