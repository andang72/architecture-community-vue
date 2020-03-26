import { userService } from "../services";
import router from "../router/router";
import { bus } from "../utils";
 
const user = JSON.parse(localStorage.getItem("user"));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: {}, user: null };

export const accounts = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ dispatch, commit }, { username, password }) {
      commit("loginRequest", { username });
      userService.login(username, password).then(
        user => {
          commit("loginSuccess", user);
          router.push("/");
        },
        error => {
          commit("loginFailure", error);
          dispatch("alert/error", error.message, { root: true });
        }
      );
    },
    logout({ commit }) {
      userService.logout();
      commit("logout");
    }
  },
  mutations: {
    loginRequest(state, user) { 
      state.status = { loggingIn: true };
      state.user = user;
      bus.$emit("accounts.auth", "attempting");
    },
    loginSuccess(state, user) { 
      state.status = { loggedIn: true };
      state.user = user;
      bus.$emit("accounts.auth", "success");
    },
    loginFailure(state) {
      state.status = {};
      state.user = null;
      bus.$emit("accounts.auth", "failed");
    },
    logout(state) {
      state.status = {};
      state.user = null;
      bus.$emit("accounts.auth", "logout");
    }
  }
};