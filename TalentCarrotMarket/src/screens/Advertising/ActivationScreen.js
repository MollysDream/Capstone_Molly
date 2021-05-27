import React, {Component, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    Button,
    RefreshControl,
    TouchableHighlight, Alert
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {SearchBar} from 'react-native-elements';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import requestAdverAPI from "../../requestAdverAPI";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Ionicons";
import Modal from 'react-native-modal';

let userId;

export default class Actiation extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            modalVisible: false,
            currentItem:{}
        }
    }


    async componentDidMount() {
        userId = await AsyncStorage.getItem('user_id');
        console.log(userId);
        const adverData = await requestAdverAPI.getMyAdver(userId);
        this.setState({
            data: this.state.data.concat(adverData),
            page : this.state.page+1
        });
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const adverData = await requestAdverAPI.getMyAdver(userId);
        //console.log(postData);
        this.setState({
            data: adverData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });

    }

    goToEditAdverScreen(item){
        this.toggleModal();
        const adverImages = []
        item.image.map((image)=>{
            adverImages.push(image);
        })

        this.props.navigation.navigate('editUserPostScreen',
            {
                detailAdver: item,
                adverImages: adverImages,
                onGoBack: ()=>this.refreshPage()
            });

    }

    toggleModal(){
        this.setState({modalVisible:!this.state.modalVisible});
    }

    async onOption(item){
        this.setState({currentItem:item});
        this.toggleModal();
    }

    returnFlatListItem(item,index){
        let status = null
        let statusStyle = styles.status_none

        return(
            <View>
                {
                    item.active == true?
                <View>
                <TouchableHighlight >
                    <View style={styles.post}>
                        <Image style={styles.image} source={{ uri: item.image[0]}} />
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <View style={statusStyle}>
                                <Text>{status}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postPrice}>{`${item.price}원`}</Text>
                                <Text style={styles.postAddressTime}>{`${item.addressName}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.optionButton} onPress={()=>this.onOption(item)}>
                    <Icon2 name="dots-three-vertical" size={25} color={"black"}></Icon2>
                </TouchableHighlight>
                </View>:null
                }
            </View>
        );
    }


    render() {
    return(
        <View>
             <FlatList
                        data={this.state.data}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                        onEndReached={this.morePage}
                        onEndReachedThreshold={1}
                        extraData={this.state.rerender}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                    />
                   <Modal isVisible={this.state.modalVisible} onBackdropPress={()=>this.toggleModal()}>
                    <View style={styles.optionBox}>

                        <TouchableOpacity style={styles.buttonList}  onPress={()=>this.goToEditAdverScreen(this.state.currentItem)}>
                            <Icon style={styles.iconPlace} name="edit"  size={40} color="#37CEFF" />
                            <Text style={styles.buttonText}>광고 수정</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonList} onPress={()=>this.deleteAdver(this.state.currentItem)}>
                            <Icon2 style={styles.iconPlace} name="cross"  size={45} color="#37CEFF" />
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>

            </View>
      
    )
    }
}


const styles = StyleSheet.create({
    image:{
        width: wp(28),
        overflow:"hidden",
        height: hp(28),
        aspectRatio: 1,
        borderRadius: 9,
        marginRight:12
    },
    post:{
        flexDirection: "row",
        borderRadius: 15,
        backgroundColor: "white",
        borderBottomColor: "#a6e5ff",
        borderBottomWidth: 1,
        padding: 10,
        height: 136
    },
    cover:{
        flex: 1,
        width: 200,
        height:200,
        resizeMode: "contain"
    },
    postDetail:{
        flex:3,
        alignItems :"flex-start",
        flexDirection : "column",
        alignSelf : "center",
        padding:20
    },
    postTitle:{fontSize:18, fontWeight: "bold", width:200, height:80, paddingTop:9},
    postAddressTime: {fontSize:13, textAlign:'right', width:'30%', marginRight:10},
    postPrice: {width:'50%',fontSize:17 , color:"#0088ff" ,paddingTop: 9}
,
    buttonList: {
        //borderWidth:1,
        height:55,
        flexDirection:'row',
        backgroundColor: '#ecfeff',
        borderRadius: 20,
        marginBottom:7,

    },
    iconPlace: {
        height:'100%',
        marginLeft:10,
        paddingTop: 5

    },
    buttonText:{
        fontSize: 20,
        color:'black',
        height:'100%',
        paddingTop:13,
        //borderWidth:1,
        marginLeft: 13
    },
    optionButton: {
        position: 'absolute',
        top: 19,
        right: 15,
    },
    chatRoomButton: {
        position: 'absolute',
        top: 15,
        right: 48,
    },
    optionBox: {
        //borderWidth: 1,
        flexDirection:'column',
        marginTop:7

    },
    status_ing:{
        backgroundColor:'#b4e6ff',
        position: 'absolute',
        top: 40,
        padding: 3,
        borderRadius: 7
    },
    status_complete:{
        backgroundColor:'#98afbf',
        position: 'absolute',
        top: 40,
        padding: 3,
        borderRadius: 7
    },
    status_none:{
        position: 'absolute'
    },

});