import api from "./api";

import { MiddlewareServices } from "./MmiddlewareServices";

export const returnAuth = (cookie: any) => {
    const userData = cookie.userData;
    if(userData && userData.accessToken){
        return true;
    }else{
        return false;
    }
};

const middlewareServices = new MiddlewareServices()

export const handleLogoutService = async (getCookies: any, removeCookies: any) => {
    const getAccessToken = getCookies.userData.accessToken;
    return await middlewareServices.postRoute("/logout", {refreshToken: getCookies.userData.refreshToken}).then(response => {
        return response;
    }).catch(err => {
        throw err
    });
}