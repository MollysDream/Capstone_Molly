import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList,
    Button,
    RefreshControl,
    TouchableHighlight, TouchableOpacity
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import request from '../../requestAPI';
import requestUser from "../../requestUserAPI";
import AsyncStorage from '@react-native-community/async-storage';
import {getDate, getPrice} from "../../function";
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Entypo";
import Icon3 from "react-native-vector-icons/Ionicons";
import requestUserAPI from "../../requestUserAPI";

import Modal from 'react-native-modal';


export default class UserPostScreen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            search:'',
            data:[],
            page:0,
            rerender: false,
            refreshing: false,
            userId: this.props.route.params.userId,
            modalVisible: false,
            currentItem:{}
        }
    }

    async componentDidMount() {
        const postData = await request.getUserPost(this.state.userId);
        //console.log(postData);
        this.setState({
            data: this.state.data.concat(postData),
            page : this.state.page + 1
        });
    }


    async goToDetailPostScreen(item){
        console.log(`${item._id} 게시글 확인`);
        const postImages = []
        item.image.map((image)=>{
            let temp={
                image:image,
                desc:image,
            }
            postImages.push(temp);
        })

        const userData = await requestUser.getUserData(item.user_id);

        this.props.navigation.navigate('DetailPost',{detailPost: item, postImages: postImages, postOwner: userData});
    }

    goToEditPostScreen(item){
        this.toggleModal();
        const postImages = []
        item.image.map((image)=>{
            postImages.push(image);
        })

        this.props.navigation.navigate('editUserPostScreen',
            {
                detailPost: item,
                postImages: postImages,
                onGoBack: ()=>this.refreshPage()
            });

    }

    async deletePost(item){
        this.toggleModal();
        console.log(item._id);
        let result = await request.deletePost(item._id);
        let result_refresh = await this.refreshPage();
    }

    refreshPage = async() => {
        console.log('페이지 새로고침');

        this.state.page = 0;
        this.setState({page:this.state.page, refreshing: true});

        const postData = await request.getUserPost(this.state.userId);
        //console.log(postData);
        this.setState({
            data: postData,
            page : this.state.page + 1,
            rerender: !this.state.rerender,
            refreshing: false
        });

    }

    async changeTradeStatus(item, status){ //status 0:없음, 1:거래중, 2:거래완료
        this.toggleModal();

        let result = await request.updatePostTradeStatus(item._id, status);

        let result_refresh = await this.refreshPage();
    }

    toggleModal(){
        this.setState({modalVisible:!this.state.modalVisible});
    }

    async onOptionPress(item){
        this.setState({currentItem:item});
        this.toggleModal();
    }

    onChatPress(item){
        let postOwner = 'await getUserData( userId)'
        this.props.navigation.push('게시글별 채팅리스트', {postOwner,item})
        this.props.navigation.navigate('게시글별 채팅리스트');
    }


    returnFlatListItem(item,index){
        let time = getDate(item.date);
        let price = getPrice(item.price);
        let status = null
        let statusStyle = styles.status_none
        if(item.tradeStatus === 1){
            status = '거래중';
            statusStyle = styles.status_ing
        }
        else if(item.tradeStatus ===2){
            status = '거래완료';
            statusStyle = styles.status_complete
        }

        return(
            <View>
                <TouchableHighlight onPress={() => this.goToDetailPostScreen(item)}>
                    <View style={styles.post}>
                        <Image style={styles.image} source={{ uri: item.image[0]}} />
                        <View>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <View style={statusStyle}>
                                <Text>{status}</Text>
                            </View>
                            <View style={{flexDirection:'row'}}>
                                <Text style={styles.postPrice}>{`${price}원`}</Text>
                                <Text style={styles.postAddressTime}>{`${item.addressName}\n${time}`}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={styles.optionButton} onPress={()=>this.onOptionPress(item)}>
                    <Icon2 name="dots-three-vertical" size={25} color={"black"}></Icon2>
                </TouchableHighlight>
                <TouchableHighlight style={styles.chatRoomButton} onPress={()=>this.onChatPress(item)}>
                    <Icon3 name="chatbubbles-outline" size={32} color={"black"}></Icon3>
                </TouchableHighlight>

            </View>



        );
    }


    render() {
        let noData = "";
        if(this.state.data.length==0)
            noData = "이 없습니다...";
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}} >
                    <View style={styles.buttonList}>
                        <Icon style={styles.iconPlace} name="hand-holding-usd"  size={40} color="#37CEFF" />
                        <Text style={styles.buttonText}>{`재능구매 내역${noData}`}</Text>
                    </View>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item,index) => String(item._id)}
                        renderItem={({item,index})=>this.returnFlatListItem(item,index)}
                        onEndReached={this.morePage}
                        onEndReachedThreshold={1}
                        extraData={this.state.rerender}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshPage} />}
                    />
                </View>

                <Modal isVisible={this.state.modalVisible} onBackdropPress={()=>this.toggleModal()}>
                    <View style={styles.optionBox}>
                        {
                            this.state.currentItem.tradeStatus==1 || this.state.currentItem.tradeStatus==2?
                                <TouchableOpacity style={styles.buttonList} onPress={()=>this.changeTradeStatus(this.state.currentItem, 0)}>
                                    <Icon style={styles.iconPlace} name="exchange-alt"  size={40} color="#37CEFF" />
                                    <Text style={styles.buttonText}>"재능꾼 찾는중"으로 변경</Text>
                                </TouchableOpacity> : null
                        }
                        {
                            this.state.currentItem.tradeStatus==0 || this.state.currentItem.tradeStatus==2?
                                <TouchableOpacity style={styles.buttonList} onPress={()=>this.changeTradeStatus(this.state.currentItem, 1)}>
                                    <Icon style={styles.iconPlace} name="exchange-alt"  size={40} color="#37CEFF" />
                                    <Text style={styles.buttonText}>"재능 거래중"으로 변경</Text>
                                </TouchableOpacity> : null
                        }
                        {
                            this.state.currentItem.tradeStatus==0 || this.state.currentItem.tradeStatus==1?
                                <TouchableOpacity style={styles.buttonList} onPress={()=>this.changeTradeStatus(this.state.currentItem, 2)}>
                                    <Icon style={styles.iconPlace} name="exchange-alt"  size={40} color="#37CEFF" />
                                    <Text style={styles.buttonText}>"재능 거래완료"로 변경</Text>
                                </TouchableOpacity> : null
                        }

                        <TouchableOpacity style={styles.buttonList} onPress={()=>this.goToEditPostScreen(this.state.currentItem)}>
                            <Icon style={styles.iconPlace} name="edit"  size={40} color="#37CEFF" />
                            <Text style={styles.buttonText}>거래 게시글 수정</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonList} onPress={()=>this.deletePost(this.state.currentItem)}>
                            <Icon2 style={styles.iconPlace} name="cross"  size={45} color="#37CEFF" />
                            <Text style={styles.buttonText}>삭제</Text>
                        </TouchableOpacity>
                    </View>

                </Modal>


            </View>
        );
    }

    onChatRoomPress(item) {
        return undefined;
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