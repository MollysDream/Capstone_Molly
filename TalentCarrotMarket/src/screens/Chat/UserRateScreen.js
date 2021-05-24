import React, {useState,useEffect} from 'react';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import requestUserAPI from "../../requestUserAPI";
import requestTradeAPI from "../../requestTradeAPI";

import StarRating from 'react-native-star-rating';
import AsyncStorage from '@react-native-community/async-storage';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>
let oppoUser;

const UserRateScreen = ({navigation, route}) => {

        const {user1,user2,tradeId}=route.params;
        const [userId, setUserId] =  useState('');
        const [userData, setUserData] = useState();
        // const [rating, setRating] = useState(0);


        useEffect(() => {
          async function getData(){

              let user= await AsyncStorage.getItem('user_id');
              setUserId(userId);

              console.log("현재 접속자는 "+ userId)

              if (user1 == user){
                console.log("user1이에요! "+ user1)
                console.log("user2아니에요! "+ user2)
                let userData = await requestUserAPI.getUserData(user2);
                setUserData(userData);
            } else{
              console.log("user2에요! "+ user2)
              console.log("user1이 아니에요! "+ user1)
              let userData = await requestUserAPI.getUserData(user1);
              setUserData(userData);
            }
          }

          let result = getData();
      },[]);

        //평가 취소 버튼
        const cancelButton=()=>{
            navigation.navigate('chatch')
        }

        //사용자 평가 버튼
        const rateButton = async()=>{

            const userRate = (starPriceCount+starKindCount+starSpeedCount+starRetradeCount+starQualCount)/5
            // setRating(userRate)

            console.log("평가할 점수 "+userRate);

            if(user1==userId){
              oppoUser = user2;
            } else{
              oppoUser = user1;
            }

            try{
              const returnData = await requestTradeAPI.userRate(oppoUser,userRate,tradeId);
        
              if (returnData.data.message) {
                alert('사용자 평가를 완료했습니다.')
                navigation.navigate('chatch')
              }
                else{
                  alert('사용자 평가를 실패하였습니다.')
                }
        
            } catch(err){
               console.log(err);
            }
            }
          
          //각 카테고리별 별점
          const [starPriceCount,setPriceStarCount]=useState(3);
          const [starKindCount,setKindStarCount]=useState(3);
          const [starSpeedCount,setSpeedStarCount]=useState(3);
          const [starRetradeCount,setRetradeStarCount]=useState(3);
          const [starQualCount,setQualStarCount]=useState(3);

          const onStarPriceRatingPress = (rating) =>{
            setPriceStarCount(rating);
          }

          const onStarKindRatingPress = (rating) =>{
            setKindStarCount(rating);
          }

          const onStarSpeedRatingPress = (rating) =>{
            setSpeedStarCount(rating);
          }

          const onStarRetradeRatingPress = (rating) =>{
            setRetradeStarCount(rating);
          }

          const onStarQualRatingPress = (rating) =>{
            setQualStarCount(rating);
          }



        return (
            <View style={styles.container}>
              {userData ?
                <View style={styles.rowTopArea}>
                  <View style={styles.titleArea}>   
                    <Image
                    source={{uri:userData.profileImage}}
                    style={{width: wp(15),height:hp(15), resizeMode: 'contain'}}
                    />
                  </View>
                  <Text style={{paddingRight:wp(30),fontSize:wp('5.5')}}>{userData.nickname}</Text>
                  <Text style={{fontSize:wp('5.5')}}>{userData.averageRating}</Text>
                </View>
                :
                <Text>Loading....</Text>
              }

              <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                
              }}
              />

              <View style={styles.bottomArea}>
                <View style={{paddingBottom:hp(3)}}>
                  <Text style={{paddingBottom:hp(3)}}><B>각 카테고리에 별점을 매겨주세요</B></Text>

                  <View style={styles.rowRateArea}>
                    <Text style={{paddingLeft:wp(4),paddingRight:wp(21),fontSize:wp('5.5')}}>가격</Text>
                    <StarRating 
                      disabled={false}
                      // emptyStar={'ios-star-outline'}
                      // fullStar={'ios-star'}
                      // halfStar={'ios-star-half'}
                      // iconSet={'Ionicons'}
                      maxStars={5}
                      rating={starPriceCount}
                      selectedStar={(rating)=>onStarPriceRatingPress(rating)}
                      fullStarColor={'red'}
                    />
                  </View>
                  <View style={styles.rowRateArea}>
                    <Text style={{paddingLeft:wp(4),paddingRight:wp(16),fontSize:wp('5.5')}}>친절함</Text>
                    <StarRating 
                      disabled={false}
                      maxStars={5}
                      rating={starKindCount}
                      selectedStar={(rating)=>onStarKindRatingPress(rating)}
                      fullStarColor={'red'}
                    />
                  </View>
                  <View style={styles.rowRateArea}>
                    <Text style={{paddingLeft:wp(4),paddingRight:wp(11),fontSize:wp('5.5')}}>응답속도</Text>
                    <StarRating 
                      disabled={false}
                      maxStars={5}
                      rating={starSpeedCount}
                      selectedStar={(rating)=>onStarSpeedRatingPress(rating)}
                      fullStarColor={'red'}
                    />
                  </View>
                  <View style={styles.rowRateArea}>
                    <Text style={{paddingLeft:wp(4),paddingRight:wp(4),fontSize:wp('5.5')}}>재거래 희망</Text>
                    <StarRating 
                      disabled={false}
                      maxStars={5}
                      rating={starRetradeCount}
                      selectedStar={(rating)=>onStarRetradeRatingPress(rating)}
                      fullStarColor={'red'}
                    />
                  </View>
                  <View style={styles.rowRateArea}>
                    <Text style={{paddingLeft:wp(4),paddingRight:wp(16),fontSize:wp('5.5')}}>전문성</Text>
                    <StarRating 
                      disabled={false}
                      maxStars={5}
                      rating={starQualCount}
                      selectedStar={(rating)=>onStarQualRatingPress(rating)}
                      fullStarColor={'red'}
                    />
                  </View>
                  
                </View>

                <View style={styles.rowArea}> 
                    <View style={styles.btnArea,{paddingRight: wp('1')}}>
                        <TouchableOpacity style={styles.btn} onPress={cancelButton}>
                            <Text style={{color:'white'}}>취소하기</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnArea,{paddingLeft: wp('1')}}>
                        <TouchableOpacity style={styles.btn} onPress={rateButton}>
                            <Text style={{color:'white'}}>평가하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </View>

            </View>
        );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        flex: 1,
      },
    rowTopArea: {
        flex: 0.125,
        paddingTop: hp(3),
        paddingLeft: wp(10),
        flexDirection: "row",
        alignItems: 'center',
    },
    rowRateArea:{
        flexDirection: "row",
        borderWidth: 0.5,
        borderColor: 'gray',
    },
    rowArea:{
        flexDirection: "row",
        justifyContent: 'center',
        paddingTop: hp(3)
    },
    titleArea: {
        justifyContent: 'center',
        paddingRight:wp(15),
      },
    bottomArea: {
        flex: 0.65,
        paddingTop: wp(10),
        alignItems: 'center',
    },
    btnArea: {
        height: hp(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: 150,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4672B8'
    },
  });


  export default UserRateScreen;