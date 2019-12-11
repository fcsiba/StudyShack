import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import ForgotScreen from '../screens/ForgotPassword';

const stackNav = createStackNavigator({
    Welcome: WelcomeScreen,
    Login: LoginScreen,
    Signup: SignupScreen,
    Forgot: ForgotScreen
  },{
    mode: 'modal',
    headerMode: 'float',
  })
  
  stackNav.path = '';
  
  export default stackNav;