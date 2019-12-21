
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


export default class RequestsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'HOME',
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
        };
    }

    constructor(props) {
        super(props)

        this.state = {
            loaded: false,
            isAccepted: false,
            bookButtonTitle: 'Accept'
        }
        this.requests = []
    }

    componentDidMount() {
        this.requests = []
        firebaseUtils.bookingRef.child(appStateManager.user.id).on('value', (snapshot) => {
            console.log(snapshot.val())
            snapshot.forEach(a => {
                firebaseUtils.FireBase.ref().child("users").child(a.key).once('value', (snapshot2) => {
                    if (snapshot2.val() !== undefined && snapshot2.val() !== null){
                        var val = snapshot2.val()
                        val.isAccepted = a.val()
                        this.requests.push(val);   
                        this.setState({loaded: true}) 
                        console.log(snapshot2.val())
                    }
                })
            });
        })
    }

    onBookPressed(item) {
        if (!item.isAccepted ){
            const { navigate } = this.props.navigation;
            item.name = item.title
            // item.isAccepted = true
            // this.setState({isAccepted: true, bookButtonTitle: 'Accepted'})
            navigate('Chat', { item: item, type: item.type || appStateManager.user.type || 'user' });
            
        }
    }

    chatAction() {
        const { navigate } = this.props.navigation;
        navigate('Conversations');
    }

    editProfile() {
        // const { navigate } = this.props.navigation;
        // navigate('Chat');
    }

    logout() {
        const { navigate } = this.props.navigation;
        navigate('Auth');
    }

    requests() {
        // const { navigate } = this.props.navigation;
        //     navigate('Chat');
    }


    renderItem = ({ item, index }) => {
        return(
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 8, marginVertical: 4, backgroundColor: 'black'}}>
                <Image style={{height: 50, aspectRatio: 1, borderRadius: 25, backgroundColor: 'white'}} source={{uri: item.image || ''}} />
                <Text style={{ fontSize: 16, color: 'white', marginHorizontal: 12 }}>{item.title || 'Not Available'}</Text>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: item.isAccepted ? 'white' : 'rgba(8,121,233,1.0)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, }} onPress={() => this.onBookPressed(item)} >
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>{item.isAccepted ? 'Accepted' : 'Accept' }</Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.requests}
                    renderItem={this.renderItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    
                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 15,
        backgroundColor: '#ffffff',
    },
});