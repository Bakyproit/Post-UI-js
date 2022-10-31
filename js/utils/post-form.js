import { setBackgroundImage, setFieldValue, setTextContent } from './common' ;
import * as yup from 'yup' ;
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
      title : yup.string().required('Please enter title'),
      author: yup.string()
              .required('Please enter author')
              .test('at-least-two-words' , 'please enter at least two words',
              (value) => value.split(' ').filter((x) => !!x && x.length >= 2).length >= 2),
      description: yup.string() ,
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
    ['title' , 'author' ].forEach(name => setFieldError(form ,name ,'')) ;

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
function showLoading(form){
   const button = form.querySelector('[name="submit"') ;
   if(button){
      button.disabled = true ;
      button.textContent = 'Submitting ....'
   }
}
function hideLoading(form){
   const button = form.querySelector('[name="submit"') ;
   if(button){
      button.disabled = false ;
      button.textContent = 'Submit'
   }
}

export function initPostForm({formId , defaultValues , onSubmit}){
    const form = document.getElementById(formId) ;
    if(!form) return ; 

    let submitting = false ;
    setFromValues(form , defaultValues) ;
    
    form.addEventListener('submit' , async (event) => {
       event.preventDefault() ;

       if(submitting){
         console.log('one is submitting')
       }

       //show loading
       showLoading(form) ;
       submitting = true ;

       // get form values
       const formValues = getFormValues(form) ;
       console.log(formValues) ;
       formValues.id = defaultValues.id ;
       // validation
       const isValid = await validatePostFrom(form , formValues) ;
       if(!isValid) return  ;
       
       await onSubmit?.(formValues) ;

       hideLoading(form);
       submitting = false ;
    });
}