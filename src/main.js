import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VCharts from 'v-charts';
import echarts from "echarts";
import ElementUI from 'element-ui';
//import AFTableColumn from 'af-table-column';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import { requestData } from './api/RequestData';
import {setFinanceVal,setDecimalVal,getComponents} from './components/common/utils/common.js'


Vue.config.productionTip = false;
Vue.use(ElementUI, {size: 'small'});
//Vue.use(AFTableColumn);
Vue.use(VCharts);

Vue.prototype.$requestData = requestData;
Vue.prototype.$echarts = echarts; 
//金额千分位转换函数
Vue.prototype.$setFinanceVal = setFinanceVal;
Vue.prototype.$setDecimalVal = setDecimalVal;
//组件列表
Vue.prototype.$getComponents = getComponents;




//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    localStorage.setItem('ms_username',"admin");
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
});

export const VueObj = new Vue({router,render: h => h(App)}).$mount('#app');

