import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TeacherHomeScreen from '../screens/TeacherHomeScreen'
import ChatScreen from '../screens/ChatScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import RequestsScreen from '../screens/RequestsScreen'
import EditProfileScreen from '../screens/EditProfileScreen'

const stackNav = createStackNavigator({
    Main: TeacherHomeScreen,
    Conversations: ConversationsScreen,
    Chat: ChatScreen,
    Requests: RequestsScreen,
    EditProfile: EditProfileScreen
  },{
    mode: 'modal',
    headerMode: 'float',
  })
  
  stackNav.path = '';
  
  export default stackNav;