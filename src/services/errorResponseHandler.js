import axios from 'axios'
import Vue from 'vue';


function errorResponseHandler(error) {
    console.log(error.config.errorHandle)
    console.log(error.config.hasOwnProperty('errorHandle'))
    console.log(error)
    // check for errorHandle config
    if( error.config.hasOwnProperty('errorHandle') && error.config.errorHandle === false ) {
        console.log("has property")
        return Promise.reject(error);
    }

    const vm = new Vue()
    // if has response show the error 
    if (error.response) {
        vm.$bvToast.toast(`Oh no! Try again or call support`, {
            title: `An unexpected error has occurred`,
            toaster: 'b-toaster-bottom-center',
            solid: true
        })
        return Promise.reject(error);
    }
}

// apply interceptor on response
axios.interceptors.response.use(
   response => response,
   errorResponseHandler
);

export default errorResponseHandler;