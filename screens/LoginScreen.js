import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Platform, ScrollView, View, TouchableOpacity } from 'react-native'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { firebaseUtils } from '../utils';

import { showMessage, hideMessage } from "react-native-flash-message";
import { appStateManager } from '../singletons';

const VALID_EMAIL = "test1@study.com";
const VALID_PASSWORD = "123123";

export default class LoginScreen extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'SignUp',
            headerTintColor: '#ffffff',
            headerStyle: {
                backgroundColor: theme.colors.primary,
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


    state = {
        email: VALID_EMAIL,
        password: VALID_PASSWORD,
        errors: [],
        loading: false,
        isTeacher: false
    }

    handleLogin() {
        const { navigation } = this.props;
        const { email, password, isTeacher } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        // check with backend API or with some static data

        if (email.length === 0) {
            errors.push('email');
        }
        if (password.length === 0) {
            errors.push('password');
        }

        firebaseUtils.Auth.signInWithEmailAndPassword(email, password).then((value) => {

            this.setState({ errors, loading: false });

            appStateManager.user.id = value.user.uid
            appStateManager.user.email = value.user.email
            appStateManager.user.name = value.user.displayName
            appStateManager.user.image = value.user.photoURL

            firebaseUtils.FireBase.ref().child(isTeacher ? 'teachers' : 'users').child(value.user.uid).once('value', (snapshot) => {
                var val = snapshot.val()
                if (val !== undefined && val !== null){
                    firebaseUtils.FireBase.ref().child(isTeacher ? 'teachers' : 'users').child(value.user.uid).child('token').set(appStateManager.user.token)
                    if (isTeacher){
                        appStateManager.user.about = val.about
                        appStateManager.user.subjects = val.subjects
                        appStateManager.user.hours = val.hours
                        appStateManager.user.rate = val.rate
                        appStateManager.user.links = val.links
                        appStateManager.user.latlong = val.latlong
                        appStateManager.user.rating = val.rating
                        appStateManager.user.name = val.title
                        appStateManager.user.address = val.address
                        appStateManager.user.token = val.token
                        appStateManager.user.type = 'teacher'
                        navigation.navigate('Teacher');
                    }else{
                        appStateManager.user.image = val.image
                        appStateManager.user.name = val.title
                        appStateManager.user.token = val.token
                        appStateManager.user.type = 'user'
                        navigation.navigate('Main');
                    }
                }else{
                    showMessage({
                        message: `${'Error' || ''}`,
                        autoHide: false,
                        type: 'danger',
                        description: `${'User does not exist try switing the account type' || ''}`,
                    }) 
                }
            })

            // navigation.navigate('Main');
        }).catch((reason) => {

            errors.push('email');
            errors.push('password');
            this.setState({ errors, loading: false });

            showMessage({
                message: `${'Error' || ''}`,
                autoHide: false,
                type: 'danger',
                description: `${reason || ''}`,
            })
        })

        // if (email !== VALID_EMAIL) {
        // errors.push('email');
        // }
        // if (password !== VALID_PASSWORD) {
        // errors.push('password');
        // }

        // this.setState({ errors, loading: false });

        // if (!errors.length) {
        //     // firebaseUtils.Auth.signInWithEmailAndPassword(email, )
        //     navigation.navigate('Main');
        // }
    }

    render() {
        const { navigation } = this.props;
        const { loading, errors } = this.state;
        const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

        return (
            <ScrollView keyboardDismissMode={'interactive'} >
                <KeyboardAvoidingView style={styles.login} behavior="padding">
                    <Block padding={[0, theme.sizes.base * 2]}>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
                            <TouchableOpacity style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: this.state.isTeacher ? 'white' : 'black', borderRadius: 4, borderWidth: 1, borderColor: this.state.isTeacher ? 'gray' : 'black' }}
                                onPress={() => this.setState({ isTeacher: false })} >
                                <Text style={{ fontSize: 16, color: this.state.isTeacher ? 'gray' : 'white' }} >{'Student'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: this.state.isTeacher ? 'black' : 'white', borderRadius: 4, borderWidth: 1, borderColor: this.state.isTeacher ? 'black' : 'gray' }}
                                onPress={() => this.setState({ isTeacher: true })} >
                                <Text style={{ fontSize: 16, color: this.state.isTeacher ? 'white' : 'gray' }} >{'Teacher'}</Text>
                            </TouchableOpacity>
                        </View>

                        <Input
                            label="Email"
                            error={hasErrors('email')}
                            style={[styles.input, hasErrors('email')]}
                            defaultValue={this.state.email}
                            onChangeText={text => this.setState({ email: text })}
                        />
                        <Input
                            secure
                            label="Password"
                            error={hasErrors('password')}
                            style={[styles.input, hasErrors('password')]}
                            defaultValue={this.state.password}
                            onChangeText={text => this.setState({ password: text })}
                        />
                        <Button gradient onPress={() => this.handleLogin()}>
                            {loading ?
                                <ActivityIndicator size="small" color="white" /> :
                                <Text bold white center>Login</Text>
                            }
                        </Button>

                        <Button onPress={() => navigation.navigate('Forgot')}>
                            <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                                Forgot your password?
              </Text>
                        </Button>
                    </Block>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    login: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        borderRadius: 0,
        borderWidth: 0,
        borderBottomColor: theme.colors.gray2,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    hasErrors: {
        borderBottomColor: theme.colors.accent,
    }
})