import axios from 'axios';

window.config = {
    baseURL:"http://10.60.138.84:8081/yili2/api",
    //baseURL:"http://127.0.0.1:8088/api",
    //baseURL:"/gmv/api",
    // baseURL: "/yili2/api",
    // mapUrl: "/yili2/json/map/",
    mapUrl: "/json/map/",
    //mapUrl: "/gmv/json/map/"
}

const service = axios.create({baseURL: window.config.baseURL,timeout: 50000})

service.interceptors.request.use( config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject();
})

service.interceptors.response.use(response => {
    if(response.status === 200){
        return response.data;
    }else{
        Promise.reject();
    }
}, error => {
    console.log(error);
    return Promise.reject();
})

export default service;