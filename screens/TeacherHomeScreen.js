
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseUtils, arrayUtils, notificationUtils } from '../utils'
import { appStateManager } from '../singletons'


export default class TeacherHomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Home',
      headerTintColor: '#ffffff',
      headerStyle: {
        backgroundColor: 'rgba(0,0,0,1.0)',
        borderBottomColor: 'rgba(0, 0, 0, 0.0)',
        ...Platform.select({
          ios: {},
          android: {
            elevation: 0,
          },
        }),
      },
      //   headerLeft: (<TouchableOpacity style={{ height: 34, aspectRatio: 1, marginHorizontal: 16, marginTop: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Profile')} >
      //     {/* <Feather name="menu" size={25} color="black" /> */}
      //     <Image style={{ height: 34, aspectRatio: 1, borderRadius: 17, borderWidth: 2, borderColor: 'white' }} source={{ uri: 'https://i.pinimg.com/originals/00/f3/ba/00f3baed741806ab1cc74e094b30824b.jpg' }} />
      //   </TouchableOpacity>),
      //   headerRight: (<TouchableOpacity style={{ height: 35, aspectRatio: 1, marginHorizontal: 16, marginTop: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Conversations')} >
      //     <MaterialCommunityIcons name="message-outline" size={25} color="black" />
      //   </TouchableOpacity>)
      // header: null
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
    }

  }

  componentDidMount(){
    var key = appStateManager.user.id
    firebaseUtils.geoFire.set(
      key, [24.933264, 67.110920],
    ).then(function() {
      console.log("Provided keys have been added to GeoFire");
    }, function(error) {
      console.log("Error: " + error);
    });
  }

  chatAction (){
    const { navigate } = this.props.navigation;
    navigate('Conversations');
  }

  editProfile(){
    const { navigate } = this.props.navigation;
    navigate('EditProfile');
  }

  logout(){
    const { navigate } = this.props.navigation;
    navigate('Auth');
  }

  requests(){
    const { navigate } = this.props.navigation;
        navigate('Requests');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.4, aspectRatio: 1, backgroundColor: '#000000', borderRadius: 10, margin: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => this.requests()}>
              <Text style={{ fontSize: 16, color: 'white' }}>REQUESTS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.4, aspectRatio: 1, backgroundColor: '#000000', borderRadius: 10, margin: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => this.chatAction()}>
            <Text style={{ fontSize: 16, color: 'white' }}>CHAT</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.4, aspectRatio: 1, backgroundColor: '#000000', borderRadius: 10, margin: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => this.editProfile()}>
            <Text style={{ fontSize: 16, color: 'white' }}>EDIT PROFILE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: Dimensions.get('window').width * 0.4, aspectRatio: 1, backgroundColor: '#000000', borderRadius: 10, margin: 12, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => this.logout()}>
            <Text style={{ fontSize: 16, color: 'white' }}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#ffffff',
  },
});