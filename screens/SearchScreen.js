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
    TextInput,
    View,
    KeyboardAvoidingView,
    ActivityIndicator
} from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import { Feather } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';

import { SharedElement } from 'react-navigation-shared-element';

export default class SearchScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Search',
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

    static sharedElements = (navigation, otherNavigation, showing) => {
        return [{
            id: `searchBar`,
            // animation: 'fade'
            // resize: 'clip'
            align: 'left-top'
          }];
    };

    constructor(props) {
        super(props)

        this.distance = [.5, 1, 2, 5, 10, 15, 20, 30, 50, 100, 200]
        this.subjects = ["English", "Maths", "Science", "Chemistry", "Physics", "Biology", "Economics", "Urdu", "Islamic Studies", "Pakistan Studies", "Arabic"]
        this.price = {
            minimum: 100,
            maximum: 20000,
        }

        const {params} = this.props.navigation.state

        this.state = {
            selectedSubjects: params.selectedSubjects || ["English", "Maths", "Science", "Chemistry", "Physics", "Biology", "Economics", "Urdu", "Islamic Studies", "Pakistan Studies", "Arabic"],
            selectedDistance: params.selectedDistance || 5,
            selectedPriceRange: params.selectedPriceRange || {
                minimum: 100,
                maximum: 20000,
            },
            selectedPriceMinimum: 0,
            selectedPriceMaximum: 20000,
            loading: false
        }
    }

    searchAction(){
        this.props.navigation.state.params.onGoBack(this.state.selectedSubjects, this.state.selectedDistance, this.state.selectedPriceMinimum, this.state.selectedPriceMaximum);
        this.props.navigation.goBack();
    }

    selectDistanceItem(item) {
        this.setState({
            selectedDistance: item || 5000
        })
    }

    renderDistanceItem({ item, index }) {
        var isSelected = (this.state.selectedDistance === item)

        return (
            <TouchableOpacity key={`${index}`} style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: isSelected ? 'black' : 'white', borderRadius: 4, borderWidth: 1, borderColor: isSelected ? 'black' : 'gray' }}
                onPress={() => this.selectDistanceItem(item)} activeOpacity={0.8}>
                <Text style={{ fontSize: 16, color: isSelected ? 'white' : 'gray' }} >{item} km</Text>
            </TouchableOpacity>
        );
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {Platform.OS === 'ios' && <StatusBar barStyle='light-content' />}
                <ScrollView style={{ width: Dimensions.get('window').width }} stickyHeaderIndices={[]} keyboardDismissMode={'interactive'}>

                    <View style={{ width: '100%', alignItems: 'center' }} >
                        <SharedElement id={`searchBar`}>
                            <View style={styles.searchBarStyle}>
                                <Feather name="search" size={20} color="black" />
                                <TextInput style={{ color: 'gray', fontWeight: '500', fontSize: 17, height: '100%', marginLeft: 16, marginRight: 16, flexGrow: 1 }}
                                    placeholder={'Search'}
                                    ref={textInput => this.textInput = textInput}
                                    // autoFocus={true}
                                    clearButtonMode={'while-editing'}
                                />
                            </View>
                        </SharedElement>
                    </View>
                    

                    <View style={{ marginTop: 20 }} >
                        <Text style={styles.titleStyle} >Price</Text>
                        <View style={{ alignSelf: 'flex-start', marginHorizontal: 20, flexDirection: 'row' }}  >
                            <TextInput style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 16, minWidth: 100, maxWidth: 160, borderRadius: 4, borderWidth: 1, borderColor: 'black', backgroundColor: 'white' }}
                                placeholder={'From'} keyboardType={'number-pad'} maxLength={5} defaultValue={this.state.selectedPriceMinimum} onChangeText={text => this.setState({ selectedPriceMinimum: text })} />
                            <TextInput style={{ marginHorizontal: 4, marginVertical: 10, paddingHorizontal: 10, paddingVertical: 6, fontSize: 16, minWidth: 100, maxWidth: 160, borderRadius: 4, borderWidth: 1, borderColor: 'black', backgroundColor: 'white' }}
                                placeholder={'To'} keyboardType={'number-pad'} maxLength={5} defaultValue={this.state.selectedPriceMaximum} onChangeText={text => this.setState({ selectedPriceMaximum: text })}/>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }} >
                        <Text style={styles.titleStyle} >Distance</Text>
                        <FlatList
                            contentContainerStyle={{
                                alignSelf: 'flex-start',
                                marginHorizontal: 20
                            }}
                            data={this.distance}
                            renderItem={this.renderDistanceItem.bind(this)}
                            keyExtractor={(item, index) => `${index}`}
                            // horizontal={true}
                            // ListHeaderComponent={() => <View style={{ width: 20 }} />}
                            // ListFooterComponent={() => <View style={{ width: 20 }} />}
                            showsHorizontalScrollIndicator={false}
                            numColumns={4}

                        />
                    </View>
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
                            showsHorizontalScrollIndicator={false}
                            numColumns={3}
                        />
                    </View>

                    <View style={{ width: '100%', alignItems: 'center', zIndex: 2, marginBottom: 30 }} >
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => this.searchAction()} >
                        {this.state.loading ?
                                <ActivityIndicator size="small" color="white" /> :
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Search</Text>
                        }
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </SafeAreaView>
        );
    }

    arrayLength(array) {
        if (array.length % 2 === 1) {
            return array.length + 1
        }
        return array.length
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: '#fff',
        overflow: 'visible'
    },
    searchBarStyle: {
        overflow: 'visible',
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 50,
        width: Dimensions.get('window').width * 0.88,
        borderRadius: 12,
        marginTop: 20,
        backgroundColor: 'white',
        zIndex: 2,
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 22,
            },
            android: {
                elevation: 16,
            },
        }),
    },
    buttonStyle: {
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginTop: 20,
        width: Dimensions.get('window').width * 0.7,
        borderRadius: 12,
        backgroundColor: 'black',

        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: { height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 22,
            },
            android: {
                elevation: 16,
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
});
