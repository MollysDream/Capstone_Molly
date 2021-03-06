import axios from 'axios';
import {HOST} from "./function";

const axi = axios.create({baseURL: `http://${HOST}:3000`});

export async function getUserData(userId){
    console.log('getUsersData함수 호출됨');
    const userData = await axi.get("/user/getUserData", {params:{userId:userId}});
    //console.log(categoryData.data);
    return userData.data;
}

export async function updateUserCategoryAndSort({userId, newUserCategory, newSort}){
    console.log('updateUserCategory함수 호출됨');
    const userData = await axi.post("/user/updateUserCategoryAndSort", {userId,newUserCategory, newSort});
    return userData.data;
}

export async function updateUserAddressIndex(userId, addressIndex){
    console.log(`updateUserAddressIndex함수 호출됨 아이디: ${userId} // 인덱스: ${addressIndex}`);
    const result = await axi.post("/user/updateUserAddressIndex", {userId,addressIndex});
    return result.data;
}

export async function updateUserProfile(userId, editNickname, editImage) {
    console.log(`updateUserProfile함수 호출됨 // 닉네임: ${editNickname} ID: ${userId}`);
    console.log(editImage);
    const result = await axi.post("/user/updateUserProfile", {userId,editNickname, editImage});
    return result.data;
}

export async function addKeyword(userId, keyword){
    console.log(`addKeyword함수 호출됨 아이디: ${userId} // 키워드: ${keyword}`);
    const result = await axi.post("/user/addKeyword", {userId,keyword});
    return result.data;
}

export async function deleteKeyword(userId, keyword){
    console.log(`deleteKeyword함수 호출됨 아이디: ${userId} // 키워드: ${keyword}`);
    const result = await axi.post("/user/deleteKeyword", {userId,keyword});
    return result.data;
}

export async function addCertificate(userId, title, text, certificateImage) {
    console.log(`addCertificate함수 호출됨 // 자격증: ${title} ID: ${userId}`);
    //console.log(certificateImage);
    const result = await axi.post("/user/addCertificate", {userId,title, text, certificateImage});
    return result.data;
}

export async function getUserCertificate(userId){
    console.log('getUserCertificate 호출됨');
    const certificateData = await axi.get("/user/getUserCertificate", {params:{userId:userId}});
    //console.log(categoryData.data);
    return certificateData.data;
}

export async function deleteCertificate(userId, certificateId){
    console.log(`deleteCertificate함수 호출됨 아이디: ${userId} // 자격증 ID: ${certificateId}`);
    const result = await axi.post("/user/deleteCertificate", {userId,certificateId});
    return result.data;
}

export async function checkAdmin(userId){
    console.log(`checkAdmin함수 호출됨 아이디: ${userId}`);
    const result = await axi.post("/user/checkAdmin", {userId});
    return result.data;
}



export default{
    getUserData,
    updateUserCategoryAndSort,
    updateUserAddressIndex,
    updateUserProfile,
    addKeyword,
    deleteKeyword,
    addCertificate,
    getUserCertificate,
    deleteCertificate,
    checkAdmin
}
