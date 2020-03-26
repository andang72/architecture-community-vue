<template>
  <div class="wrapper">
    <div class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto"
          >
            <login-card header-color="green">
              <h4 slot="title" class="card-title">Login</h4>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-facebook-square"></i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-twitter"></i>
              </md-button>
              <md-button
                slot="buttons"
                href="javascript:void(0)"
                class="md-just-icon md-simple md-white"
              >
                <i class="fab fa-google-plus-g"></i>
              </md-button>
              <p slot="description" class="description">Or Be Classical</p>
              <md-field class="md-form-group" slot="inputs">
                <md-icon>face</md-icon>
                <label>User Name...</label>
                <md-input v-model="username"></md-input>
              </md-field>
              <md-field
                :class="getValidationClass('email')"
                class="md-form-group"
                slot="inputs"
              >
                <md-icon>email</md-icon>
                <label>Email...</label>
                <md-input v-model="email" type="email"></md-input>
                <span class="md-error" v-if="!$v.email.required"
                  >The email is required</span
                >
                <span class="md-error" v-else-if="!$v.email.email"
                  >Invalid email</span
                >
              </md-field>
              <md-field
                :class="getValidationClass('password')"
                class="md-form-group"
                slot="inputs"
              >
                <md-icon>lock_outline</md-icon>
                <label>Password...</label>
                <md-input
                  v-model="password"
                  type="password"
                  v-on:keyup.enter="doLogin"
                ></md-input>
                <span class="md-error" v-if="!$v.password.required"
                  >The passwrod is required</span
                >
              </md-field>
              <md-button
                slot="footer"
                class="md-simple md-success md-lg"
                @click.stop="doLogin"
                :disabled="status.loggingIn"
              >
                Get Started
              </md-button>
              <img
                v-show="is_user_logged_in()"
                src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
              />
            </login-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { LoginCard } from "@/components";
import { bus } from "../utils";
import { validationMixin } from "vuelidate";
import { mapState, mapActions } from "vuex";

import {
  required,
  email,
  between,
  minLength,
  maxLength
} from "vuelidate/lib/validators";

import { isNull } from "util";

// Install Toasted
import Toasted from "vue-toasted";
Vue.use(Toasted);

export default {
  components: {
    LoginCard
  },
  bodyClass: "login-page",
  mixins: [validationMixin],
  data() {
    return {
      username: null,
      email: null,
      password: null
    };
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    }
  },
  props: {
    header: {
      type: String,
      default: require("@/assets/img/profile_city.jpg")
    }
  },
  methods: {
    ...mapActions("accounts", ["login", "logout"]),
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    doLogin() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const { username, email, password } = this;
        this.login({ username, password });
      }
    },
    is_user_logged_in() {
      const status = this.$store.state.accounts.status;
      if (typeof status.loggedIn != "undefined" && status.loggedIn) return true;
      else return false;
    }
  },
  computed: {
    ...mapState("accounts", ["status"]),
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  created() {
    // reset login state
    // this.logout();
    bus.$on("accounts.auth", status => {
      if (status === "failed") {
        this.$toasted
          .error(
            "입력한 아이디와 비밀번호가 일치하지 않습니다. 아이디 또는 비밀번호를 다시 한번 입력해 주세요.",
            { icon: "error" }
          )
          .goAway(5000);
        this.password = "";
      }
    });
  }
};
</script>
<style lang="css"></style>
