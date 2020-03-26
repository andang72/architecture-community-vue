<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100"
          >
            <h1 class="title md-sm">Your Story Starts With Us.</h1>
            <h4>
              <file-pond
                name="myFiles"
                ref="pond"
                v-bind:files="myFiles"
                label-idle="Drop Photos here..."
                v-bind:allow-multiple="false"
                accepted-file-types="image/jpeg, image/png"
                v-bind:server="pondServerSettings"
                v-on:init="handleFilePondInit"
              />
            </h4>
            <br />
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section">
        <!-- files -->
        <div class="container-fluid">
          <masonry
            :cols="{ default: 8, 1000: 3, 700: 2, 400: 1 }"
            :gutter="{ default: '5px', 700: '5px' }"
          >
            <md-content :key="index" v-for="(image, index) in images">
              <md-card class="image">
                <md-card-media-cover md-solid>
                  <md-card-media md-ratio="1:1">
                    <a href="javascript:void(0)" v-on:click="show(image)">
                      <img
                        v-if="is_image_has_link(image)"
                        :src="
                          get_thumbnail_url(image, {
                            width: 250,
                            height: 250
                          })
                        "
                      />
                      <img
                        v-else
                        v-auth-image="
                          get_thumbnail_url(image, { width: 250, height: 250 })
                        "
                        alt="Image"
                      />
                    </a>
                  </md-card-media>
                  <md-card-area>
                    <md-card-actions
                      class="md-no-border md-no-margin md-margin-left-5 md-margin-bottom-5"
                    >
                      <div
                        class="author md-body-2 md-font-weight-300"
                        v-if="image.user != null"
                      >
                        <a href="javascript:void(0)">
                          <img
                            v-if="image.user != null"
                            :src="get_user_avata_url(image.user.username)"
                            class="avatar"
                            alt="Avatar"
                          />
                          <span>{{ image.user.name }}</span>
                        </a>
                      </div>
                      <div class="stats ml-auto">
                        <md-button
                          class="md-rose md-just-icon md-round md-margin-right-15"
                          v-if="image.editable"
                          v-on:click="edit(image)"
                        >
                          <md-icon>edit</md-icon>
                        </md-button>
                      </div>
                    </md-card-actions>
                  </md-card-area>
                </md-card-media-cover>
              </md-card>
            </md-content>
          </masonry>
        </div>
        <!-- end files -->
      </div>
    </div>

    <!-- view file -->
    <vue-easy-lightbox
      escDisabled
      moveDisabled
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="visible = false"
    ></vue-easy-lightbox>
    <!-- end view file -->
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
import UUID, { uuid } from "vue-uuid";
Vue.use(UUID);
// FilePond Install --------------------------
import vueFilePond from "vue-filepond";
// Import the plugin styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
// Import the plugin code
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
// VueSilentbox Install --------------------------
import VueEasyLightbox from "vue-easy-lightbox";

// VueMasonry Install --------------------------
import VueMasonry from "vue-masonry-css";
Vue.use(VueMasonry);

// VueAuthImage Install --------------------------
import VueAuthImage from "vue-auth-image";
Vue.use(VueAuthImage);
axios.defaults.headers.common = authHeader();

// Auth Header Helper --------------------------
import { authHeader } from "../utils";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
Object.assign(headers, authHeader());

var DEFAULT_DOWNLOAD_OPTIONS = {
  thumbnail: false,
  width: 150,
  height: 150
};

export default {
  bodyClass: "files-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/bg7.jpg")
    }
  },
  components: {
    FilePond,
    VueEasyLightbox
  },
  data: () => ({
    pondServerSettings: {
      url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/photos/filepond`,
      process: {
        withCredentials: false,
        headers: authHeader()
      }
    },
    images: [],
    files: [],
    file: {},
    myFiles: [],
    imgs: "", // Img Url , string or Array of string
    visible: false,
    index: 0 // default: 0
  }),
  methods: {
    show(image) {
      this.imgs = {
        title: image.name,
        src: this.get_image_url(image)
      };
      this.imgs = this.get_image_url(image);
      this.visible = true;
    },
    handleHide() {
      this.visible = false;
    },
    handleFilePondInit: function() {
      // FilePond instance methods are available on `this.$refs.pond`
      /* eslint-disable */
      console.log("FilePond has initialized");
    },
    get_download_url(url) {
      return `${Vue.Constants.API_ROOT_URL}` + url;
    },
    get_user_avata_url(username) {
      const user = this.get_current_user();
      if (user == null) return "@/assets/img/no-avatar.png";
      username = username || user.username;
      return `${Vue.Constants.API_ROOT_URL}/download/avatar/` + username;
    },
    get_current_user() {
      if (typeof this.$store.state.accounts.user != "undefined")
        return this.$store.state.accounts.user.user;
      return null;
    },
    is_image_has_link(image) {
      if (
        image != null &&
        typeof image.imageLink != "undefined" &&
        image.imageLink != null
      )
        return true;
      else return false;
    },
    get_thumbnail_url(image, options) {
      options = options || {};
      options.thumbnail = true;
      return this.get_image_url(image, options);
    },
    get_image_url(image, options) {
      options = options || {};
      options = { ...DEFAULT_DOWNLOAD_OPTIONS, ...options };
      if (image != null && image.imageId > 0) {
        let _imageUrl = `${Vue.Constants.API_ROOT_URL}/download/images/`;
        if (this.is_image_has_link(image)) {
          _imageUrl = _imageUrl + image.imageLink.linkId;
        } else {
          _imageUrl = _imageUrl + image.imageId + "/" + image.name;
        }
        if (options.thumbnail) {
          _imageUrl =
            _imageUrl +
            "?thumbnail=true&height=" +
            options.height +
            "&width=" +
            options.width +
            "&time=" +
            uuid.v1();
        } else {
          _imageUrl = _imageUrl + "?time=" + uuid.v1();
        }
        return encodeURI(_imageUrl);
      }
    },
    refresh() {
      this.images = [];
      this.getImages();
    },
    edit(image) {},
    getImages() {
      var $this = this;
      let loader = this.$loading.show({});
      axios({
        url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/images/list.json`,
        method: "post",
        data: JSON.stringify({}),
        headers: headers
      })
        .then(response => {
          var dataItems = response.data.items;
          dataItems.forEach(function(value, index, array) {
            var editable = false;
            if (
              value.user != null &&
              $this.get_current_user().userId == value.user.userId
            ) {
              editable = true;
            }
            value.editable = editable;
            $this.images.push(value);
          });
        })
        .then(function() {
          loader.hide();
        });
    }
  },
  computed: {
    headerStyle() {
      return {
        backgroundImage: `url(${this.header})`
      };
    }
  },
  mounted() {
    this.getImages();
  }
};
</script>
<style lang="scss" scoped>
.files-page .page-header {
  height: 50vh;
}

.image.md-card {
  min-width: 100px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.image .md-card-header {
  margin: 0px 0px 8px;
  border-radius: 3px;
  padding: 16px;
  background-color: transparent;
}
.image .md-card-actions {
  border: 0;
}
.image .md-button.md-theme-default {
  padding: 0;
  background: transparent !important;
  // min-width: 88px;
  // height: 36px;
  color: rgba(0, 0, 0, 0.87) !important;
  box-shadow: none;
}

.vel-img-modal {
z-index: 99994!important; 
}
</style>
