import axios from 'axios';

const axiosClient = axios.create({
   baseURL : 'https://js-post-api.herokuapp.com/api' ,
   headers : {
    'Content-Type' : 'application/json' ,
   },
})

// handling error
// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
   
    if(localStorage.getItem('access_token')){
        config.headers.Authorization = `Bearer ${accessToken}` ;
    }

    return config;
  }, function (error) {
    return Promise.reject(error);
  });

// Add a response interceptor
axiosClient.interceptors.response.use(function (response) {

    return response.data;
  }, function (error) {
    console.log('axiosClient - response error' , error.response) ;
    if(!error.response) throw new Error('NetWork error . please try again later.')
    
    if(error.response.status === 401){
        //clear token , logout
        window.location.assign('/login.html') ;
        return ;
    }
  
    return Promise.reject(error);
  });
  
export default axiosClient ;