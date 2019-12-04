import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {postKeyValueRequest} from "./utils/api";
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import el from "element-ui/src/locale/lang/el";
import {initMenu} from "./utils/menus";
import 'font-awesome/css/font-awesome.min.css'

Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.use(ElementUI, {size: 'small'});
Vue.config.productionTip = false;


router.beforeEach((to, from, next) => {
    if (to.path == '/') {
        next();
    } else {
        //如果用户已登录
        if (window.sessionStorage.getItem("user")) {
            initMenu(router, store);
            next();
        } else {
            console.log(to)
            next("/?redirect=" + to.path);
        }


    }
})



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
