import Vue from "vue";
import Router from "vue-router";
import Index from "../views/Index.vue";
import Landing from "../views/Landing.vue";
import Login from "../views/Login.vue";
import Logout from "../views/Logout.vue";
import Profile from "../views/Profile.vue";
import Posts from "../views/Posts.vue";
import Images from "../views/Images.vue";
import Files from "../views/Files.vue";
import MainNavbar from "../layout/MainNavbar.vue";
import MainFooter from "../layout/MainFooter.vue";

Vue.use(Router);
import { accounts } from "../store/accounts"; // your vuex store

const ifAuthenticated = (to, from, next) => {
  if (accounts.state.status.loggedIn) {
    next();
    return;
  }
  next("/login");
};
export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      components: { default: Index, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    /*
    {
      path: "/landing",
      name: "landing",
      components: { default: Landing, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      }
    },
    */
    {
      path: "/login",
      name: "login",
      components: { default: Login, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 }
      }
    },
    {
      path: "/profile",
      name: "profile",
      components: { default: Profile, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
      beforeEnter: ifAuthenticated
    },
    {
      path: "/posts",
      name: "posts",
      components: { default: Posts, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
      beforeEnter: ifAuthenticated
    },
    {
      path: "/me/files",
      name: "me-files",
      components: { default: Files, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
      beforeEnter: ifAuthenticated
    },
    {
      path: "/me/images",
      name: "me-images",
      components: { default: Images, header: MainNavbar, footer: MainFooter },
      props: {
        header: { colorOnScroll: 400 },
        footer: { backgroundColor: "black" }
      },
      beforeEnter: ifAuthenticated
    },
    {
      path: "/logout",
      name: "logout",
      components: { default: Logout }
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});
