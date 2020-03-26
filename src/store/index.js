import Vue from "vue";
import Vuex from "vuex";

import { alert } from "./alert";
import { accounts } from "./accounts";
import { users } from "./users";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    alert,
    accounts,
    users
  }
});
