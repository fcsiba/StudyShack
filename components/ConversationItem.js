import React from 'react';
import { Platform, Text, Image, View, Dimensions, TouchableHighlight, TouchableOpacity, StyleSheet } from 'react-native';
import * as Icon from '@expo/vector-icons';
// import moment from "moment";

export default class ConversationItem extends React.Component {
    _onPress = () => {
        this.props.onPressItem(this.props.item.id);
    };

    // <Image style={{ height: 36, width: 36, borderRadius: 18, }} source={{ uri: navigation.getParam('image',  'https://cdn3.iconfinder.com/data/icons/social-media-chat-1/512/GroupMe-128.png') }} />
    //             <Text>{navigation.getParam('name',  '')}</Text>

    // this.props.navigation.setParams({ image: this.item.image, name: this.item.name });

    render() {
        const item = this.props.item;
        const name = item.name || '';
        const image = item.image || 'https://cdn3.iconfinder.com/data/icons/social-media-chat-1/512/GroupMe-128.png';
        const value = item.value || '';
        const time = item.time;

        return (
            <TouchableOpacity onPress={this._onPress} style={[styles.card, this.props.style]} activeOpacity={0.8}>
                <TouchableHighlight style={styles.profileImgContainer}>
                    <Image style={styles.profileImg} source={{uri: image}} />
                </TouchableHighlight>
                <View style={styles.textStyleView}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{`${name}`}</Text>
                    <Text style={{ fontSize: 15, color: '#555' }}>{`${value}`}</Text>
                </View>
                <View style={{ flex: 2, flexDirection: 'column' }}>
                    {/* <Text style={styles.unreadMessages}>{'1'}</Text> */}
                    {/* {(time !== undefined) && <TimeAgo time={time} style={styles.timeTitle} />} */}
                    {/* { (time !== undefined && time !== null && time !== '') && <Text style={styles.timeTitle}>{`${moment(time).calendar()}`}</Text>} */}
                </View>
                <Icon.Ionicons name={'ios-arrow-forward'} size={22} color={'black'} />
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'black', 
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 70,
        // borderRadius: 10,
        // paddingVertical: 8,
        // paddingHorizontal: 8,
        // ...Platform.select({
        //     ios: {
        //         shadowColor: 'black',
        //         shadowOffset: { height: 0 },
        //         shadowOpacity: 0.1,
        //         shadowRadius: 10,
        //     },
        //     android: {
        //         elevation: 3,
        //     },
        // }),
    },
    unreadMessages: {
        textAlign: 'center',
        fontSize: 13,
        backgroundColor: 'gray',
        color: '#ffffff'
    },
    timeTitle: {
        textAlign: 'center',
        fontSize: 12,
        marginRight: 16
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
});