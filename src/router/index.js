import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

var routes = [{
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import( '../components/common/Home.vue'),
    meta: { title: '自述文件' },
    children: [
        {
            path: '/dashboard',
            component: () => import( '../components/page/Dashboard.vue'),
            meta: { title: '系统首页' }
        },
        {
            path: '/index',
            component: () => import( '../components/page/common/index.vue'),
            meta: { title: '测试' }
        },

        {
            path: '/filterCard',
            component: resolve => require(['../components/page/common/filter/filter-card.vue'], resolve),
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
            path: '/icon',
            component: () => import( '../components/page/Icon.vue'),
            meta: { title: '自定义图标' }
        },
        {
            path: '/table1',
            component: () => import( '../components/page/common/table/Table.vue'),
            meta: { title: '基础表格' }
        },

        {
            path: '/table',
            component: () => import( '../components/page/BaseTable.vue'),
            meta: { title: '基础表格' }
        },
        {
            path: '/tabs',
            component: () => import( '../components/page/Tabs.vue'),
            meta: { title: 'tab选项卡' }
        },
        {
            path: '/form',
            component: () => import( '../components/page/BaseForm.vue'),
            meta: { title: '基本表单' }
        },
        {
            // 富文本编辑器组件
            path: '/editor',
            component: () => import( '../components/page/VueEditor.vue'),
            meta: { title: '富文本编辑器' }
        },
        {
            // markdown组件
            path: '/markdown',
            component: () => import( '../components/page/Markdown.vue'),
            meta: { title: 'markdown编辑器' }
        },
        {
            // 图片上传组件
            path: '/upload',
            component: () => import( '../components/page/Upload.vue'),
            meta: { title: '文件上传' }
        },
        {
            // vue-schart组件
            path: '/charts',
            component: () => import( '../components/page/BaseCharts.vue'),
            meta: { title: 'schart图表' }
        },
        {
            // 拖拽列表组件
            path: '/drag',
            component: () => import( '../components/page/DragList.vue'),
            meta: { title: '拖拽列表' }
        },
        {
            // 拖拽Dialog组件
            path: '/dialog',
            component: () => import( '../components/page/DragDialog.vue'),
            meta: { title: '拖拽弹框' }
        },
        {
            // 国际化组件
            path: '/i18n',
            component: () => import( '../components/page/I18n.vue'),
            meta: { title: '国际化' }
        },
        {
            // 权限页面
            path: '/permission',
            component: () => import( '../components/page/Permission.vue'),
            meta: { title: '权限测试', permission: true }
        },   
        {
            path: '/404',
            component: () => import( '../components/page/404.vue'),
            meta: { title: '404' }
        },
        {
            path: '/403',
            component: () => import( '../components/page/403.vue'),
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
}
];

loadRouter();

import {VueObj} from '../main.js'
import {requestData} from '../api/RequestData';

function loadRouter() {
    // var menusList = sessionStorage.getItem("menusList");
    // if (menusList && menusList.length > 0) {
    //   addRouter(JSON.parse(menusList));
    // }
  
    requestData('/sysMenu/menuForTree','get').then(res => {
      let routerData = res.datas ? res.datas : [];;
      //sessionStorage.setItem("menusList", JSON.stringify(routerData));
      addRouter(routerData);
    });
}

function addRouter(data) {
    data.forEach((item, index) => {
        let path = item.url,filePaht = item.description,title = item.name;
        if(!filePaht || filePaht.indexOf("@") == -1){return;}
        filePaht = filePaht.substring(filePaht.indexOf("@") + 1);
        let routesaa = {
            path: '/' + path,
            component: resolve => require(['../components/page/' + filePaht], resolve),
            meta: {title: title}
        };

        if (item.outsideUrl == 'true') {
            routes.push(routesaa);
        } else {
            routes[1].children.push(routesaa);
        }
    });
    VueObj.$router.addRoutes(routes);
}

export {  addRouter }
export default new Router({mode: 'hash', routes: routes})