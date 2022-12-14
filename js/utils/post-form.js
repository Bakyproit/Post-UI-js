import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common' ;
import * as yup from 'yup' ;


const ImageSource ={
   PICSUM :'picsum',
   UPLOAD :'upload',
}
// set du lieu cho form
function setFromValues(form , formValues){
   setFieldValue(form , '[name="title"]' , formValues?.title) ;
   setFieldValue(form , '[name="author"]' , formValues?.author) ;
   setFieldValue(form , '[name="description"]' , formValues?.description) ;

   setFieldValue(form , '[name="imageUrl"]' , formValues?.imageUrl) ;
   setBackgroundImage(document , "#postHeroImage" , formValues?.imageUrl) ;
}

//lay du lieu tu form
function getFormValues(form){
   const formValues = {} ;
   // s1
//    ['title' , 'author' , 'description' , 'imageUrl'].forEach(name => {
//       const field = form.querySelector(`[name="${name}"]`);
//       if(field) values[name] = field.value ;
//    }) ;
   
   const data = new FormData(form) ;
   for(const [key , value] of data){
    formValues[key] = value ;
   }
   return formValues ;
}

// Yup
function getPostSchema(){
   return yup.object().shape({
      title : yup.string()
              .required('Please enter title'),
      author: yup.string()
              .required('Please enter author')
              .test('at-least-two-words' , 'please enter at least two words',
              (value) => value.split(' ').filter((x) => !!x && x.length >= 2).length >= 2),
      description: yup.string() ,
      imageSource: yup.string()
                  .required('Please select an image source')
                  .oneOf([ImageSource.PICSUM , ImageSource.UPLOAD],'Invalid image source'),
      imageUrl: yup.string()
                .when('imageSource',{
                  is:ImageSource.PICSUM,
                  then:yup.string()
                  .required('Please random a background image')
                  .url('please enter a valid URL'),
                }), 
      image: yup.mixed().when('imageSource', {
               is   : ImageSource.UPLOAD ,
               then : yup.mixed()
                .test('required' ,'Please select an image to upload', (value) => Boolean(value?.name))
                .test('max-mb' , 'The image is too large' , (file) => {
                  const fileSize = file?.size || 0 ; 
                  const MAX_SIZE = 1000 * 1024 *1024 ;
                  return fileSize <= MAX_SIZE ;
                }) ,
            }),
    }) ;
}

function setFieldError(form , name , error){
    const element = form.querySelector(`[name=${name}]`) ;
    if(element){
        element.setCustomValidity(error);
        setTextContent(element.parentElement , '.invalid-feedback' , error) ;
    }
}

// html check validated
async function validatePostFrom(form , formValues){
   try {
    // reset previous error
    ['title' , 'author','imageUrl','image'].forEach(name => setFieldError(form ,name ,'')) ;

    const schema = getPostSchema() ;
    await schema.validate(formValues , { abortEarly : false}) ;
   } catch (error) {
    //  console.log(error.name) ; 
    //  console.log(error.inner) ;

     const errorLog ={} ;

     if(error.name === 'ValidationError' && Array.isArray(error.inner)){
        for(const validationError of error.inner){
            const name = validationError.path ; 

            if(errorLog[name]) continue ;
            setFieldError(form , name , validationError.message) ;
            errorLog[name] = true ;
         }
     }
   }

   // add was-validated
   const isValid = form.checkValidity() ; 
   if(!isValid) form.classList.add('was-validated') ;

   return isValid ;
}

// 
async function validateFormField(form , formValues , name){
   try {
      //clear error
      setFieldError(form , name , '')

      const schema = getPostSchema() ;
      await schema.validateAt(name , formValues) ;
   } catch (error) {
      setFieldError(form , name, error.message ) ;
   }
   const field = form.querySelector(`[name="${name}"]`);
   if(field && field.checkValidity()) {
       field.parentElement.classList.add('was-validated');
   }
}

function initRandomImage(form){
   const randomButton = document.getElementById('postChangeImage') ;
   if(!randomButton) return ;

   randomButton.addEventListener('click' , () => {
       const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400` ;
       // set imageUrl 

       setFieldValue(form , '[name="imageUrl"]' , imageUrl) ;
       setBackgroundImage(document , "#postHeroImage" , imageUrl) ;
   });


}

function renderImageSourceControl(form , selectedValue){
   const controlList = form.querySelectorAll('[data-id="imageSource"]') ;
   controlList.forEach(control => {
      control.hidden = control.dataset.imageSource !== selectedValue ;
   });
}

function initRadioImageSource(form){
   const radioList = form.querySelectorAll('[name="imageSource"]');
   radioList.forEach(radio => {
      radio.addEventListener('change' , event => {
        renderImageSourceControl(form , event.target.value)}) ;
   });
}

function initUploadImage(form){
   const uploadImage = form.querySelector('[name="image"]') ;
   if(!uploadImage) return ;

   uploadImage.addEventListener('change' , event =>{
      const file = event.target.files[0] ;
      if(file) {
         const imageUrl = URL.createObjectURL(file) ;
         // setFieldValue(form , '[name="imageUrl"]' , file) ;
         setBackgroundImage(document , "#postHeroImage" , imageUrl) ;

         // trigger validate of upload
         validateFormField(
            form , 
            {
               imageSource: ImageSource.UPLOAD , 
               image : file ,
            } ,
            'image') ;
      }
   });

}

function initValidationOnchange(form){
   ['title' ,'author'].forEach(name =>{
      const field = form.querySelector(`[name="${name}"]`)
      if(field) {
         field.addEventListener('input' , (event) => {
            const newValue = event.target.value ;

            validateFormField(form , { [name] : newValue} , name)
         })
      }
   })
}

export function initPostForm({formId , defaultValues , onSubmit}){
    const form = document.getElementById(formId) ;
    if(!form) return ; 

    let submitting = false ;
    setFromValues(form , defaultValues) ;

    // init event
    initRandomImage(form) ;
    initRadioImageSource(form) ;
    initUploadImage(form) ;

    initValidationOnchange(form) ;

    
    form.addEventListener('submit' , async (event) => {
       event.preventDefault() ;

       if(submitting) return ;
       //show loading
       submitting = true ;

       // get form values
       const formValues = getFormValues(form) ;
       formValues.id = defaultValues.id ;
       // validation
       const isValid = await validatePostFrom(form , formValues) ;
       if(isValid) await onSubmit?.(formValues) ;     
       submitting = false ; 
    });
}