/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../instance/axios-instance";


export async function getUserProfile(id:string) {
   try{
    const res= await axiosInstance.get(`/user/${id}`);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}


export async function userProfileUpdate(data: any, id: string) {
   try{
    const res= await axiosInstance.put(`/user/${id}`,data);
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to Fetch Your Profile please check everyting")
    }
   } 
    
}


export async function changePassword({oldPassword,newPassword}:{oldPassword:string,newPassword:string}) {
           try{
    const res= await axiosInstance.post(`/auth/change-password`,{oldPassword,newPassword});
    return res.data;
   }catch(error){
    if(error instanceof Error){
        throw new Error(error.message || "Fail to faild to update Password")
    }
   } 
}

export async function uploadUserAvatar(data: FormData) {
   try {
    const res = await axiosInstance.put(`/user/upload-avatar`, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    return res.data;
   } catch(error) {
    if(error instanceof Error){
        throw new Error(error.message || "Failed to upload avatar")
    }
   } 
}