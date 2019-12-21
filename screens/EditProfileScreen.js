import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, FlatList, KeyboardAvoidingView, StyleSheet, Platform, ScrollView, View, TouchableOpacity } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

import { firebaseUtils } from '../utils';

import { showMessage, hideMessage } from "react-native-flash-message";
import { appStateManager } from '../singletons';

export default class EditProfileScreen extends Component {

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
        email: appStateManager.user.email,
        address: appStateManager.user.address,
        price: appStateManager.user.rate.price,
        fullname: appStateManager.user.name,
        errors: [],
        loading: false,
        isTeacher: appStateManager.user.type !== 'user',
        selectedSubjects: appStateManager.user.subjects,
        about: appStateManager.user.about,
        facebook: appStateManager.user.links && appStateManager.user.links.facebook || '',
        linkedin: appStateManager.user.links && appStateManager.user.links.linkedin || ''
    }

    subjects = ["English", "Maths", "Science", "Chemistry", "Physics", "Biology", "Economics", "Urdu", "Islamic Studies", "Pakistan Studies", "Arabic"]

    handleSignUp() {
        const { navigation } = this.props;
        const { email, address, fullname, isTeacher, price, selectedSubjects, about, facebook, linkedin } = this.state;
        const errors = [];

        Keyboard.dismiss();
        this.setState({ loading: true });

        // check with backend API or with some static data
        if (!email) errors.push('email');
        if (!address && isTeacher) errors.push('address');
        if (!price && isTeacher) errors.push('price');
        if (!fullname) errors.push('fullname');
        if (!about && isTeacher) errors.push('about');
        if (!facebook && isTeacher) errors.push('facebook');
        if (!linkedin && isTeacher) errors.push('linkedin');
        if (selectedSubjects.length === 0 && isTeacher) errors.push('subjects');

        this.setState({ errors });

        if (!errors.length) {

            var teacherBody = {
                id: appStateManager.user.id,
                type: isTeacher ? 'teacher' : 'user',
                title: fullname,
                image: appStateManager.user.image,
                rating: 5.0,
                latlong: {
                    latitude: 24.932264,
                    longitude: 67.17092
                },
                address: address,
                rate: {
                    currancy: "PKR",
                    period: "HOURLY",
                    price: `${price}`
                },
                subjects: selectedSubjects,
                about: about,
                links: {
                    facebook: facebook,
                    linkedin: linkedin
                },
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
                id: appStateManager.user.id,
                type: 'user',
                title: fullname,
                image: appStateManager.user.image,
                email: appStateManager.user.email,
                token: appStateManager.user.token
            }

            firebaseUtils.FireBase.ref().child(isTeacher ? 'teachers' : 'users').child(appStateManager.user.id).set(isTeacher ? teacherBody : studentBody, (err) => {

                this.setState({ loading: false });
                showMessage({
                    message: `${'Success'}`,
                    autoHide: true,
                    type: 'success',
                    description: `${'You have successfully loggedIn'}`,
                })
                navigation.navigate(isTeacher ? 'Teacher' : 'Main');
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
                                label="About"
                                error={hasErrors('about')}
                                style={[styles.input, hasErrors('about')]}
                                defaultValue={this.state.about}
                                onChangeText={text => this.setState({ about: text })}
                            />
                        }
                        {this.state.isTeacher &&
                            <Input
                                label="Facebook"
                                error={hasErrors('facebook')}
                                style={[styles.input, hasErrors('facebook')]}
                                defaultValue={this.state.facebook}
                                onChangeText={text => this.setState({ facebook: text })}
                            />
                        }
                        {this.state.isTeacher &&
                            <Input
                                label="Linkedin"
                                error={hasErrors('linkedin')}
                                style={[styles.input, hasErrors('linkedin')]}
                                defaultValue={this.state.linkedin}
                                onChangeText={text => this.setState({ linkedin: text })}
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
                                <Text bold white center>Update</Text>
                            }
                        </Button>

                        <Button onPress={() => navigation.navigate('Auth')}>
                            <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                                Logout
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
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
        marginVertical: 8,
        // marginHorizontal: 20
    },
})
