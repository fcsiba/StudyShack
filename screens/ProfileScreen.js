import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Platform,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class ProfileScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Profile',
            headerTintColor: '#ffffff',
            headerStyle: {
                backgroundColor: 'black',
                borderBottomColor: 'rgba(0, 0, 0, 0.0)',
                ...Platform.select({
                    ios: {},
                    android: {
                        elevation: 0,
                    },
                }),
            },
            // header: null
        };
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle='light-content' />}
                <View style={styles.profileView} >

                </View>
                <ExpoLinksView />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
    },
    profileView: {
        height: 100,
        aspectRatio: 1,
        borderRadius: 50,
        backgroundColor: 'white',
        alignSelf: 'center',
        
    },
});
