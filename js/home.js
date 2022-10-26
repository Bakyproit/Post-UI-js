import postApi from "./api/postApi";
import {initPagination ,initSearch,renderPagination ,renderPostList} from './utils' ;

async function handleFilterChange(filterName , filterValue){
   try {
     // update query params
     const url = new URL(window.location) ;
     url.searchParams.set(filterName , filterValue) ;
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
        // goi api
        const {data , pagination} = await postApi.getAll(queryParams) ;
        renderPostList(data) ;
        renderPagination('pagination',pagination);
    }catch(error){
         console.log('get all failed' , error) ;
         // show modal . toast error
    }
})();