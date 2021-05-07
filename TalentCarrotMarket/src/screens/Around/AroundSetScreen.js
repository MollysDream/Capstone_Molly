import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';

import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import SwitchSelector from "react-native-switch-selector";
import axios from 'axios';

import NaverMapView, {Circle, Marker, Path, Polyline, Polygon, Align} from "react-native-nmap";
import Geolocation from 'react-native-geolocation-service';

const P0 = {latitude: 37.564362, longitude: 126.977011};
const haversine = require('haversine');


//글자 강조
const B = (props) => <Text style={{fontWeight: 'bold', fontSize:wp('5.5%')}}>{props.children}</Text>

const AroundSetScreen = ({navigation}) => {

    //현재 위치값 저장
    const [location,setLocation]= useState({
        locations:[
            {latitude:null,longitude:null}
        ]
    });

    //반경 저장
    const [distance, setDistance] = useState(0)
    const [strDistance, setStrDistance] = useState('');

    // 실제 안드로이드 폰에서 되는지 확인 필요
    useEffect(() =>{
        Geolocation.getCurrentPosition(
            position =>{
                const {latitude,longitude}=position.coords;
                setLocation({
                    latitude,
                    longitude
                });
            },
            error => {console.log(error.code,error.message)},
            { enableHighAccuracy:true, timeout: 20000, maximumAge:1000},
        );
    },[]);

    const setMapRadius= (endLocation)=>{
        //console.log(location);
        //console.log('onMapClick', JSON.stringify(endLocation))
        const start = {
            latitude: location.latitude,
            longitude: location.longitude
        }
        const end ={
            latitude: endLocation.latitude,
            longitude: endLocation.longitude
        }
        console.log(Math.floor(haversine(start,end ,{unit:'meter'})))
        setDistance(Math.floor(haversine(start,end ,{unit:'meter'})));
    }

    //근처 동네 갯수 설정
    const saveSwitchRadius = (value) => {
        console.log(`${value}m의 재능 구매 게시글 찾기`)

        //스위치에서 지정값 선택했는지, 커스텀 값 선택했는지 Flag 지정
        if(value == 500 || value == 1000 || value == 2000){
            console.log('지정된 값');
            setCustomFlag(0);
        }else{
            console.log('커스텀 값')
            setCustomFlag(1);
        }

        if(value >= 1000) {
            setRadius(`${(value / 1000).toFixed(1)}km`);
            setDistance(value);
        }
        else {
            setRadius(`${value}m`);
            setDistance(value);
        }
    }

    useEffect(()=>{

        if(distance >= 1000)
            setStrDistance(`${(distance/1000).toFixed(1)}km`);
        else
            setStrDistance(`${distance}m`);

        //커스텀 값일 경우
        if(customFlag)
            if(distance >= 1000) {
                setRadius(`${(distance / 1000).toFixed(1)}km`);
            }
            else {
                setRadius(`${distance}m`);
            }

        //console.log(`설정한 반경: ${Radius}`);
    })

    const options = [
      {label:"500m", value: 500},
      {label:"1km", value: 1000},
      {label:"2km", value: 2000},
        {label:strDistance, value:distance}
    ];

    const [address1,setAddress1]= useState('우만2동');
    const [address2,setAddress2]= useState('');

    const [Radius,setRadius]= useState(0);
    const [customFlag, setCustomFlag]= useState(0);

    const [chooseState1,setChooseState1] = useState('choose');
    const [chooseState2,setChooseState2] = useState('');


    //설정된 동네 삭제
    const addressOneDeleteButton = () => {
      setAddress1('');
    };

    const addressTwoDeleteButton = () => {
      setAddress2('');   
    };

    //내 동네 설정 추가
    const addressOneAddButton = () => {
      navigation.navigate('aroundAdd')
    };

    const addressTwoAddButton = () => {
      navigation.navigate('addressAdd')      
    };

    //동네 선택
    const chooseAddressOneButton = (value) => {
      setChooseState1('choose')
      setChooseState2('')
      navigation.navigate('aroundCertify',{
        chosenAddress:address1
      })
    }

    const chooseAddressTwoButton = (value) => {
      setChooseState1('')
      setChooseState2('choose')
      navigation.navigate('aroundCertify',{
        chosenAddress:address2
      })
    }


    return (
        <View style={styles.container}>
            <View style={styles.topArea}>
                <Text style={{paddingBottom:10,paddingTop:10}}><B>동네 선택</B></Text>
                <Text style={{paddingBottom:25}}>지역은 최소 1개 이상 최대 2개까지 설정 가능해요.</Text>
            </View>

            <View style={styles.btnArea}>
              {address1 !=''?(
                    <View style={styles.btnArea2}>
                      {chooseState1 !=''?(
                      <TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAroundChoose}>
                        <Text style={(styles.Text, {color: 'white'})}>{address1}</Text>
                      
                        <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                          <Text style={{paddingLeft:20}}>❌</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>

                      ):<TouchableOpacity onPress={chooseAddressOneButton} style={styles.btnAround}>
                      <Text style={(styles.Text, {color: 'black'})}>{address1}</Text>
                    
                      <TouchableOpacity onPress={addressOneDeleteButton} style={styles.btn}>
                        <Text style={{paddingLeft:20}}>❌</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                      }
                    </View>
                    
                  ):
                  <View style={styles.btnArea2}>
                    <TouchableOpacity style={styles.btnNoAround} onPress={addressOneAddButton}>
                          <Text style={{
                            color: 'gray',
                            textAlign: 'center',
                            marginBottom: 6,
                            fontSize: 15,
                          }}>➕</Text>
                      </TouchableOpacity>
                    </View>}

              {address2 !=''?(
                
                  <View style={styles.btnArea2}>
                  {chooseState2 !=''?(
                  <TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAroundChoose}>
                    <Text style={(styles.Text, {color: 'white'})}>{address2}</Text>
                    <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                      <Text style={{paddingLeft:20}}>❌</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>

                  ):<TouchableOpacity onPress={chooseAddressTwoButton} style={styles.btnAround}>
                  <Text style={(styles.Text, {color: 'black'})}>{address2}</Text>
                  <TouchableOpacity onPress={addressTwoDeleteButton} style={styles.btn}>
                    <Text style={{paddingLeft:20}}>❌</Text>
                  </TouchableOpacity>
                </TouchableOpacity>}
                </View>
                
              ):
              <View style={styles.btnArea2}>
                <TouchableOpacity style={styles.btnNoAround} onPress={addressTwoAddButton}>
                    <Text style={{
                      color: 'gray',
                      textAlign: 'center',
                      marginBottom: 6,
                      fontSize: 15,
                    }}>➕</Text>
                </TouchableOpacity>
              </View>}
            </View>

            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              />

            <View style={styles.bottomArea}>
              <Text style={{paddingBottom:10,paddingTop:10}}><B>{address1} 반경 {Radius}</B></Text>
              <Text style={{paddingBottom:25}}>선택한 범위의 게시글만 볼 수 있어요.</Text>



            </View>
            <NaverMapView
                style={{flex: 0.5, width: '100%', height: '100%'}}
                showsMyLocationButton={true}
                center={{...P0, zoom:16}}
                onMapClick={e => setMapRadius(e)}>
                {
                    location.latitude == null ? null :
                        <Circle coordinate={location} color={"rgba(0,199,249,0.2)"} radius={distance} onClick={() => setDistance(0)}/>

                }
            </NaverMapView>
            <SwitchSelector style={{paddingTop:10}}
                options={options}
                initial={0}
                onPress={saveSwitchRadius}
                textColor={'#7a44cf'}
                selectedColor={'white'}
                buttonColor={'#7a44cf'}
                borderColor={'#7a44cf'}
                hasPadding
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
    Text: {
      fontSize: wp('4%'),
    },
    topArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    bottomArea: {
      flex: 0.15,
      paddingTop: wp(3),
      alignItems: 'center',
    },
    btnArea:{
      flex:0.12,
      flexDirection: "row",
      justifyContent: 'center',
    },
    btnArea2: {
      height: hp(8),
      // backgroundColor: 'orange',
      paddingBottom: hp(1.5),
      paddingRight:15
      
    },
    btnNoAround: {
        flex: 1,
        width: 150,
        height: 50,
        borderRadius: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'gray',
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
    },
  });

export default AroundSetScreen;