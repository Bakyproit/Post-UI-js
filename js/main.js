import axios from "axios";
import axiosClient from "./api/axiosClient.js";
import postApi from "./api/postApi";

async function main(){
    // const response = await axiosClient.get('/posts') ;
    // console.log(response) ;
   try{
    const queryParams = {
        _page : 1,
        _limit : 5,
    }
    const response = await postApi.getAll(queryParams) ;
   }catch(error){
     console.log('get all failed' , error) ;
     // show toast
   }

   await postApi.updateFromData({
     id : 'lea2aa9l7x3a5tg',
     title : 'Dicta aut 111',
   });
}
main() ;