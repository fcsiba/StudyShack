import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, FlatList, KeyboardAvoidingView, StyleSheet, Platform, ScrollView, View, TouchableOpacity } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

import { firebaseUtils } from '../utils';

import { showMessage, hideMessage } from "react-native-flash-message";
import { appStateManager } from '../singletons';

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
        address: null,
        price: null,
        password: null,
        fullname: null,
        latitude: null,
        longitude: null,
        errors: [],
        loading: false,
        isTeacher: false,
        selectedSubjects: [],
    }

    subjects = ["English", "Maths", "Science", "Chemistry", "Physics", "Biology", "Economics", "Urdu", "Islamic Studies", "Pakistan Studies", "Arabic"]

    handleSignUp() {
        const { navigation } = this.props;
        const { email, address, password, fullname, isTeacher, price, selectedSubjects, latitude, longitude } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        // check with backend API or with some static data
        if (!email) errors.push('email');
        if (!address && isTeacher) errors.push('address');
        if (!price && isTeacher) errors.push('price');
        if (!latitude && isTeacher) errors.push('latitude');
        if (!longitude && isTeacher) errors.push('longitude');
        if (!password) errors.push('password');
        if (!fullname) errors.push('fullname');
        if (selectedSubjects.length === 0 && isTeacher) errors.push('subjects');

        this.setState({ errors });

        if (!errors.length) {

            firebaseUtils.Auth.createUserWithEmailAndPassword(email, password).then((value) => {
                value.user.updateProfile({ displayName: fullname, photoURL: 'https://unioncapitalrealty.com/wp-content/uploads/elementor/thumbs/placeholder-profile-1-ofpc8ml3479nsyn6fpfrzb1wj3gtnyj2zyjvm5aw8o.png' })
                appStateManager.user.id = value.user.uid
                appStateManager.user.email = value.user.email
                appStateManager.user.name = fullname
                appStateManager.user.image = 'https://unioncapitalrealty.com/wp-content/uploads/elementor/thumbs/placeholder-profile-1-ofpc8ml3479nsyn6fpfrzb1wj3gtnyj2zyjvm5aw8o.png'

                var teacherBody = {
                    id: value.user.uid,
                    type: isTeacher ? 'teacher' : 'user',
                    title: fullname,
                    image: appStateManager.user.image,
                    rating: 5.0,
                    latlong: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    address: address,
                    rate: {
                        currancy: "PKR",
                        period: "HOURLY",
                        price: `${price}`
                    },
                    subjects: selectedSubjects,
                    // about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    // links: {
                    //     facebook: "https://www.facebook.com/syed.m.ali.masood",
                    //     linkedin: 'https://www.linkedin.com/in/syed-mohammad-ali-masood/'
                    // },
                    hours: [
                        { title: "Monday", value: "10:30 am - 6:00 pm" },
                        { title: "Tuesday", value: "10:30 am - 6:00 pm" },
                        { title: "Wednesday", value: "10:30 am - 6:00 pm" },
                        { title: "Thursday", value: "10:30 am - 6:00 pm" },
                        { title: "Friday", value: "10:30 am - 6:00 pm" },
                        { title: "Saturday", value: "10:30 am - 6:00 pm" },
                        { title: "Sunday", value: "10:30 am - 6:00 pm" },
                    ],
                    token: appStateManager.user.token
                }

                var studentBody = {
                    id: value.user.uid,
                    type: 'user',
                    title: fullname,
                    image: appStateManager.user.image,
                    email: value.user.email,
                    token: appStateManager.user.token
                }

                firebaseUtils.FireBase.ref().child(isTeacher ? 'teachers' : 'users').child(value.user.uid).set(isTeacher ? teacherBody : studentBody, (err) => {

                    this.setState({ loading: false });
                    // if (err !== undefined && err !== null) {
                        showMessage({
                            message: `${'Success'}`,
                            autoHide: true,
                            type: 'success',
                            description: `${'You have successfully loggedIn'}`,
                        })
                        navigation.navigate( isTeacher ? 'Teacher' : 'Main');
                    // } else {
                    //     showMessage({
                    //         message: `${ 'Error' }`,
                    //         autoHide: false,
                    //         type: 'danger',
                    //         description: `${ 'User can not be created at the moment please concerned department'}`,
                    //     })
                    // }
                })
                // firebaseUtils.
            }).then(() => {
                this.setState({ loading: false });
                showMessage({
                    message: `${'Error'}`,
                    autoHide: false,
                    type: 'danger',
                    description: `${'User can not be created at the moment please concerned department'}`,
                })
            })

        } else {
            this.setState({ loading: false });
            showMessage({
                message: `${'Error'}`,
                autoHide: false,
                type: 'danger',
                description: `${'Some fields are missing'}`,
            })
        }
    }

    selectSubjectItem(item) {
        let tempArray = this.state.selectedSubjects
        let contains = tempArray.indexOf(item)
        if (contains !== -1) {
            tempArray.splice(contains, 1);
            let array = tempArray
            this.setState({
                selectedSubjects: array
            })
        } else {
            tempArray.push(item)
            let array = tempArray;
            this.setState({
                selectedSubjects: array
            })
        }
    }

    renderSubjectItem({ item, index }) {
        var isSelected = true
        let contains = this.state.selectedSubjects.indexOf(item)
        if (contains !== -1) {
            isSelected = true
        } else {
            isSelected = false
        }
        return (
            <TouchableOpacity style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isSelected ? 'black' : 'white', borderRadius: 4, borderWidth: 1, borderColor: isSelected ? 'black' : 'gray' }}
                onPress={() => this.selectSubjectItem(item, index)} activeOpacity={0.8}>
                <Text style={{ fontSize: 16, color: isSelected ? 'white' : 'gray' }} >{item}</Text>
            </TouchableOpacity>
        );
    }

    renderSubjects() {
        return (
            <View style={{ marginTop: 20, }} >
                <Text style={styles.titleStyle} >Subjects</Text>
                <FlatList
                    contentContainerStyle={{
                        alignSelf: 'flex-start',
                        // marginHorizontal: 20,
                    }}
                    data={this.subjects}
                    renderItem={this.renderSubjectItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                />
            </View>
        )
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
                            autoCapitalize='sentences'
                            label="Name"
                            error={hasErrors('fullname')}
                            style={[styles.input, hasErrors('fullname')]}
                            defaultValue={this.state.fullname}
                            onChangeText={text => this.setState({ fullname: text })}
                        />
                        {this.state.isTeacher &&
                            <Input
                                autoCapitalize='sentences'
                                label="Address"
                                error={hasErrors('address')}
                                style={[styles.input, hasErrors('address')]}
                                defaultValue={this.state.address}
                                onChangeText={text => this.setState({ address: text })}
                            />}
                        {this.state.isTeacher &&
                            <Input
                                label="Price (per hour in PKR)"
                                error={hasErrors('price')}
                                style={[styles.input, hasErrors('price')]}
                                defaultValue={this.state.price}
                                onChangeText={text => this.setState({ price: text })}
                            />
                        }
                        {this.state.isTeacher &&
                            <Input
                                label="Latitude"
                                error={hasErrors('latitude')}
                                style={[styles.input, hasErrors('latitude')]}
                                defaultValue={this.state.latitude}
                                onChangeText={text => this.setState({ latitude: text })}
                            />
                        }
                        {this.state.isTeacher &&
                            <Input
                                label="Longitude"
                                error={hasErrors('longitude')}
                                style={[styles.input, hasErrors('longitude')]}
                                defaultValue={this.state.longitude}
                                onChangeText={text => this.setState({ longitude: text })}
                            />
                        }
                        <Input
                            email
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

                        {/* {this.state.isTeacher &&
                            <Input
                                label="Address"
                                error={hasErrors('address')}
                                style={[styles.input, hasErrors('address')]}
                                defaultValue={this.state.address}
                                onChangeText={text => this.setState({ address: text })}
                            />} */}

                        {
                            this.state.isTeacher && this.renderSubjects()
                        }

                        <Button gradient onPress={() => this.handleSignUp()}>
                            {loading ?
                                <ActivityIndicator size="small" color="white" /> :
                                <Text bold white center>Sign Up</Text>
                            }
                        </Button>

                        {/* <Button onPress={() => navigation.navigate('Login')}>
                            <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                                Back to Login
                            </Text>
                        </Button> */}
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
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
        marginVertical: 8,
        // marginHorizontal: 20
    },
})
