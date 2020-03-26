// =========================================================
// * Vue Material Kit - v1.2.2
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-kit
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-kit/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import MaterialKit from "./plugins/material-kit";
import { store } from "./store";
import axios from "axios"; // Axios 임포트

Vue.config.productionTip = false;

Vue.use(MaterialKit);

import Constants from "@/plugins/Constants";
Vue.use(Constants);

// baseURL 기본값을 정의한다
//axios.defaults.baseURL = 'https://<project>.firebaseio.com'
// 모든 요청에 추가할 헤더 설정
//axios.defaults.headers.common['Authorization'] = 'something'
// GET 요청에 추가할 헤더 설정
//axios.defaults.headers.get['Accepts'] = 'application/json'

// OS
const os = require("os");
Vue.prototype.$platform = os.platform();

const NavbarStore = {
  showNavbar: false
};

Vue.mixin({
  data() {
    return {
      NavbarStore
    };
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
