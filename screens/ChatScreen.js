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
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class ChatScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Chat',
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
});
