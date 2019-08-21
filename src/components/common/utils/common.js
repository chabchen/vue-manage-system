import axios from 'axios'
import qs from 'qs';

axios.defaults.timeout = 6000000;
axios.defaults.baseURL = 'http://127.0.0.1:8088/api';

//http request 拦截器
axios.interceptors.request.use(
    config => {return config;},
    error => {return Promise.reject(error);}
);


//http response 拦截器
axios.interceptors.response.use(
    response => {return response;},
    error => {return Promise.reject(error)}
)


var smediToken = sessionStorage.getItem('smedi-token');

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url, params = {}) {
    debugger
    url += url.indexOf("?") > -1 ? "&paramRandom=" + Math.random() : "?paramRandom=" + Math.random();   
    let headers = { headers: {'smedi-token': smediToken}};
    return new Promise((resolve, reject) => {
        axios.get(url, {params: params,headers})
             .then(response => {resolve(response.data);})
             .catch(err => {
                if(!err){this.$message.error("网络错误，请检查网络连接");return;}
                if (err.response) {
                    this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);
                } else {
                    this.$message.error(err.message == "Network Error" ? "网络错误，请检查网络连接" : err.message);
                }
                reject(err);
            })
    })
}


/**
 * POST json参数
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
    let headers = { headers: {'smedi-token': smediToken}};
    return new Promise((resolve, reject) => {
        axios.post(url, data,headers)
            .then(response => {resolve(response.data);})
            .catch(err => {
                if(!err){this.$message.error("网络错误，请检查网络连接");return;}
                if (err.response) {
                    this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);
                } else {
                    this.$message.error(err.message == "Network Error" ? "网络错误，请检查网络连接" : err.message);
                }
                reject(err);
            })
    })
}

/**
 * POST formData
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postFormData(url, data) {
    let headers = { headers: {'smedi-token': smediToken,'Content-Type': 'multipart/form-data'}};
    return new Promise((resolve, reject) => {
        axios.post(url, data, headers)
            .then(response => { resolve(response.data);})
            .catch(err => {
                if(!err){this.$message.error("网络错误，请检查网络连接");return;}
                if (err.response) {
                    this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);
                } else {
                    this.$message.error(err.message == "Network Error" ? "网络错误，请检查网络连接" : err.message);
                }
                reject(err);
            })
    })
}

/**
 * 封装post请求  post key-value格式的参数
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postSimple(url, data) {
    let headers = {headers: {'smedi-token': smediToken,'Content-Type': 'application/x-www-form-urlencoded'}};
    return new Promise((resolve, reject) => {
        axios.post(url, qs.stringify(data),headers)
            .then(response => {resolve(response.data);})
            .catch(err => {
                if(!err){this.$message.error("网络错误，请检查网络连接");return;}
                if (err.response) {
                    this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);
                } else {
                    this.$message.error(err.message == "Network Error" ? "网络错误，请检查网络连接" : err.message);
                }
                reject(err);
            })
    })
}



/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
    return new Promise((resolve) => {axios.patch(url, data)
            .then(response => {resolve(response.data);})
            .catch(err => {this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);})
    })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
    return new Promise((resolve) => {axios.put(url, data)
            .then(response => {resolve(response.data);})
            .catch(err => {this.$message.error(err.response && err.response.data ? err.response.data.message : err.message);})
    })
}

export function setToken(token) {
    smediToken = token;
}


/**
 * 数字格式转换成千分位
 *@param{Object}num
 */
export function setFinanceVal(num) {
    if ((num + "").trim() == "") { return ""; }
    if (isNaN(num)) { return ""; }
    num = num + "";
    if (/^.*\..*$/.test(num)) {
        var pointIndex = num.lastIndexOf(".");
        var intPart = num.substring(0, pointIndex);
        var pointPart = num.substring(pointIndex + 1, num.length);
        intPart = intPart + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(intPart)) {
            intPart = intPart.replace(re, "$1,$2")
        }
        num = intPart + "." + pointPart.substring(0, 2);
    } else {
        num = num + "";
        var re = /(-?\d+)(\d{3})/
        while (re.test(num)) {
            num = num.replace(re, "$1,$2")
        }
        num += ".00";
    }
    num = !num || num == "null" || num == "undefined" ? 0 : num;
    return num;
}
//数值转换
export function setDecimalVal(num) {
    num += "";
    if (num.trim() == "") { return ""; }
    num = num.replace(/,/gi, '');
    return num;
}