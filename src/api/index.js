import request from '../utils/request';

export const fetchData = (query) => {
    return request({
        url: 'http://127.0.0.1:8088/api/sysMenu/menus/list',
        method: 'get',
        data: query
    })
}

