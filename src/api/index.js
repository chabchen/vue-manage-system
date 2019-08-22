import request from '../utils/request';

export const fetchData = (query) => {
    return request({
        url: '/sysMenu/menuForTree',
        method: 'get',
        data: query
    })
}

