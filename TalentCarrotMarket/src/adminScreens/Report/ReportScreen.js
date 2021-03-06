import React, {useState,useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button, Image
} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


import AllReportScreen from './AllReportScreen';
import PostReportScreen from "./PostReportScreen";
import UserReportScreen from "./UserReportScreen";

const ReportScreen = ({navigation}) => {

    const [tab, setTab] = useState(0) // 0 -> 전체신고, 1 -> 게시물 신고, 2 -> 사용자 신고


    let Screen = null;
    if(tab==0)
        Screen = <AllReportScreen/>
    else if(tab==1)
        Screen = <PostReportScreen/>
    else
        Screen = <UserReportScreen/>

    return (
        <View style={styles.container}>

            <View style={styles.title}>
                <TouchableOpacity style={{width:'33%', alignItems:'center'}} onPress={()=>setTab(0)}>
                    <Text style={tab == 0 ? styles.text_on : styles.text_off}>
                        {`전체 신고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '33%', alignItems:'center'}} onPress={()=>setTab(1)}>
                    <Text style={tab == 1 ? styles.text_on : styles.text_off}>
                        {`게시글 신고`}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{width: '33%', alignItems:'center'}} onPress={()=>setTab(2)}>
                    <Text style={tab == 2 ? styles.text_on : styles.text_off}>
                        {`사용자 신고`}
                    </Text>
                </TouchableOpacity>
            </View>

            <View>{Screen}</View>


        </View>


    );
}


const styles = StyleSheet.create({
    text_on:{
    fontSize:18,
        fontWeight: 'bold',
        color: '#ff5900',
        borderBottomWidth: 2,
        borderColor: '#ff5900'
},
text_off:{
    fontSize:18,
        fontWeight: 'bold',
        color: 'grey'
},
    title:{
        margin:10,
        flexDirection:'row',
        borderBottomWidth:5,
        borderColor:'#ffd6c4',
        paddingBottom:5
    },
    container: {
        flex: 1, //전체의 공간을 차지한다는 의미
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: wp(2),
        paddingRight: wp(2),
    },

});

export default ReportScreen;
