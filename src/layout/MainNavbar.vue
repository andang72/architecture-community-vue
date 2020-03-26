<template>
  <md-toolbar
    id="toolbar"
    md-elevation="0"
    class="md-transparent md-absolute"
    :class="extraNavClasses"
    :color-on-scroll="colorOnScroll"
  >
    <div class="md-toolbar-row md-collapse-lateral">
      <div class="md-toolbar-section-start">
        <h3 class="md-title">Function Factory Kit</h3>
      </div>
      <div class="md-toolbar-section-end">
        <md-button
          class="md-just-icon md-simple md-toolbar-toggle"
          :class="{ toggled: toggledClass }"
          @click="toggleNavbarMobile()"
        >
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </md-button>

        <div class="md-collapse">
          <div class="md-collapse-wrapper">
            <mobile-menu nav-mobile-section-start="false">
              <!-- Here you can add your items from the section-start of your toolbar -->
            </mobile-menu>
            <md-list>
              <li class="md-list-item" v-if="authenticated">
                <a
                  href="javascript:void(0)"
                  class="md-list-item-router md-list-item-container md-button-clean dropdown"
                >
                  <div class="md-list-item-content">
                    <drop-down direction="down">
                      <md-button
                        slot="title"
                        class="md-button md-button-link md-white md-simple dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        <i class="material-icons">apps</i>
                        <p>ME</p>
                      </md-button>
                      <ul class="dropdown-menu dropdown-with-icons">
                        <li>
                          <a href="#/posts">
                            <i class="material-icons">amp_stories</i>
                            <p>Posts</p>
                          </a>
                        </li>
                        <li>
                          <a href="#/me/images">
                            <i class="material-icons">photo_library</i>
                            <p>Images</p>
                          </a>
                        </li>
                        <li>
                          <a href="#/me/files">
                            <i class="material-icons">cloud_circle</i>
                            <p>Files</p>
                          </a>
                        </li>
                      </ul>
                    </drop-down>
                  </div>
                </a>
              </li>
              <li class="md-list-item" v-if="authenticated">
                <a
                  href="javascript:void(0)"
                  class="md-list-item-router md-list-item-container md-button-clean dropdown"
                >
                  <div class="md-list-item-content">
                    <drop-down direction="down" class="profile-photo">
                      <div
                        class="profile-photo-small"
                        slot="title"
                        data-toggle="dropdown"
                      >
                        <img
                          :src="get_user_avata_url()"
                          alt="Circle Image"
                          class="profile-photo-small"
                        />
                      </div>
                      <ul class="dropdown-menu dropdown-menu-right">
                        <li class="dropdown-header">
                          <span v-html="get_current_user().email"></span>
                        </li>
                        <li>
                          <a href="#/profile">
                            <i class="material-icons">account_circle</i>
                            <p>Profile</p>
                          </a>
                        </li>
                        <li>
                          <a href="#/logout" class="dropdown-item">Sign Out</a>
                        </li>
                      </ul>
                    </drop-down>
                  </div>
                </a>
              </li>
              <md-list-item href="#/login" v-else>
                <i class="material-icons">fingerprint</i>
                <p>Login</p>
              </md-list-item>
            </md-list>
          </div>
        </div>
      </div>
    </div>
  </md-toolbar>
</template>

<script>
let resizeTimeout;
function resizeThrottler(actualResizeHandler) {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(() => {
      resizeTimeout = null;
      actualResizeHandler();

      // The actualResizeHandler will execute at a rate of 15fps
    }, 66);
  }
}
import Vue from "vue";
import MobileMenu from "@/layout/MobileMenu";
export default {
  components: {
    MobileMenu
  },
  props: {
    type: {
      type: String,
      default: "white",
      validator(value) {
        return [
          "white",
          "default",
          "primary",
          "danger",
          "success",
          "warning",
          "info"
        ].includes(value);
      }
    },
    colorOnScroll: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      extraNavClasses: "",
      toggledClass: false
    };
  },
  computed: {
    //showDownload() {
    //  const excludedRoutes = ["login"];
    //  return excludedRoutes.every(r => r !== this.$route.name);
    //},
    authenticated() {
      return this.is_user_logged_in();
    }
  },
  methods: {
    get_user_avata_url(username) {
      const user = this.get_current_user();
      if (user == null) return "@/assets/img/no-avatar.png";
      username = username || user.username;
      return `${Vue.Constants.API_ROOT_URL}/download/avatar/` + username;
    },
    is_user_logged_in() {
      const status = this.$store.state.accounts.status;
      if (typeof status.loggedIn != "undefined" && status.loggedIn) return true;
      else return false;
    },
    get_current_user() {
      if (typeof this.$store.state.accounts.user != "undefined")
        return this.$store.state.accounts.user.user;
      return null;
    },
    bodyClick() {
      let bodyClick = document.getElementById("bodyClick");
      if (bodyClick === null) {
        let body = document.querySelector("body");
        let elem = document.createElement("div");
        elem.setAttribute("id", "bodyClick");
        body.appendChild(elem);

        let bodyClick = document.getElementById("bodyClick");
        bodyClick.addEventListener("click", this.toggleNavbarMobile);
      } else {
        bodyClick.remove();
      }
    },
    toggleNavbarMobile() {
      this.NavbarStore.showNavbar = !this.NavbarStore.showNavbar;
      this.toggledClass = !this.toggledClass;
      this.bodyClick();
    },
    handleScroll() {
      let scrollValue =
        document.body.scrollTop || document.documentElement.scrollTop;
      let navbarColor = document.getElementById("toolbar");
      this.currentScrollValue = scrollValue;
      if (this.colorOnScroll > 0 && scrollValue > this.colorOnScroll) {
        this.extraNavClasses = `md-${this.type}`;
        navbarColor.classList.remove("md-transparent");
      } else {
        if (this.extraNavClasses) {
          this.extraNavClasses = "";
          navbarColor.classList.add("md-transparent");
        }
      }
    },
    scrollListener() {
      resizeThrottler(this.handleScroll);
    },
    scrollToElement() {
      let element_id = document.getElementById("downloadSection");
      if (element_id) {
        element_id.scrollIntoView({ block: "end", behavior: "smooth" });
      }
    }
  },
  mounted() {
    document.addEventListener("scroll", this.scrollListener);
  },
  beforeDestroy() {
    document.removeEventListener("scroll", this.scrollListener);
  }
};
</script>
<style scoped>
.profile-photo-small img {
  height: 100%;
}
</style>
