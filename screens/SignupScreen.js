import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, Platform, ScrollView } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

export default class SignupScreen extends Component {

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
        email: null,
        username: null,
        password: null,
        fullname: null,
        errors: [],
        loading: false,
    }

    handleSignUp() {
        const { navigation } = this.props;
        const { email, username, password, fullname } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        // check with backend API or with some static data
        if (!email) errors.push('email');
        if (!username) errors.push('username');
        if (!password) errors.push('password');
        if (!fullname) errors.push('fullname');

        this.setState({ errors, loading: false });

        if (!errors.length) {
            Alert.alert(
                'Success!',
                'Your account has been created',
                [
                    {
                        text: 'Continue', onPress: () => {
                            navigation.navigate('Browse')
                        }
                    }
                ],
                { cancelable: false }
            )
        }
    }

    render() {
        const { navigation } = this.props;
        const { loading, errors } = this.state;
        const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

        return (
            <ScrollView keyboardDismissMode={'interactive'}>
                <KeyboardAvoidingView style={styles.signup} behavior="padding">
                    <Block padding={[0, theme.sizes.base * 2]}>
                        {/* <Text h1 bold>Sign Up</Text> */}
                        <Input
                            label="Full Name"
                            error={hasErrors('fullname')}
                            style={[styles.input, hasErrors('fullname')]}
                            defaultValue={this.state.fullname}
                            onChangeText={text => this.setState({ fullname: text })}
                        />
                        <Input
                            email
                            label="Email"
                            error={hasErrors('email')}
                            style={[styles.input, hasErrors('email')]}
                            defaultValue={this.state.email}
                            onChangeText={text => this.setState({ email: text })}
                        />
                        <Input
                            label="Username"
                            error={hasErrors('username')}
                            style={[styles.input, hasErrors('username')]}
                            defaultValue={this.state.username}
                            onChangeText={text => this.setState({ username: text })}
                        />
                        <Input
                            secure
                            label="Password"
                            error={hasErrors('password')}
                            style={[styles.input, hasErrors('password')]}
                            defaultValue={this.state.password}
                            onChangeText={text => this.setState({ password: text })}
                        />
                        <Button gradient onPress={() => this.handleSignUp()}>
                            {loading ?
                                <ActivityIndicator size="small" color="white" /> :
                                <Text bold white center>Sign Up</Text>
                            }
                        </Button>

                        <Button onPress={() => navigation.navigate('Login')}>
                            <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                                Back to Login
                            </Text>
                        </Button>
                    </Block>
                </KeyboardAvoidingView>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    signup: {
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
