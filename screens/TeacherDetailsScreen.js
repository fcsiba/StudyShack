import React from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Platform,
    Image,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Text,
    View,
    Linking,
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { FontAwesome } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser';

export default class TeacherDetailsScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Details',
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
        super(props)

        this.state = {
            selectedDayIndex: 0,
        }

        this.subjects = ["English", "Maths", "Science", "Chemistry", "Physics"]
        this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        this.hours = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8", "8-9", "9-10", "10-11", "11-12", "12-13", "13-14", "14-15", "15-16", "16-17", "17-18", "18-19", "19-20", "20-21", "21-22", "22-23", "23-0"]
        // this.availableHours = {
        //     Monday: ["16-17", "17-18", "18-19", "9-10", "10-11"],
        //     Tuesday: ["8-9", "9-10", "10-11"],
        //     Wednesday: ["8-9", "9-10", "10-11"],
        //     Thursday: ["8-9", "9-10", "10-11"],
        //     Friday: ["8-9", "9-10", "10-11", "11-12", "12-1", "3-4", "4-5"],
        //     Saturday: ["8-9", "9-10", "10-11"],
        //     Sunday: ["8-9", "9-10", "10-11"],
        // }
        this.availableHours = [
            { key: "Monday", value: "10:30 am - 6:00 pm" },
            { key: "Tuesday", value: "10:30 am - 6:00 pm" },
            { key: "Wednesday", value: "10:30 am - 6:00 pm" },
            { key: "Thursday", value: "10:30 am - 6:00 pm" },
            { key: "Friday", value: "10:30 am - 6:00 pm" },
            { key: "Saturday", value: "10:30 am - 6:00 pm" },
            { key: "Sunday", value: "10:30 am - 6:00 pm" },
        ]

        this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(this)
        this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
    }

    handleViewableItemsChanged(info) {
        console.log("handleViewableItemsChanged");
        console.log(info && info.viewableItems && info.viewableItems[0] && info.viewableItems[0].index)
        let index = info && info.viewableItems && info.viewableItems[0] && info.viewableItems[0].index
        if (index !== undefined) {
            this.dayslist.scrollToIndex({ animated: true, index: index, viewPosition: 0 })
            this.setState({ selectedDayIndex: index })
        }
    }

    renderSubjectItem({ item, index }) {
        return (
            <View style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'black', borderRadius: 4, borderWidth: 1, borderColor: 'black' }}>
                <Text style={{ fontSize: 16, color: 'white' }} >{item}</Text>
            </View>
        );
    }

    renderDaysItem({ item, index }) {
        var isSelected = (index === this.state.selectedDayIndex)
        return (
            <Text style={{ marginLeft: 10, fontSize: 20, fontWeight: '300', color: isSelected ? 'black' : 'lightgray' }} onPress={() => {
                this.hourslist.scrollToIndex({ animated: true, index: index, viewPosition: 0 })
                this.setState({ selectedDayIndex: index })
            }} >{item.toUpperCase()}</Text>
        );
    }

    renderHoursItem(item, index, parentIndex) {
        var isSelected = (this.availableHours[this.days[parentIndex]].indexOf(item) > -1)
        return (
            <View style={{ marginHorizontal: 4, marginVertical: 6, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isSelected ? 'black' : 'white', borderRadius: 4, borderWidth: 1, borderColor: 'black' }}>
                <Text style={{ fontSize: 14, color: isSelected ? 'white' : 'black' }} >{this.getHoursString(item)}</Text>
            </View>
        );
    }

    getHoursString(value) {
        var string = ''
        var subString = String(value).split('-')
        if (subString.length > 1) {
            var format1 = (parseInt(subString[0]) < 12) ? 'am' : 'pm'
            var format2 = (parseInt(subString[1]) < 12) ? 'am' : 'pm'
            var date1 = parseInt(subString[0]) % 12
            var date2 = parseInt(subString[1]) % 12

            date1 = (date1 === 0) ? 12 : date1
            date2 = (date2 === 0) ? 12 : date2
            // var date1 = (parseInt(subString[0]) === 12) ? '12' : subString[0]
            // var date2 = (parseInt(subString[1]) === 12) ? '12' : subString[1]
            return `${date1}:00 ${format1} \n${date2}:00 ${format2}`
        }
        return '';
    }

    renderTimesItem({ item, index }) {
        var isSelected = (index === this.state.selectedDayIndex)
        return (
            <View style={{ width: Dimensions.get('window').width, marginVertical: 0 }}>
                <FlatList
                    contentContainerStyle={{
                        // alignSelf: 'flex-start',
                        marginHorizontal: 20,
                    }}
                    data={this.hours}
                    renderItem={({ item, itemIndex }) => this.renderHoursItem.bind(this)(item, itemIndex, index)}
                    keyExtractor={(item, index) => `${index}`}
                    // horizontal={true}
                    // ListHeaderComponent={() => <View style={{ width: 20 }} />}
                    // ListFooterComponent={() => <View style={{ width: 20 }} />}
                    showsHorizontalScrollIndicator={false}
                    numColumns={4}
                    alwaysBounceVertical={false}
                />
            </View>
        );
    }


    renderProfileImage() {
        return (
            <View style={{ paddingVertical: 10 }}>
                <View style={styles.imageView} >
                    <Image style={{ height: 124, aspectRatio: 1, borderRadius: 62 }} source={{ uri: 'https://media.licdn.com/dms/image/C4D03AQGQ-u6i_uemkA/profile-displayphoto-shrink_800_800/0?e=1580947200&v=beta&t=5xg0TmTmIcV6goH0tfas3_K9kAlWi1-s5oE9qsEYSMo' }} />
                </View>
                <View style={styles.ratingView} >
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '600' }} >★ 4.5</Text>
                </View>
            </View>
        );
    }

    renderSubjectsView() {
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >Subjects</Text>
                <FlatList
                    contentContainerStyle={{
                        alignSelf: 'flex-start',
                        marginHorizontal: 20,
                    }}
                    data={this.subjects}
                    renderItem={this.renderSubjectItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    // horizontal={true}
                    // ListHeaderComponent={() => <View style={{ width: 20 }} />}
                    // ListFooterComponent={() => <View style={{ width: 20 }} />}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                />
            </View>
        );
    }

    renderAvailableHoursView() {
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >Available Hours</Text>
                <FlatList
                    ref={dayslist => { this.dayslist = dayslist }}
                    contentContainerStyle={{
                        alignSelf: 'flex-start',
                        marginTop: 16,
                    }}
                    data={this.days}
                    renderItem={this.renderDaysItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    horizontal={true}
                    snapToAlignment={true}
                    showsHorizontalScrollIndicator={false}
                    // scrollEnabled={false}
                    ListHeaderComponent={() => <View style={{ width: 10 }} />}
                    ListFooterComponent={() => <View style={{ width: 20 }} />}
                />

                <FlatList
                    ref={hourslist => { this.hourslist = hourslist }}
                    contentContainerStyle={{
                        // alignSelf: 'flex-start',
                        marginTop: 8,
                        marginBottom: 20
                    }}
                    data={this.days}
                    renderItem={this.renderTimesItem.bind(this)}
                    keyExtractor={(item, index) => `${index}`}
                    horizontal={true}
                    pagingEnabled={true}
                    snapToAlignment={'center'}
                    decelerationRate={"fast"}
                    snapToInterval={Dimensions.get('window').width}
                    showsHorizontalScrollIndicator={false}
                    onViewableItemsChanged={this.handleViewableItemsChanged}
                    viewabilityConfig={this.viewabilityConfig}
                // ListHeaderComponent={() => <View style={{ width: 10 }} />}
                // ListFooterComponent={() => <View style={{ width: 20 }} />}
                />
            </View>
        );
    }

    renderLinksView() {
        return (
            <View style={{ marginTop: 20, marginBottom: 20 }} >
                <Text style={styles.titleStyle} >Links</Text>
                <TouchableOpacity style={{ marginTop: 6, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }} onPress={() => { Linking.openURL('https://www.facebook.com/syed.m.ali.masood') }} >
                    <FontAwesome name="facebook-square" size={40} color={'black'}
                    // color="rgba(8,121,233,1.0)" 
                    />
                    <Text style={{ marginHorizontal: 16, fontSize: 16, color: 'gray' }}>https://www.facebook.com/syed.m.ali.masood</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginTop: 6, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }} onPress={() => { Linking.openURL('https://www.linkedin.com/in/syed-mohammad-ali-masood/') }} >
                    <FontAwesome name="linkedin-square" size={40} color={'black'}
                    //  color="rgba(8,121,233,1.0)" 
                    />
                    <Text style={{ marginHorizontal: 16, fontSize: 16, color: 'gray' }}>https://www.linkedin.com/in/syed-mohammad-ali-masood/</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderAboutView() {
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >About</Text>
                <Text style={{ marginHorizontal: 24, fontSize: 16, color: 'gray' }}>{"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."}</Text>
            </View>
        );
    }

    renderHoursView() {
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >Hours</Text>
                <FlatList
                    contentContainerStyle={{
                        // alignSelf: 'flex-start',
                        // marginHorizontal: 20,
                    }}
                    data={this.availableHours}
                    renderItem={({ item, index }) => (
                        <View style={{ marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ fontSize: 16, color: 'dimgray' }}>{item.key}</Text>
                            <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>{item.value}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => `${index}`}
                    // horizontal={true}
                    // ListHeaderComponent={() => <View style={{ width: 20 }} />}
                    // ListFooterComponent={() => <View style={{ width: 20 }} />}
                    showsHorizontalScrollIndicator={false}
                // numColumns={3}
                />
            </View>
        );
    }

    renderNameView() {
        return (
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} >
                    <Text style={{ textAlign: 'center', fontSize: 28, color: 'black', fontWeight: '800', marginTop: 20 }}>{"Ali Masood"}</Text>
                    <FontAwesome style={{ marginRight: 8, position: 'absolute', right: -30, bottom: 8 }} name="check-circle" size={20} color={'rgba(8,121,233,1.0)'} />
                </View>
                <Text style={{ textAlign: 'center', fontSize: 14, color: 'gray', fontWeight: '500', marginTop: 4 }}>{"IBA Karachi, University Road"}</Text>
            </View>
        );
    }

    renderConnectedView() {
        return (
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ textAlign: 'center', fontSize: 14, color: 'green', marginTop: 20 }}>{"◕ Connected Now"}</Text>
            </View>
        );
    }

    renderPriceView() {
        return (
            <View style={{ marginTop: 20 }}>
                <Text style={styles.titleStyle} >Price</Text>
                <View style={{ alignItems: 'center', paddingHorizontal: 20, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: 'dimgray' }}>{"23 PKR | HOURLY"}</Text>
                    <TouchableOpacity style={{backgroundColor: 'black', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, }} >
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>{"BOOK NOW"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container} >
                {Platform.OS === 'ios' && <StatusBar barStyle='light-content' />}
                <ScrollView  >
                    <View style={{ height: 10 }}></View>

                    {this.renderProfileImage()}

                    {this.renderNameView()}

                    {this.renderConnectedView()}

                    {this.renderPriceView()}

                    {this.renderAboutView()}

                    {this.renderSubjectsView()}

                    {this.renderHoursView()}

                    {this.renderLinksView()}

                    {/* {this.renderAvailableHoursView()} */}

                </ScrollView>
                {/* <SafeAreaView style={styles.bottomView} >
                    <View style={{ height: 80 }} >

                    </View>
                </SafeAreaView> */}
            </View>
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingTop: 15,
        backgroundColor: '#fff',
    },
    imageView: {
        overflow: 'visible',
        height: 130,
        aspectRatio: 1,
        borderRadius: 65,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // alignContent: 'center',
        // zIndex: 8,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 22,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    ratingView: {
        zIndex: 15,
        position: 'absolute',
        alignSelf: 'center',
        bottom: 5,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'white',
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    titleStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: 'black',
        marginVertical: 8,
        marginHorizontal: 20
    },
    bottomView: {
        backgroundColor: 'white',
        // position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
            },
            android: {
                elevation: 5,
            },
        }),
    },
});
