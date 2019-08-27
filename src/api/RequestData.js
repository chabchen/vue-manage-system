import request from '../utils/request';

export const requestData = (url,method,query) => {
    if('get' == method && query){
        url += "?";
        for(let field in query){
            url += "&"+field + "=" + query[field];
        }
    }
    return request({
        url: url,
        method: method,
        data: query
    })
}

