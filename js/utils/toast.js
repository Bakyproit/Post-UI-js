import Toastify from 'toastify-js' ;
import "toastify-js/src/toastify.css"

export const toast = {
    info(message){
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top", 
            position: "right",
            close : true , 
            style: {
              background: "linear-gradient(to right, #00b09b, #03a9f4)",
            },
          }).showToast();
    } ,
    success(message){
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top", 
            position: "right", 
            close : true , 
            style: {
              background: "linear-gradient(to right, #00b09b, #4caf50)",
            },
          }).showToast();
    },
    error(message){
        Toastify({
            text: message,
            duration: 5000,
            gravity: "top", 
            position: "right", 
            close : true , 
            style: {
              background: "linear-gradient(to right, #00b09b, #d32f2f)",
            },
          }).showToast();
    },
}