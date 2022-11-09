import postApi from "./api/postApi";
import { initPostForm, toast } from "./utils" ;

async function handlePostFormSubmit(formValues){
    try {
      // check add / edit
      // call API
      // show success message
      // redirect to detail page
      
      const savePost = formValues.id 
      ? await postApi.update(formValues) 
      : await postApi.add(formValues) ;

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