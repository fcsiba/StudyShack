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
    Image,
    View
} from 'react-native';
import { Linking } from 'expo'
import { LinearGradient } from 'expo-linear-gradient';
import * as Icon from '@expo/vector-icons';
import { ExpoLinksView } from '@expo/samples';
import { firebaseUtils, arrayUtils, notificationUtils } from '../utils'

import { Bubble, GiftedChat, SystemMessage, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
import { appStateManager } from '../singletons';

import AccessoryBar from '../components/AccessoryBar'
import CustomActions from '../components/CustomActions'
import CustomView from '../components/CustomView'

import NavigationBarButton from '../components/NavigationBarButton';
import { theme } from '../constants';

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
            headerTitle: <TouchableOpacity activeOpacity={0.8} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image style={{ height: 36, width: 36, borderRadius: 18, }} source={{ uri: navigation.getParam('image', '') }} />
                <View style={{ marginLeft: 8 }}>
                    <Text style={{ fontSize: 17, textAlign: 'center', fontWeight: '600', color: '#ffffff' }}>{String(navigation.getParam('name', '')).toUpperCase()}</Text>
                    {navigation.getParam('isOnline', false) && <Text style={{ fontSize: 13, textAlign: 'left', fontWeight: '400', color: '#ffffff' }}>{String(navigation.getParam('status', ''))}</Text>}
                </View>
            </TouchableOpacity>,
            headerLeft: <NavigationBarButton name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'ios-arrow-back'} onPress={() => navigation.pop()} />
            // header: null
        };
    }

    myfireBaseRef = firebaseUtils.FireBase.ref('Chat/sample/messages/sample');
    otherfireBaseRef = firebaseUtils.FireBase.ref('Chat/sample/messages/sample');
    myConversationRef = firebaseUtils.FireBase.ref('Chat/sample/conversations/sample');
    otherConversationRef = firebaseUtils.FireBase.ref('Chat/sample/conversations/sample');

    user = {
        _id: appStateManager.user.id,
        name: appStateManager.user.name,
        avatar: appStateManager.user.image,
    }

    users = []

    state = {
        step: 0,
        messages: [],
        loadEarlier: true,
        typingText: null,
        isLoadingEarlier: false,
        requestSent: false,
        text: "",
    }
    _isMounted = false;

    async componentDidMount() {
        this.startObservingMessages()
        this.startObservingMessageChanges()
        this.startObservingMessageDeletes()
    }

    async componentWillMount() {
        this._isMounted = true
        if (this.props.navigation.state.params === undefined) {
            return
        }
        if (this.props.navigation.state.params.item === undefined) {
            return;
        }
        if (this.props.navigation.state.params.type === undefined) {
            return;
        }
        // let { item, type } = this.props.navigation.state.params
        this.item = this.props.navigation.state.params.item;
        this.type = this.props.navigation.state.params.type;
        this.props.navigation.setParams({ image: this.item.image, name: this.item.name });

        this.myfireBaseRef = firebaseUtils.FireBase.ref(`chat/${appStateManager.user.id}/messages/${this.item.id}`);
        this.otherfireBaseRef = firebaseUtils.FireBase.ref(`chat/${this.item.id}/messages/${appStateManager.user.id}`);

        this.myConversationRef = firebaseUtils.FireBase.ref(`chat/${appStateManager.user.id}/conversations/${this.item.id}`);
        this.otherConversationRef = firebaseUtils.FireBase.ref(`chat/${this.item.id}/conversations/${appStateManager.user.id}`);

        this.startObservingUserOnlineStatus(this.item.id, this.type)

    }

    componentWillUnmount() {
        this._isMounted = false
        this.myfireBaseRef.off()
        this.otherfireBaseRef.off()
        this.myConversationRef.off()
        this.otherConversationRef.off()
    }

    startObservingUserOnlineStatus(id, type) {
        firebaseUtils.FireBase.ref(`connections/${type}s/${id}`).on('value', snapshot => {
            if (snapshot.val() !== null) {
                if (snapshot.val() !== undefined) {
                    this.props.navigation.setParams({ isOnline: snapshot.val().isConnected, status: snapshot.val().isConnected ? 'Online' : `` });
                }
            }
        })
    }

    startObservingMessages() {
        this.messageAddObserver = this.myfireBaseRef.limitToLast(10).on('child_added', snapshot => {
            if (this._isMounted === true) {
                this.onReceive(snapshot.val())
            }
        });
    }

    startObservingMessageChanges() {
        this.messageChangeObserver = this.myfireBaseRef.limitToLast(10).on('child_changed', snapshot => {
            if (this._isMounted === true) {
                this.onReplace(snapshot.val())
            }
        });
    }

    startObservingMessageDeletes() {
        this.messageDeleteObserver = this.myfireBaseRef.limitToLast(10).on('child_removed', snapshot => {
            if (this._isMounted === true) {
                this.onDelete(snapshot.val());
            }
        });
    }

    onReplace(message) {
        let index = this.state.messages.findIndex(item => item._id === message._id)
        if (index > -1) {
            const incomingMessage = {
                ...message,
                createdAt: new Date(message.createdAt),
            };
            this.setState(previousState => {
                previousState.messages.splice(index, 1, incomingMessage)
                return {
                    messages: GiftedChat.append(
                        previousState.messages,
                        [],
                    ),
                }
            })
        }
    }

    onDelete(message) {
        let index = this.state.messages.findIndex(item => item._id === message._id)
        if (index > -1) {
            const incomingMessage = {
                ...message,
                createdAt: new Date(message.createdAt),

            };
            this.setState(previousState => {
                previousState.messages.splice(index, 1, incomingMessage)
                return {
                    messages: GiftedChat.append(
                        previousState.messages,
                        [],
                    ),
                }
            })
        }
    }

    onLoadEarlier = () => {
        if (this.state.messages.length > 0 && !this.state.requestSent) {
            let totalNumber = 10;
            this.setState({ requestSent: true })
            this.myfireBaseRef.orderByKey().endAt(this.state.messages[this.state.messages.length - 1]._id).limitToLast(totalNumber).once('value', snapshot => {
                if (this._isMounted === true) {
                    var array = []
                    var count = 0;
                    console.log("Messages Length " + snapshot.numChildren())
                    snapshot.forEach(a => {
                        count += 1;
                        if (count < snapshot.numChildren()) {
                            const incomingMessage = {
                                ...a.val(),
                                createdAt: new Date(a.val().createdAt),
                            };
                            array.push(incomingMessage);
                        }
                    });

                    this.setState(previousState => {
                        return {
                            messages: GiftedChat.prepend(
                                previousState.messages,
                                array.reverse(),
                            ),
                            loadEarlier: snapshot.numChildren() === totalNumber,
                            isLoadingEarlier: false,
                        }
                    })
                }
                this.setState({ requestSent: false })
            })
        }
    }

    onSend = (messages = []) => {
        var sentMessage = ''
        messages.forEach(message => {
            sentMessage = message.text || ''
            let key = this.myfireBaseRef.push().key
            this.myfireBaseRef.child(key).set({
                ...message,
                createdAt: Date(),
                sent: true,
                _id: key,
                user: this.user,
            }, err => {
                console.log("error: " + err);
            })
            this.otherfireBaseRef.child(key).set({
                ...message,
                createdAt: Date(),
                sent: true,
                _id: key,
                user: this.user,
            }, err => {
                console.log("error: " + err);
            })
        });
        this.myConversationRef.set({
            id: `${this.item.id}`,
            name: `${this.item.name}`,
            message: sentMessage,
            time: Date(),
            image: `${this.item.image}`,
            token: `${this.item.token}`,
            type: this.type
        });
        this.otherConversationRef.set({
            id: `${appStateManager.user.id}`,
            name: `${appStateManager.user.name}`,
            message: sentMessage,
            time: Date(),
            image: `${appStateManager.user.image}`,
            token: `${appStateManager.user.token}`,
            type: this.type
        });
        this.sendNotificationId(sentMessage, this.item.token, this.item.id)
    };

    sendNotificationId(message, id, messageId) {
        let body = {
            "ids": [
                `${id}`
            ],
            "data": {
                "id": messageId,
                "image": appStateManager.user.image,
                "title": appStateManager.user.name,
                "body": message
            },
            "title": appStateManager.user.name,
            "subtitle": "",
            "body": message,
            "sound": "default",
            "badge": 1,
            "priority": "high"
        }
        // networkUtils.sendNotificationIds(body)
    }

    parsePatterns = linkStyle => {
        return [
            {
                pattern: /#(\w+)/,
                style: { textDecorationLine: 'underline', color: 'darkorange' },
                onPress: () => Linking.openURL('http://gifted.chat'),
            },
        ]
    }

    onReceive = data => {
        const { createdAt } = data;
        const incomingMessage = {
            ...data,
            createdAt: new Date(createdAt),
        };
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, incomingMessage),
        }));
    };

    renderCustomView(props) {
        return <CustomView {...props} />
    }

    renderAccessory = () => {
        return <AccessoryBar onSend={this.onSend} />
    }

    renderCustomActions = props => {
        return <CustomActions {...props} onSend={this.onSend} />
    }

    renderBubble = props => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    // left: {
                    //     backgroundColor: 'black',
                    //     // #f0f0f0
                    // },
                    right: {
                        backgroundColor: theme.colors.primary,
                    }
                }}
            />
        )
    }

    renderSystemMessage = props => {
        return (
            <SystemMessage
                {...props}
                containerStyle={{
                    marginBottom: 15,
                }}
                textStyle={{
                    fontSize: 14,
                }}
            />
        )
    }

    renderFooter = props => {
        if (this.state.typingText) {
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>{this.state.typingText}</Text>
                </View>
            )
        }
        return null
    }

    renderSend(props) {
        return (
            <Send {...props}>
                <View style={{ marginRight: 10, marginBottom: 5 }}>
                    <Icon.Ionicons name={'ios-send'} size={30} color={'black'} />
                </View>
            </Send>
        );
    }

    renderInputToolbar(props) {
        return <InputToolbar {...props} containerStyle={{}} />
    }

    renderComposer(props) {
        return <Composer {...props} textInputStyle={{ borderTopWidth: 1.5, borderTopColor: '#333', borderRadius: 10, marginHorizontal: 10 }} />
    }

    render() {
        return (
                <SafeAreaView style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle='light-content' />}
                    {/* <KeyboardAvoidingView behavior={'height'} style={{ flex: 1 }} keyboardVerticalOffset={30}> */}
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={this.onSend}
                            text={this.state.text}
                            loadEarlier={this.state.loadEarlier}
                            onLoadEarlier={this.onLoadEarlier}
                            isLoadingEarlier={this.state.isLoadingEarlier}
                            parsePatterns={this.parsePatterns}
                            user={this.user}
                            // renderInputToolbar={this.renderInputToolbar}
                            // keyboardShouldPersistTaps='never'
                            // renderAvatar={null}
                            // renderAccessory={this.renderAccessory}
                            // renderActions={this.renderCustomActions}
                            renderBubble={this.renderBubble}
                            renderSystemMessage={this.renderSystemMessage}
                            // renderCustomView={this.renderCustomView}
                            // renderFooter={this.renderFooter}
                            onInputTextChanged={(text) => this.setState({ text: text })}
                            // textInputProps={}
                            // renderLoading={() =>  <ActivityIndicator size="large" color="#0000ff" />}
                            // renderSend={this.renderSend}
                            // showUserAvatar={false}
                            // showAvatarForEveryMessage={false}
                            // renderAvatarOnTop={false}
                            isAnimated={true}
                            // inverted={true}
                            renderUsernameOnMessage={true}

                        />
                    {/* </KeyboardAvoidingView> */}
                </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
