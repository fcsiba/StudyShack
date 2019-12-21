import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SearchScreen from '../screens/SearchScreen';
import ChatScreen from '../screens/ChatScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import TeacherDetailsScreen from '../screens/TeacherDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: LinksScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
});

tabNavigator.path = '';



// new
const stackNavigator = createSharedElementStackNavigator(
  createStackNavigator,
  {
    Home: HomeScreen,
    Search: SearchScreen,
    Conversations: ConversationsScreen,
    Chat: ChatScreen,
    Details: TeacherDetailsScreen,
    Profile: EditProfileScreen,
  },
  {
    initialRouteName: 'Home',
    mode: 'modal',
    headerMode: 'float',
  }
)

export default stackNavigator

// const stackNav = createStackNavigator({
//   Home: HomeScreen,
//   Search: SearchScreen,
//   Conversations: ConversationsScreen,
//   Chat: ChatScreen,
//   Details: TeacherDetailsScreen,
//   Profile: ProfileScreen,
// },{
  // mode: 'modal',
  // headerMode: 'float',
// })

// stackNav.path = '';

// export default stackNav;
