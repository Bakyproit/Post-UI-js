import axios from "axios";
import axiosClient from "./api/axiosClient.js";
import postApi from "./api/postApi";
import { setTextContent, truncateText } from "./utils/common.js";
import dayjs from 'dayjs' ;
import relativeTime from 'dayjs/plugin/relativeTime' ;

dayjs.extend(relativeTime) ;

function createPostElement(post){
    if(!post) return ;
    // find and clone template
    const postTemplate = document.getElementById('postTemplate') ;
    if(!postTemplate) return  ;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true) ;
    if(!liElement) return ;


    // update  title , description author thumbnail
    // const titleElement = liElement.querySelector('[data-id = "title"]') ;
    // if(titleElement) titleElement.textContent = post.title ;

    setTextContent(liElement ,'[data-id = "title"]' , post.title) ;
    // description
    // const descriptionElement = liElement.querySelector('[data-id = "description"]') ;
    // if(descriptionElement) descriptionElement.textContent = post.description ;

    setTextContent(liElement ,'[data-id = "description"]' ,truncateText(post.description,100)) ; ;
    //author
    // const authorElement = liElement.querySelector('[data-id = "author"]') ;
    // if(authorElement) authorElement.textContent = post.author ;

    setTextContent(liElement ,'[data-id = "author"]' ,post.author)
    
    // calculate timespan
    // dayjs(post.updatedAt).fromNow() ;
    // console.log('time now' ,dayjs(post.updatedAt).fromNow() ) ;
    setTextContent(liElement , '[data-id = "timeSpan"]' ,` -  ${dayjs(post.updatedAt).fromNow()}`) ;

    //thumbnail
    const thumbnailElement = liElement.querySelector('[data-id = "thumbnail"]') ;
    if(thumbnailElement) {
        thumbnailElement.src = post.imageUrl ;
        thumbnailElement.addEventListener('error' , () =>{
             thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail' ;
        });
    }
    return liElement ;
}

function renderPostList(postList){
   console.log({postList}) ;

   if(!Array.isArray(postList) || postList.length === 0) return ;

   const ulElement = document.getElementById('postList') ;
   if(!ulElement) return ;

   postList.forEach((post) => {
      const liElement = createPostElement(post) ;
      ulElement.appendChild(liElement) ;
   });
}

( async () =>{
    try{
        const queryParams = {
            _page : 1,
            _limit : 6,
        }
        const {data , pagination} = await postApi.getAll(queryParams) ;
        renderPostList(data) ;


       }catch(error){
         console.log('get all failed' , error) ;
         // show toast
       }

})();