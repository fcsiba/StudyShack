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
import { firebaseUtils } from '../utils';
import { appStateManager } from '../singletons';

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

        const {params} = this.props.navigation.state
        

        this.state = {
            isConnected: false,
            isBooked: false,
            bookButtonTitle : "BOOK NOW"
        }
        this.id = params.id
        this.title = params.title
        this.image = params.image
        this.rating = params.rating
        this.address = params.address
        this.about = params.about
        this.subjects = params.subjects
        this.hours = params.hours
        this.rate = params.rate
        this.links = params.links

    }

    // renderSubjectItem({ item, index }) {
    //     return (
    //         <View style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'black', borderRadius: 4, borderWidth: 1, borderColor: 'black' }}>
    //             <Text style={{ fontSize: 16, color: 'white' }} >{item}</Text>
    //         </View>
    //     );
    // }

    componentDidMount(){
        this.checkBookedTeacher()
        this.checkOnlineStatus()
    }

    checkOnlineStatus(){
        firebaseUtils.FireBase.ref().child('connections/teachers').child(this.id).child("isConnected").on("value", (snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                this.setState({
                    isConnected: snapshot.val()
                })
            }
        })
    }

    checkBookedTeacher(){
        this.setState({
            bookButtonTitle: "CHECKING..."
        })
        firebaseUtils.bookingRef.child(appStateManager.user.id).child(this.id).once("value", (snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                this.setState({
                    bookButtonTitle: "BOOKED",
                    isBooked: true
                })
            }else{
                this.setState({
                    bookButtonTitle: "BOOK NOW",
                    isBooked: false
                })
            }
        })
    }

    onBookPressed(){
        if (!this.state.isBooked) {
            firebaseUtils.bookingRef.child(appStateManager.user.id).child(this.id).set(false)
            firebaseUtils.bookingRef.child(this.id).child(appStateManager.user.id).set(false)
            this.setState({
                bookButtonTitle: "BOOKED",
                isBooked: true
            })
        }
    }

    renderLinksView(facebook, linkedin) {
        return (
            <View style={{ marginTop: 20, marginBottom: 20 }} >
                <Text style={styles.titleStyle} >Links</Text>
                {facebook &&
                    <TouchableOpacity style={{ marginTop: 6, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }} onPress={() => { Linking.openURL('https://www.facebook.com/syed.m.ali.masood') }} >
                        <FontAwesome name="facebook-square" size={40} color={'black'}
                        // color="rgba(8,121,233,1.0)" 
                        />
                        <Text style={{ marginHorizontal: 16, fontSize: 16, color: 'gray' }}>{facebook}</Text>
                    </TouchableOpacity>
                }
                {linkedin &&
                    <TouchableOpacity style={{ marginTop: 6, marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', }} onPress={() => { Linking.openURL('https://www.linkedin.com/in/syed-mohammad-ali-masood/') }} >
                        <FontAwesome name="linkedin-square" size={40} color={'black'}
                        //  color="rgba(8,121,233,1.0)" 
                        />
                        <Text style={{ marginHorizontal: 16, fontSize: 16, color: 'gray' }}>{linkedin}</Text>
                    </TouchableOpacity>
                }
            </View>
        );
    }

    renderHoursView(hours) {
        if (!hours) {
            return;
        }
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >Hours</Text>
                <FlatList
                    data={hours || []}
                    renderItem={({ item, index }) => (
                        <View style={{ marginHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 8 }}>
                            <Text style={{ fontSize: 16, color: 'dimgray' }}>{item.title}</Text>
                            <Text style={{ fontSize: 16, color: 'gray', fontWeight: '500' }}>{item.value}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => `${index}`}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        );
    }

    renderSubjectsView(subjects) {
        if (!subjects) {
            return;
        }
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >Subjects</Text>
                <FlatList
                    contentContainerStyle={{
                        alignSelf: 'flex-start',
                        marginHorizontal: 20,
                    }}
                    data={subjects || []}
                    renderItem={({ item, index }) => (
                        <View style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'black', borderRadius: 4, borderWidth: 1, borderColor: 'black' }}>
                            <Text style={{ fontSize: 16, color: 'white' }} >{item}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => `${index}`}
                    showsHorizontalScrollIndicator={false}
                    numColumns={3}
                />
            </View>
        );
    }

    renderAboutView(about) {
        return (
            <View style={{ marginTop: 20 }} >
                <Text style={styles.titleStyle} >About</Text>
                <Text style={{ marginHorizontal: 24, fontSize: 16, color: 'gray' }}>{about || "Not Available"}</Text>
            </View>
        );
    }


    renderPriceView(price, period, currancy) {
        return (
            <View style={{ marginTop: 20 }}>
                <Text style={styles.titleStyle} >Price</Text>
                <View style={{ alignItems: 'center', paddingHorizontal: 20, flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' }}>
                    <Text style={{ textAlign: 'center', fontSize: 20, color: 'dimgray' }}>{`${price || 0} ${currancy || 'PKR'} | ${period || "HOURLY"}`}</Text>
                    <TouchableOpacity style={{ backgroundColor: this.state.isBooked ? 'black' : 'rgba(8,121,233,1.0)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, }} onPress={() => this.onBookPressed()} >
                        <Text style={{ textAlign: 'center', fontSize: 16, color: 'white' }}>{this.state.bookButtonTitle}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    renderConnectedView(isConnected) {
        if (!isConnected) {
            return;
        }
        return (
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <Text style={{ textAlign: 'center', fontSize: 14, color: 'green', marginTop: 20 }}>{"◕ Connected Now"}</Text>
            </View>
        );
    }

    renderNameView(title, address) {
        return (
            <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} >
                    <Text style={{ textAlign: 'center', fontSize: 28, color: 'black', fontWeight: '800', marginTop: 20 }}>{title || 'Sample User'}</Text>
                    <FontAwesome style={{ marginRight: 8, position: 'absolute', right: -30, bottom: 8 }} name="check-circle" size={20} color={'rgba(8,121,233,1.0)'} />
                </View>
                {address &&
                    <Text style={{ textAlign: 'center', fontSize: 14, color: 'gray', fontWeight: '500', marginTop: 4 }}>{address}</Text>
                }
            </View>
        );
    }

    renderProfileImage(image, rating) {
        return (
            <View style={{ paddingVertical: 10 }}>
                <View style={styles.imageView} >
                    <Image style={{ height: 124, aspectRatio: 1, borderRadius: 62 }} source={{ uri: image || 'https://unioncapitalrealty.com/wp-content/uploads/elementor/thumbs/placeholder-profile-1-ofpc8ml3479nsyn6fpfrzb1wj3gtnyj2zyjvm5aw8o.png' }} />
                </View>
                <View style={styles.ratingView} >
                    <Text style={{ fontSize: 14, color: 'black', fontWeight: '600' }} >★ {rating || 5.0}</Text>
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

                    {this.renderProfileImage(this.image, this.rating)}

                    {this.renderNameView(this.title, this.address)}

                    {this.renderConnectedView(this.state.isConnected)}

                    {this.renderPriceView(this.rate.price, this.rate.period, this.rate.currancy)}

                    {this.renderAboutView(this.about)}

                    {this.renderSubjectsView(this.subjects)}

                    {this.renderHoursView(this.hours)}

                    {this.renderLinksView(this.links.facebook, this.links.linkedin)}

                </ScrollView>
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

/*
    firebaseUtils.FireBase.ref().child("teachers").child("-LwXGQx4PFC99nT6_w8Q").set({
      title: "Ali Masood",
      image: "https://media.licdn.com/dms/image/C4D03AQGQ-u6i_uemkA/profile-displayphoto-shrink_800_800/0?e=1580947200&v=beta&t=5xg0TmTmIcV6goH0tfas3_K9kAlWi1-s5oE9qsEYSMo",
      rating: 5.0,
      latlong: {
        latitude: 24.932264,
        longitude: 67.17092
      },
      address: "IBA Karachi, University Road",
      rate: {
        currancy: "PKR",
        period: "HOURLY",
        price: "500"
      },
      subjects: ["English", "Maths", "Science", "Chemistry", "Physics"],
      about: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      links: {
        facebook: "https://www.facebook.com/syed.m.ali.masood",
        linkedin: 'https://www.linkedin.com/in/syed-mohammad-ali-masood/'
      },
      hours: [
        { title: "Monday", value: "10:30 am - 6:00 pm" },
        { title: "Tuesday", value: "10:30 am - 6:00 pm" },
        { title: "Wednesday", value: "10:30 am - 6:00 pm" },
        { title: "Thursday", value: "10:30 am - 6:00 pm" },
        { title: "Friday", value: "10:30 am - 6:00 pm" },
        { title: "Saturday", value: "10:30 am - 6:00 pm" },
        { title: "Sunday", value: "10:30 am - 6:00 pm" },
      ],
    })
*/