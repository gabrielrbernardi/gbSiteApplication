import api from "./api";

class MiddlewareServices{
    static accessToken: any;
    static refreshToken: any;

    async checkToken(token: any){
        MiddlewareServices.accessToken = token.userData.accessToken;
        MiddlewareServices.refreshToken = token.userData.refreshToken;
        return true;
    }
    
    async postRoute(route: string, data: object){
        console.log(route)
        console.log(data)
        return await api.post(route, data, {headers: { Authorization: `Bearer ${MiddlewareServices.accessToken}` }}).then(response => {
            return response;
        }).catch(async err => {
            if(err.response.status === 403){ //requisicao nao permitida. token invalido
                console.log(err.response.status)
                await api.post("/token", {refreshToken: MiddlewareServices.refreshToken}, {headers: { Authorization: `Bearer ${MiddlewareServices.accessToken}` }}).then(responseRefreshToken => {
                    console.log(1)
                    MiddlewareServices.accessToken = responseRefreshToken.data.accessToken;
                    this.postRoute(route, data);
                }).catch(err1 => {
                    console.log(err1);
                })
            }else{
                console.log(1)
                return err;
            }
        })
    }
}

export {MiddlewareServices};