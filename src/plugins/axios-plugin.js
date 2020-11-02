import axios from "axios";
import LocalStorageService from "@/common/LocalStorageService";
import router from "@/router";

const localStorageService = LocalStorageService.getService();

export default {
  install: function (Vue, params = {}) {

    // updateToken method's Keycloak documentation states that it returns a promise, 
    // but it actually isn't a thenable and thus the await keyword does not think it as a valid Promise.
    function refreshToken(minValidity) {

        return new Promise((resolve, reject) => {

            Vue.prototype.$keycloak.updateToken(minValidity).success(function () {
                localStorageService.setAuthTokens(Vue.prototype.$keycloak);
                resolve();
            }).error(function () {
                Vue.$log.error('Failed to refresh token' );
                localStorageService.clearAuthTokens();
                router.push('/timeout');
                reject();
            });
        });
    }
        
    // Add a request interceptor
    axios.interceptors.request.use(
        async config => {
            config.headers['Content-Type'] = 'application/json';

            if (config.payment && config.payment === true) {
                console.log('setting form content-type')
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            if (config.ignoreHeader && config.ignoreHeader === true) {
                return config
            }

            await refreshToken(70);

            const token = localStorageService.getAccessToken();
            if (token) {
                config.headers['Authorization'] = 'Bearer ' + token;
            }
            return config;
        },
        error => {
            Promise.reject(error)
        });
    
    }
}
