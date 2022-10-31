import postApi from "./api/postApi";
import { setTextContent } from "./utils/common";
import dayjs from "dayjs";
import {registerLightBox} from './utils' ;

function renderPostDetail(post){
    if(!post) return
    // render 
    setTextContent(document , '#postDetailTitle' ,post.title) ;
    setTextContent(document , '#postDetailDescription' ,post.description)  ;
    setTextContent(document , '#postDetailAuthor' ,post.author) ;
    setTextContent(document , '#postDetailTimeSpan' , dayjs(post.updateAt).format(' - DD/MM/YYYY HH:mm')) ; ;
    // render hero image(imageUrl)
    const heroImage = document.getElementById('postHeroImage') ;
    if(heroImage){
        heroImage.style.background = `url("${post.imageUrl}")` ;

        heroImage.addEventListener('error' , () =>{
            heroImage.src = 'https://via.placeholder.com/1368x400?text=heroImage' ;
       });
    }
    // render edit page link
    const editPageLink = document.getElementById('goToEditPageLink') ;
    if(editPageLink) {
        editPageLink.href =  `/add-edit-post.html?id=${post.id}` ;
        // editPageLink.textContent = 'Edit Post' ;
        editPageLink.innerHTML = '<i class="fas fa-edit"></i> Edit Post' ;
    }
}

(async () =>{
    registerLightBox({
        modalId :'lightbox' ,
        imgSelector :'img[data-id="lightboxImg"',
        prevSelector :'button[data-id="lightboxPrev"',
        nextSelector :'button[data-id="lightboxNext"',
    });

    try {
        // get post id from url
        const searchParams = new URLSearchParams(window.location.search) ; 
        const postId = searchParams.get('id') ;
        if(!postId) return ;
        
        //fetch post detail API
        const post = await postApi.getById(postId) ;
        // render post detail
        renderPostDetail(post) ;
    } catch (error) {
        console.log('failed to fetch post detail ', error) ;
    }
})();