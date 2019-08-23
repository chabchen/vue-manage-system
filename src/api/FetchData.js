import request from '../utils/request';

export const fetchData = (url,method,query) => {
    if(query){
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

