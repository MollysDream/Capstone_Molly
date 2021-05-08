import React, {useState,useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity, Button,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import Postcode from '@actbase/react-daum-postcode';
import axios from "axios";
//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundAddScreen = () => {

    const [location,setLocation]= useState({
        locations:[
          {latitude:null,longitude:null}
        ]
      });


    const [aroundAddress,setAroundAddress]= useState('');

    const [chosenAddress, setChosenAddress] = useState('ㅁ');

    const addAddressButton = () =>{
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
                        console.log(returnData.data);
                        setChosenAddress(returnData.data.address)
                    })
                    //에러
                    .catch(err => {
                        console.log(err);
                    });
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
    }

    return (
        <View style={styles.container}>
            {
                chosenAddress == ''? null:
                    <Button title={chosenAddress} onPress={()=>console.log(`${chosenAddress} 선택완료`)}/>
            }
          <View style={styles.btnArea}>
            <TouchableOpacity style={styles.btnAround} onPress={addAddressButton}>
              <Text style={(styles.Text, {color: 'white'})}>현재 위치로 찾기</Text>
              {aroundAddress != '' ? (
              <Text style={styles.TextValidation}> {aroundAddress}</Text>
              ) : null}
            </TouchableOpacity>
          </View>
            <Postcode
                style={{ flex:1 }}
                jsOptions={{ animated: true }}
                onSelected={data => console.log(data.bname)}
            />
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
    btnArea: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingTop: hp(1.5),
      paddingBottom: hp(9),
      flexDirection: "row",
      // justifyContent: 'center',
    },
    btnAround: {
      flex: 1,
      width: 150,
      height: 50,
      borderRadius: 7,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4672B8',
    },
    Text: {
      fontSize: wp('4%'),
    },
    TextValidation: {
      fontSize: wp('4%'),
      color: 'red',
      paddingTop: wp(2),
    },
  
  });

export default AroundAddScreen;