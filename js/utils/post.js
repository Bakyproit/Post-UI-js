import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from "./common";
import { getPostList, getPostTemplate } from "./selectors";

dayjs.extend(relativeTime) ;
// render post
export function createPostElement(post){
    if(!post) return ;
    // find and clone template
    const postTemplate = getPostTemplate() ;
    if(!postTemplate) return  ;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true) ;
    if(!liElement) return ;

    // update  title , description author thumbnail
   

    setTextContent(liElement ,'[data-id = "title"]' , truncateText(post.title ,15)) ;
    setTextContent(liElement ,'[data-id = "description"]' ,truncateText(post.description,100)) ; 
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

    // go to post detail when click on div.post-item
    const divElement = liElement.firstElementChild ; 
    if(divElement){
        divElement.addEventListener('click' , (event) => {
            // if event is triggered from menu => ignore
            const menu = liElement.querySelector('[data-id="menu"]') ;
            if(menu && menu.contains(event.target)) return ;

            window.location.assign(`/post-detail.html?id=${post.id}`) ;
        })
    }
    // ADD CLICK event for edit button
    const editButton = liElement.querySelector('[data-id="edit"]') ;
    if(editButton){
        editButton.addEventListener('click' ,(e) => {
        //    e.stopPropagation() ;
           window.location.assign(`/add-edit-post.html?id=${post.id}`) ;
        });
    }

    return liElement ;
}

export function renderPostList(postList){
   if(!Array.isArray(postList)) return ;
   
   const ulElement = getPostList() ;
   if(!ulElement) return ;
   //clear current list
   ulElement.textContent = '';

   postList.forEach((post) => {
      const liElement = createPostElement(post) ;
      ulElement.appendChild(liElement) ;
   });
}