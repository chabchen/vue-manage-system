import request from '../utils/request';
import VueCookies from 'vue-cookies';

let token = VueCookies.get("Yili-Admin-Token");
export const requestData = (url,method,query) => {
    if('get' == method && query){
        url += "?";
        for(let field in query){
            if(query[field]){url += "&"+field + "=" + query[field];}
        }
        url = url.replace("&","");
        url = encodeURI(url);
    }
    //url = url.replace("data","list");
    if(query){query.token = token;}
    return request({url: url,method: method,data: query})
}

