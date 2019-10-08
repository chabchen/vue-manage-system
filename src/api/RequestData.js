import request from '../utils/request';

export const requestData = (url,method,query) => {
    if('get' == method && query){
        url += "?";
        for(let field in query){
            if(query[field]){url += "&"+field + "=" + query[field];}
        }
        url = url.replace("&","");
        url = encodeURI(url);
    }
    return request({
        url: url,
        method: method,
        data: query
    })
}

