import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

var routes = [{
    path: '/',
    redirect: '/dashboard'
},

{
    path: '/',
    component: () => import('../components/common/Home.vue'),
    meta: { title: '自述文件' },
    children: [
        {
            path: '/dashboard',
            component: () => import('../components/page/Dashboard.vue'),
            meta: { title: '系统首页' }
        },
        // {
        //     path: '/index',
        //     component: () => import( '../components/page/common/index.vue'),
        //     meta: { title: '报表数据页' }
        // },
        {
            path: '/index1',
            component: () => import('../components/page/common/index1.vue'),
            meta: { title: '测试' }
        },
        {
            path: '/pieChart',
            component: resolve => require(['../components/page/common/filter/filter-select.vue'], resolve),
        },
        {
            path: '/menuManage',
            component: resolve => require(['../components/common/MenuManage.vue'], resolve),
            meta: { title: '菜单管理', permission: true }
        },
        {
            path: '/reportManage',
            component: resolve => require(['../components/common/ReportManage.vue'], resolve),
            meta: { title: '报表配置管理', permission: true }
        },
        {
            path: '/reportDetailManage',
            component: resolve => require(['../components/common/ReportDetailManage.vue'], resolve),
            meta: { title: '报表配置管理', permission: true }
        },
        // {
        //     path: '/Form1',
        //     component: () => import('../components/page/common/form/Form.vue'),
        //     meta: { title: '基础表格' }
        // },
        {
            path: '/tableGrid',
            component: () => import('../components/page/common/table/TableGrid.vue'),
            meta: { title: '基础表格' }
        },
        {
            path: '/treeTable',
            component: () => import('../components/page/common/table/TreeTable.vue'),
            meta: { title: '基础表格' }
        },
        {
            path: '/404',
            component: () => import('../components/page/404.vue'),
            meta: { title: '404' }
        },
        {
            path: '/403',
            component: () => import('../components/page/403.vue'),
            meta: { title: '403' }
        }
    ]
},
{
    path: '/login',
    component: () => import('../components/page/Login.vue')
},
{
    path: '*',
    redirect: '/404'
},
{
    path: '/Form1',
    component: () => import('../components/page/common/form/Form.vue'),
    meta: { title: '基础表格' }
},
{
    path: '/index',
    component: () => import('../components/page/common/index.vue'),
    meta: { title: '报表数据页' }
},
];

loadRouter();

import { VueObj } from '../main.js'
import { requestData } from '../api/RequestData';

function loadRouter() {
    requestData('/sysMenu/menuForTree', 'get').then(res => {
        let routerData = res.datas ? res.datas : [];;
        addRouter(routerData);
    });
}

function addRouter(data) {
    data.forEach((item, index) => {
        let path = item.url, filePaht = item.description, title = item.name;
        if (!filePaht || filePaht.indexOf("@") == -1) { return; }
        filePaht = filePaht.substring(filePaht.indexOf("@") + 1);
        let routesaa = {
            path: '/' + path,
            component: resolve => require(['../components/page/' + filePaht], resolve),
            meta: { title: title }
        };

        if (item.outsideUrl == 'true') {
            routes.push(routesaa);
        } else {
            routes[1].children.push(routesaa);
        }
    });
    VueObj.$router.addRoutes(routes);
}

export { addRouter }
export default new Router({ mode: 'hash', routes: routes })