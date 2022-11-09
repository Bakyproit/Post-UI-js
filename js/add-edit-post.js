import postApi from "./api/postApi";
import { initPostForm, toast } from "./utils" ;

function removeUnusedFields(formValues){
   const payload = {...formValues} ;
   
   if(payload.imageSource === "upload"){
      delete payload.imageUrl ;
   }else{
      delete payload.image ;
   }
   delete payload.imageSource ;

   if(!payload.id) delete payload.id ;
    
   return payload ;
}

function jsonToFormData(jsonObject){
   const formData = new FormData() ;
   for (const key in jsonObject) {
     formData.set(key , jsonObject[key]) ;
   }
   return formData ;
}


async function handlePostFormSubmit(formValues){

   const payload = removeUnusedFields(formValues) ;
   
   const formData = jsonToFormData(payload) ;
   try {
      // check add / edit
      // call API
      // show success message
      // redirect to detail page
      
      const savePost = formValues.id 
      ? await postApi.updateFromData(formData)
      : await postApi.addFromData(formData) ;

      toast.success('Submit post successfully!') ;
      setTimeout(() => {
         window.location.assign(`/post-detail.html?id=${savePost.id}`) ;
      },2000) ;
         
   } catch (error) {
      console.log('Failed to save post' , error) ;
      toast.error(`Error :${error.message}`) ;
    }
}

(async () => {
   try {
      const searchParams = new URLSearchParams(window.location.search) ;
      const postId = searchParams.get('id') ;
   
      const defaultValues = postId 
      ? await postApi.getById(postId)
      :{
       title : '' , 
       description:'',
       author :'',
       imageUrl:'',
      }

      initPostForm({
         formId : 'postForm' ,
         defaultValues ,
         onSubmit : handlePostFormSubmit ,
      });
   } catch (error) {
      console.log('failed to fetch details :' . error) ;
   }
})();