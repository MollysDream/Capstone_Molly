import React, {useState,useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from "axios";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('4.5%')}}>{props.children}</Text>

const P0 = {latitude: 37.564362, longitude: 126.977011};

const AroundCertifyScreen = ({navigation,route}) => {

    const {chosenAddress}=route.params;

    const [certify, setCertify] = useState(false);
    const [location,setLocation]= useState({
        location:[
          {latitude:null,longitude:null}
        ]
      });

    const [address,setAddress]= useState(chosenAddress);
    const [currentLocation, setCurrentLocation]= useState('');

    useEffect(() =>{
        Geolocation.getCurrentPosition(
        position =>{
            const {latitude,longitude}=position.coords;
            setLocation({
              latitude,
              longitude
            });
            const send_param = {
              currentX: longitude,
              currentY: latitude
            }
            axios
            .post("http://10.0.2.2:3000/address/currentLocation", send_param)
              //정상 수행
              .then(returnData => {
                setCurrentLocation(returnData.data.address)
              })
              //에러
              .catch(err => {
                console.log(err);
              });
          },
          error => {console.log(error.code,error.message)},
          { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
      },[]);
    

    //현재 위치로 동네 변경
    const changeAroundButton = () =>{
        setAddress(currentLocation)
    }

    //동네 인증
    const certifyAroundButton = () =>{

      AsyncStorage.getItem('user_id')
      .then((value) => {
        console.log('name is ', value);

        const send_param = {
          email:value,
          address: address
        };

        axios
        .post("http://10.0.2.2:3000/address/certifyAddress", send_param)
          //정상 수행
          .then(returnData => {
            if (returnData.data.message) {
              setCertify(true);
            } else {
              setCertify(false);
            }
          })
          //에러
          .catch(err => {
            console.log(err);
          });
        });


    }

    //동네 인증 완료
    if (certify) {
      return (
        <View style={styles.container}>
          <View style={{flex: 1}} />
          <View style={{flex: 2}}>
            <View
              style={{
                height: hp(13),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../check.png')}
                style={{
                  height: wp(20),
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </View>
            <View
              style={{
                height: hp(5),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'black', fontSize: wp('4%')}}>
                동네 인증이 완료되었습니다.
              </Text>
            </View>

            <View style={{height: hp(30), justifyContent: 'center'}}>
              <View style={styles.btnArea}>
                <TouchableOpacity
                  style={styles.btn}
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate('home')}>
                  <Text style={{color: 'white', fontSize: wp('4%')}}>
                    주변 동네 게시글 확인하기
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    }

    return (
        <View style={styles.container}>
              <NaverMapView style={{flex: 0.5, width: '100%', height: '100%'}}
              showsMyLocationButton={true}
              center={{...location, zoom:16}}
              // onTouch={e => console.warn('onTouch', JSON.stringify(e.nativeEvent))}
              // onCameraChange={e => console.warn('onCameraChange', JSON.stringify(e))}
              // onMapClick={e => console.warn('onMapClick', JSON.stringify(e))}
              >
              </NaverMapView>

            {address != currentLocation ? (
            <View>
              <View style={styles.errText}>
                <Text style={{color:'white',fontWeight: 'bold'}}>잠깐만요! 현재 위치가 {currentLocation} 이에요!</Text>
              </View>
              <Text style={styles.textValidation}> 현재 내 동네로 설정되어 있는 <B>{address}</B>에서만 {"\n"} 동네인증을 할 수 있어요.</Text>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnAround} onPress={changeAroundButton}>
                  <Text style={(styles.Text, {color: 'black'})}>현재 위치로 동네 변경하기</Text>
                </TouchableOpacity>
              </View>
            </View>
            ) : 
            <View>
              <Text style={styles.textValidation}>현재 위치가 내 동네로 설정한 <B>{address}</B>에 있습니다.</Text>
              <View style={styles.btnArea}>
                <TouchableOpacity style={styles.btnAroundChoose} onPress={certifyAroundButton}>
                  <Text style={(styles.Text, {color: 'white'})}>동네 인증 완료하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          
              }

        </View>    
    );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1, //전체의 공간을 차지한다는 의미
      flexDirection: 'column',
      backgroundColor: 'white',
      paddingLeft: wp(7),
      paddingRight: wp(7),
    },
    btnArea:{
      flex:0.12,
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnCertify: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      flexDirection: "row",
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    btnAroundChoose: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
      flexDirection: "row",
      justifyContent: 'center',
    },
    Text: {
      fontSize: wp('4%'),
    },
    textValidation: {
      fontSize: wp('4%'),
      paddingTop: wp(2),
      paddingBottom : wp(3)
    },
    errText:{
      backgroundColor:'red',
      justifyContent: 'center',
      alignItems: 'center'
    },
    btn: {
      flex: 1,
      width: '100%',
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    }
  });

export default AroundCertifyScreen;