import axios from "axios";
import axiosClient from "./api/axiosClient.js";
import postApi from "./api/postApi";
import { setTextContent, truncateText } from "./utils/common.js";
import dayjs from 'dayjs' ;
import relativeTime from 'dayjs/plugin/relativeTime' ;
import { getPagination, getPostList, getPostTemplate } from "./utils/selectors.js";

dayjs.extend(relativeTime) ;

function createPostElement(post){
    if(!post) return ;
    // find and clone template
    const postTemplate = getPostTemplate() ;
    if(!postTemplate) return  ;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true) ;
    if(!liElement) return ;

    // update  title , description author thumbnail
    // const titleElement = liElement.querySelector('[data-id = "title"]') ;
    // if(titleElement) titleElement.textContent = post.title ;

    setTextContent(liElement ,'[data-id = "title"]' , truncateText(post.title ,15)) ;
    // description
    setTextContent(liElement ,'[data-id = "description"]' ,truncateText(post.description,100)) ; 
    //author
    setTextContent(liElement ,'[data-id = "author"]' ,post.author)
    
    // calculate timeSpan
    // dayjs(post.updatedAt).fromNow() ;
    // console.log('time now' ,dayjs(post.updatedAt).fromNow() ) ;
    setTextContent(liElement , '[data-id = "timeSpan"]' ,` - ${dayjs(post.updatedAt).fromNow()}`) ;

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
   if(!Array.isArray(postList) || postList.length === 0) return ;
   
   const ulElement = getPostList() ;
   if(!ulElement) return ;
   //clear current list
   ulElement.textContent = '';

   postList.forEach((post) => {
      const liElement = createPostElement(post) ;
      ulElement.appendChild(liElement) ;
   });
}
////
function renderPagination(pagination){
    const ulPagination = getPagination() ;

    if(!pagination || !ulPagination) return ;

    // calc totalPages
    const {_page , _limit , _totalRows} = pagination ;
    const totalPages = Math.ceil(_totalRows / _limit) ;
    // save page and totalPages
    ulPagination.dataset.page = _page ;
    ulPagination.dataset.totalPages = totalPages ;
    // check if enable/disable 
    if(_page <= 1) ulPagination.firstElementChild?.classList.add('disabled') ;
    else {
        ulPagination.firstElementChild?.classList.remove('disabled') ;
    } 
    if(_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled') ;
    else ulPagination.lastElementChild?.classList.remove('disabled') ;
}

async function handleFilterChange(filterName , filterValue){
   try {
     // update query params
     const url = new URL(window.location) ;
     url.searchParams.set(filterName , filterValue) ;
     history.pushState({} , '' , url) ;
     //fetch API
     const {data , pagination} = await postApi.getAll(url.searchParams) ;
     renderPostList(data) ;
     renderPagination(pagination);
     //re-render post list 
   } catch (error) {
     console.log('failed to fetch post list' , error) ;
   }

}


function handlePrevClick(e){
    e.preventDefault() ;
   const ulPagination = getPagination() ;
   if(!ulPagination) return ;
   const page = ulPagination.dataset.page ;
   const totalPages = ulPagination.dataset.totalPages ;
   if(page <= 1) return ;

   handleFilterChange('_page' , page - 1) ;
}
function handleNextClick(e){
    e.preventDefault() ;
   const ulPagination = getPagination() ;
   if(!ulPagination) return ;
   const page = Number.parseInt(ulPagination.dataset.page) || 1 ;
   const totalPages = ulPagination.dataset.totalPages ;
   if(page >= totalPages) return ;

   handleFilterChange('_page' , page + 1) ;
}

function initPagination(){
   //bind click event
   const ulPagination = getPagination() ;
   if(!ulPagination) return ;
   //add click event prev link
   const prevLink = ulPagination.firstElementChild?.firstElementChild ;
   if(prevLink){
    prevLink.addEventListener('click' , handlePrevClick) ;
   }
   // add click event next link
   const nextLink = ulPagination.lastElementChild?.lastElementChild ;
   if(nextLink) {
    nextLink.addEventListener('click' , handleNextClick) ;
   }
}
function initURL(){
    const url = new URL(window.location) ;
    // update search
    if(!url.searchParams.get('_page')) url.searchParams.set('_page' , 1) ;
    if(!url.searchParams.get('_limit')) url.searchParams.set('_limit' , 6) ;
    history.pushState({},'',url) ;
}

( async () =>{
    try{
        initPagination() ; 
        initURL() ;
        const queryParams = new URLSearchParams(window.location.search) ;
        const {data , pagination} = await postApi.getAll(queryParams) ;
        renderPostList(data) ;
        renderPagination(pagination);

    }catch(error){
         console.log('get all failed' , error) ;
         // show modal . toast error
    }
})();