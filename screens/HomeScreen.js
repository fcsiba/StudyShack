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
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { firebaseUtils, arrayUtils, notificationUtils } from '../utils'
import { appStateManager } from '../singletons'

import { SharedElement } from 'react-navigation-shared-element';
import { Notifications } from 'expo'


export default class HomeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Map',
      headerTintColor: '#000000',
      headerStyle: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        borderBottomColor: 'rgba(0, 0, 0, 0.0)',
        ...Platform.select({
          ios: {},
          android: {
            elevation: 0,
          },
        }),
      },
      headerLeft: (<TouchableOpacity style={{ height: 34, aspectRatio: 1, marginHorizontal: 16, marginTop: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Profile')} >
        {/* <Feather name="menu" size={25} color="black" /> */}
        <Image style={{ height: 34, aspectRatio: 1, borderRadius: 17, borderWidth: 2, borderColor: 'white' }} source={{ uri: 'https://i.pinimg.com/originals/00/f3/ba/00f3baed741806ab1cc74e094b30824b.jpg' }} />
      </TouchableOpacity>),
      headerRight: (<TouchableOpacity style={{ height: 35, aspectRatio: 1, marginHorizontal: 16, marginTop: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('Conversations')} >
        <MaterialCommunityIcons name="message-outline" size={25} color="black" />
      </TouchableOpacity>)
      // header: null
    };
  }

  constructor(props) {
    super(props)

    this.state = {
      loaded: false,
      selectedIndex: 0,
    }

    this.selectedPriceRange = {
      minimum: 0,
      maximum: 20000,
    }
    this.selectedSubjects = [] //"English", "Maths", "Science", "Chemistry", "Physics", "Biology", "Economics", "Urdu", "Islamic Studies", "Pakistan Studies", "Arabic"
    this.selectedDistance = 50

    this.items = []

    this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(this)
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 30 }

  }

  componentDidMount() {
    notificationUtils.registerForPushNotificationsAsync()
    this.offlineFunction()
    // Notifications.getExpoPushTokenAsync().then((value) => {
    //   console.log(value)
    // })

    // firebaseUtils.geoFire.set({
    //   "-LwXGQx4PFC99nT6_w8Q": [24.933264, 67.110920],
    //   "-LwXGZ7JANTmclm7Zxg1": [24.913264, 67.220920],
    //   "-LwXGfGV4DvzR8kpZPGk": [24.903264, 67.300920],
    //   "-LwXGoypNN8jqmlNp2Za": [24.923264, 67.430920],
    //   "-LwXGrMFHB4d_GT2cA7J": [24.943264, 67.540920],
    // }).then(function() {
    //   console.log("Provided keys have been added to GeoFire");
    // }, function(error) {
    //   console.log("Error: " + error);
    // });
    this.refresh(this.selectedSubjects, this.selectedDistance, this.selectedPriceRange.minimum, this.selectedPriceRange.maximum)

  }

  offlineFunction() {
    var myConnectionsRef = firebaseUtils.FireBase.ref(`connections/${appStateManager.user.type}s`);
    var connectedRef = firebaseUtils.FireBase.ref('.info/connected');
    connectedRef.on('value', function (snap) {
      if (snap.val() === true) {
        var con = myConnectionsRef.child(`${appStateManager.user.id}`);
        con.set({
          id: appStateManager.user.id,
          name: appStateManager.user.name,
          image: appStateManager.user.image,
          isConnected: true,
          lastOnline: Date(),
          token: appStateManager.user.token
        });
        con.onDisconnect().set({
          id: appStateManager.user.id,
          name: appStateManager.user.name,
          image: appStateManager.user.image,
          isConnected: false,
          lastOnline: Date(),
          token: appStateManager.user.token
        });
      }
    });
  }

  refresh=(subjects, distance, minimum, maximum)=> {

    this.selectedDistance = distance
    this.selectedSubjects = subjects
    this.selectedPriceRange.minimum = minimum
    this.selectedPriceRange.maximum = maximum

    if (this.onReadyRegistration !== undefined && this.onReadyRegistration !== null){
      this.onReadyRegistration.cancel()
      this.items = []
    }

    this.geoQuery = firebaseUtils.geoFire.query({
      center: [24.9224346, 67.1497583],
      radius: distance
    });

    this.onReadyRegistration = this.geoQuery.on("key_entered", (key, location, distance) => {
      // console.log(key + " exited query to " + location + " (" + distance + " km from center)");
      console.log(location)
      firebaseUtils.teachersRef.child(key).once("value", (snapshot) => {
        if (snapshot.val() !== undefined) {
          var val = snapshot.val()

          if (subjects.length != 0 && !arrayUtils.arraysEqual(subjects, val.subjects)) {
            return
          }
          if (!(val.rate.price > minimum)) {
            return
          }
          if (maximum != 0 && !(val.rate.price < maximum)) {
            return
          }
          val.distance = distance.toFixed(1)
          val.latlong = {
            latitude: location[0],
            longitude: location[1]
          }
          val.id = key

          this.items.push(val)
          this.setState({ loaded: true })
        }
      })
    })
  }


  getTeachersAround() {

  }

  onScrollAnimationEnd() {
    console.log("onScrollAnimationEnd");
  }

  handleViewableItemsChanged(info) {
    console.log("handleViewableItemsChanged");
    console.log(info && info.viewableItems && info.viewableItems[0] && info.viewableItems[0].index)
    let index = info && info.viewableItems && info.viewableItems[0] && info.viewableItems[0].index
    if (index !== undefined) {
      this.map.animateCamera({ center: this.items[index].latlong, zoom: 16 })
      this.setState({ selectedIndex: index })
    }
  }

  updatedata() {
    this.setState({ loaded: true })
  }

  onMarkerPress(index) {
    console.log("onMarkerPress")
    console.log(index)
    if (index !== undefined) {
      this.list.scrollToIndex({ animated: true, index: index, viewPosition: 0 })
      this.setState({ selectedIndex: index })
    }
  }

  onSearchbarTap() {
    this.props.navigation.navigate('Search', {
      selectedPriceMinimum: this.selectedPriceRange.minimum,
      selectedPriceMaximum: this.selectedPriceRange.maximum,
      selectedSubjects: this.selectedSubjects,
      selectedDistance: this.selectedDistance,
      onGoBack: this.refresh,
    })
  }

  onItemPress(item, index) {
    this.props.navigation.navigate('Details', item)
  }

  renderMarker(image, index) {
    return (
      // <View>
      <View style={[styles.customMarkerStyle, { backgroundColor: (index === this.state.selectedIndex) ? 'white' : 'black' }]} >
        <Image style={{ height: 40, borderRadius: 20, aspectRatio: 1, }} source={{ uri: image }} />
      </View>
      // </View>
    );
  }

  renderFooter() {
    return (
      <View style={{ width: Dimensions.get('window').width - 180 }}>

      </View>
    )
  }

  renderItem({ item, index }) {
    var isSelected = (this.state.selectedIndex === index)
    return (
      <View style={{ width: 180, height: 160, overflow: 'visible' }}>
        <TouchableOpacity style={[styles.itemView, { borderWidth: 0 }]} activeOpacity={0.9} onPress={() => this.onItemPress(item, index)}>
          <View style={styles.itemImageView}>
            <Image style={{ height: 70, aspectRatio: 1, borderRadius: 35, borderWidth: 3, borderColor: isSelected ? 'white' : 'black' }} source={{ uri: item.image }} />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '500', marginTop: -25, }} numberOfLines={1}>{item.title}</Text>
          <Text style={{ fontSize: 13, fontWeight: '500', color: 'gray', marginTop: 4, textAlign: 'center' }} numberOfLines={2} >{item.subjects.join(", ")}</Text>
          <Text style={{ fontSize: 18, fontWeight: '500', color: 'red', marginTop: 8, textAlign: 'center' }} numberOfLines={1} >{item.rate.price} {item.rate.currancy}</Text>
          <Text style={{ fontSize: 13, fontWeight: '500', color: 'gray', marginTop: 2, textAlign: 'center' }} numberOfLines={1} >{item.rate.period}</Text>
          {/* <Text>{item.rate.period}</Text> */}
        </TouchableOpacity>
      </View>
    );
  }

  renderMapView() {
    return (
      <MapView
        ref={map => { this.map = map }}
        style={styles.mapStyle}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton={true}
        showsUserLocation={true}
        // followsUserLocation={true}
        userLocationAnnotationTitle={'You'}
        customMapStyle={customStyle}
        mapPadding={{ top: 80, left: 0, right: 0, bottom: 190 }}>
        {
          this.items.map((value, index) => {
            return (<Marker
              style={{ overflow: 'visible', justifyContent: 'center', alignItems: 'center' }}
              coordinate={{ latitude: value.latlong.latitude, longitude: value.latlong.longitude }}
              // title={value.title}
              key={index}
              onPress={() => this.onMarkerPress(index)}
            // image={{ uri: value.image }}
            // description={value.description}
            >
              {this.renderMarker(value.image, index)}
              <View style={{ height: 6, aspectRatio: 1, borderRadius: 3, backgroundColor: 'black' }} ></View>
              <Text style={{ fontSize: 10, fontWeight: '500', textAlign: 'center', marginTop: 2 }} >{value.distance} km</Text>
            </Marker>)
          })

        }
      </MapView>
    );
  }

  renderFlatList() {
    return (
      <SafeAreaView style={{ overflow: 'visible', position: 'absolute', marginBottom: 16, bottom: 0, left: 0, right: 0, flexDirection: 'column' }}>
        <FlatList
          ref={list => { this.list = list }}
          style={{ overflow: 'visible' }}
          data={this.items}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => `${index}`}
          horizontal={true}
          snapToAlignment={"start"}
          snapToInterval={180}
          decelerationRate={"fast"}
          pagingEnabled={true}
          ListFooterComponent={this.renderFooter}
          // contentInset={{ top: 0, right: Dimensions.get('window').width - 180, left: 5, bottom: 0 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // onScrollAnimationEnd={() => this.onScrollAnimationEnd()}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
        />
      </SafeAreaView>
    );
  }

  render() {
    return (
      <View
        style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='dark-content' />}

        {this.renderMapView()}

        <LinearGradient colors={['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.000)']} pointerEvents={'none'} style={styles.gradientView}></LinearGradient>

        {/* <View
          style={{ position: 'absolute', top: 0, left: 0, right: 0 }}> */}

        <SafeAreaView style={{ alignItems: 'center' }}>
          {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: 44, width: '100%' }}>
              <Text>MAP</Text>
            </View> */}
          <SharedElement id={`searchBar`}>
            <TouchableOpacity style={styles.searchBarStyle} activeOpacity={0.95} onPress={() => this.onSearchbarTap.bind(this)()}>
              <Feather name="search" size={20} color="black" />
              <Text style={{ color: 'gray', fontWeight: '500', fontSize: 17, marginLeft: 16, flexGrow: 1, textAlign: 'left' }}>Search</Text>
              <Feather name="filter" size={20} color="black" />
            </TouchableOpacity>
          </SharedElement>
        </SafeAreaView>
        {/* </View> */}

        {this.renderFlatList()}

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    overflow: 'visible'
  },
  mapStyle: {
    // width: '100%',
    // height: '100%',
    // top: 
    position: 'absolute',
    top: -64,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'visible'
  },
  gradientView: {
    position: 'absolute',
    height: '20%',
    width: '100%',
    top: -64
  },
  itemView: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    marginLeft: 15,
    overflow: 'visible',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderColor: '#ffffff',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,

      },
    }),
  },
  itemImageView: {
    zIndex: 3,
    top: -35,
    // overflow: 'scroll',
    borderRadius: 35,
    height: 70,
    aspectRatio: 1,
    // borderWidth: 3,
    // borderColor: 'white',
    backgroundColor: 'black',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,

      },
    }),
  },
  customMarkerStyle: {
    // marginRight: '12%',
    // marginTop: '12%',
    overflow: 'visible',
    height: 44,
    aspectRatio: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchBarStyle: {
    overflow: 'visible',
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    width: '88%',
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: 'white',
    // zIndex: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 22,
      },
      android: {
        elevation: 16,
      },
    }),
  },
});

const customStyle = [
  {
    "featureType": "administrative",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#d6e2e6"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#cfd4d5"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7492a8"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "lightness": 25
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dde2e3"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#cfd4d5"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dde2e3"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7492a8"
      }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#dde2e3"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#588ca4"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.icon",
    "stylers": [
      {
        "saturation": -100
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a9de83"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#bae6a1"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c6e8b3"
      }
    ]
  },
  {
    "featureType": "poi.sports_complex",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#bae6a1"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#41626b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "saturation": -45
      },
      {
        "lightness": 10
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c1d1d6"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#a6b5bb"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#9fb6bd"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.icon",
    "stylers": [
      {
        "saturation": -70
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#b4cbd4"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#588ca4"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#008cb5"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": -5
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#a6cbe3"
      }
    ]
  }
];





