import postApi from "./api/postApi";
import {initPagination ,initSearch,renderPagination ,renderPostList, toast} from './utils' ;

async function handleFilterChange(filterName , filterValue){
   try {
     // update query params
     const url = new URL(window.location) ;

     if(filterName) url.searchParams.set(filterName , filterValue) ;
     
     // reset page
     if(filterName === 'title_like') url.searchParams.set('_page' , 1) ;

     history.pushState({} , '' , url) ;
     //fetch API
     const {data , pagination} = await postApi.getAll(url.searchParams) ;
     renderPostList(data) ;
     renderPagination('pagination',pagination);
     //re-render post list 
   } catch (error) {
     console.log('failed to fetch post list' , error) ;
   }
}

function getDefaultParams(){
    const url = new URL(window.location) ;
    // update search
    if(!url.searchParams.get('_page')) url.searchParams.set('_page' , 1) ;
    if(!url.searchParams.get('_limit')) url.searchParams.set('_limit' , 6) ;
    history.pushState({},'',url) ;

    return url.searchParams ;
}

function registerPostDeleteEvent(){
    document.addEventListener('post-delete' , async (event) => {

       try {
         
         const post = event.detail ;
         const message = `Are you sure to remove post "${post.title}" ?` ;
         if(window.confirm(message)){
            await postApi.remove(post.id) ;  
            await handleFilterChange() ;
            
            toast.success('remove post successfully');
         }

       } catch (error) {
         console.log('failed to remove post' , error) ;
         toast.error(error.message) ;
       }
    });
}

( async () =>{
    try{
        // params
        const queryParams = getDefaultParams() ;

        //pagination
        initPagination({
            elementId : 'pagination' ,
            defaultParams : queryParams ,
            onchange : page => handleFilterChange('_page' , page) ,
        }) ; 
        // search
        initSearch({
            elementId : 'searchInput' ,
            defaultParams : queryParams ,
            onchange : value => handleFilterChange('title_like' , value),
        }) ;
        
         registerPostDeleteEvent() ;
         handleFilterChange() ;
    }catch(error){
         console.log('get all failed' , error) ;
         // show modal . toast error
    }
})();