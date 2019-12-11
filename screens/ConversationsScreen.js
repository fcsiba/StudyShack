import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Platform,
    FlatList,
    SectionList,
    StatusBar,
    SafeAreaView,
    TouchableOpacity,
    Text,
    View
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import Colors from '../constants/Colors';
import { firebaseUtils } from '../utils'
import { appStateManager } from '../singletons'
import ConversationItem from '../components/ConversationItem';

export default class ConversationsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Conversations',
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

    constructor(props) {
        super(props);

        this.state = {
            items: [
            {
                title: 'Recent Chats',
                data: []
            },
            ],
            headerItems: [],
            isRefreshing: false,
        };
    }

    componentDidMount() {
        this.handleRefresh()
        this.observeConnectedUsers()
        this.getChatHeads()
    }

    handleRefresh = () => {
        // this.setState({
        //     isRefreshing: true,
        // }, () => {

        // });
    };

    handleLoadMore = () => {
        console.log("reloading data ")
    };

    observeConnectedUsers() {
        firebaseUtils.FireBase.ref(`users/connections`).orderByChild('isConnected').limitToLast(50).on('value', snapshot => {
            var array = []
            snapshot.forEach(a => {
                if (a.val().id !== appStateManager.user.id) {
                    array.push(a.val())
                }
            })
            array.reverse()
            this.setState({ headerItems: array })
        })
    }

    getChatHeads = async () => {
        firebaseUtils.FireBase.ref(`Users/${appStateManager.user.id}/ChatHeads`).on('value', snapshot => {
            var array = []
            snapshot.forEach(a => {
                const incomingMessage = {
                    ...a.val(),
                };
                array.push(incomingMessage);
            });
            this.state.items[0].data = array
            this.setState({ items: this.state.items })
        })
    }

    _keyExtractor = (item, index) => `${index}`;

    _onPress = (item, index, section) => {
        
        if (section.title === 'Individual Chats') {
            const { navigate } = this.props.navigation;
            navigate('Conversation', { item: item, type: 'individual' });
        }
    }

    _onHeaderItemPress = (item, index) => {
        let ind = this.state.items[0].data.findIndex(value => value.id.includes(item.id))
        if (ind > -1) {
            let titem = this.state.items[0].data[ind]
            const { navigate } = this.props.navigation;
            navigate('Conversation', { item: titem, type: 'individual' });
            return;
        }
        let mitem = {
            id: item.id,
            name: item.name,
            message: '',
            time: '',
            image: item.image
        }
        const { navigate } = this.props.navigation;
        navigate('Conversation', { item: mitem, type: 'new' });
    }

    _renderHeaderItem = ({ item, index }) => {
        var isConnected = item.isConnected || false
        return (
            <TouchableOpacity onPress={() => this._onHeaderItemPress.bind(this)(item, index)}
                activeOpacity={0.8} style={{ marginStart: 8, marginVertical: 8, width: 80, alignItems: 'center' }}>
                <View style={{ height: 60, width: 60, borderRadius: 30 }}>
                    <Image style={{ height: 60, width: 60, borderRadius: 30, borderWidth: 1, borderColor: 'lightgray' }}  source={{uri: item.image }} />
                    {isConnected && <View style={{ height: 16, width: 16, borderRadius: 8, backgroundColor: 'white', position: 'absolute', bottom: 2, right: 2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'green' }}>
                        <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: 'green' }}></View>
                    </View>}
                </View>
                <Text style={[{ fontSize: 12, textAlign: 'center', paddingTop: 2, }]} numberOfLines={1}>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    _renderItem = ({ item, index, section }) => {
        return (
            // <View style={{ paddingVertical: 0, paddingHorizontal: 0, backgroundColor: 'transparent', flex: 1 }}>
            <ConversationItem
                style={{ borderRadius: 10, marginHorizontal: 8, marginVertical: 2, }}
                onPressItem={() => this._onPress(item, index, section)}
                item={item}
            />
            // </View>
        );
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#CED0CE",
                    //   marginLeft: "14%"
                }}
            />
        );
    };

    renderListHeader = () => {
        return (
            <View style={{ backgroundColor: 'white', borderRadius: 10, marginHorizontal: 8, marginTop: 12, marginBottom: 4 }}>
                <FlatList
                    data={this.state.headerItems}
                    renderItem={this._renderHeaderItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                />
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle='light-content' />}
                <SectionList
                    sections={this.state.items}
                    renderItem={this._renderItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleRefresh}
                    // onEndReached={this.handleLoadMore}
                    // onEndThreshold={0}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={{ backgroundColor: 'black', borderRadius: 6, marginHorizontal: 8, marginVertical: 2, padding: 8 }}>
                            <Text style={{ fontWeight: '400', color: 'white', fontSize: 14 }}>{title}</Text>
                        </View>
                    )}
                    ListHeaderComponent={this.renderListHeader.bind(this)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    backgroundImage: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: Dimensions.get('screen').height
    },
    cardUpperView: {
        // flex: 4,
        // alignItems: 'center',
        paddingHorizontal: 20,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 70,
        // borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 8,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    innerView: {
        paddingTop: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        flex: 1,
    },
    unreadMessages: {
        textAlign: 'center',
        fontSize: 13,
        backgroundColor: 'black',
        color: '#ffffff'
    },
    timeTitle: {
        textAlign: 'center',
        fontSize: 12,
    },
    profileImgContainer: {
        // marginLeft: 8,
        height: 50,
        width: 50,
        borderRadius: 25,
        // backgroundColor: 'black'
    },
    profileImg: {
        height: 49,
        width: 49,
        borderRadius: 24.5,
    },
    textStyleView: {
        flex: 6,
        flexDirection: 'column',
        marginLeft: 8,
        justifyContent: 'space-between',
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        display: 'flex',
        backgroundColor: '#fff',
        borderRadius: 3,
        // height: this.height,
        marginHorizontal: 5,
        marginTop: 3,
        marginBottom: 2,
    },
    inputText: {
        // display: 'flex',
        marginLeft: 25,
        fontSize: 15,
        height: 60,
        width: '100%',
        color: '#999',
    },
    searchIcon: {
        // position: 'absolute',
        left: 12,
        // top: 12,
    },
});
