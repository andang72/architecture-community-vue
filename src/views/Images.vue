<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div class="md-layout-item">
            <h1 class="title md-sm">Your Story Starts With Us.</h1>
          </div>
        </div>
        <div class="md-layout md-gutter md-alignment-center-center">
          <div
            class="md-layout-item md-medium-size-50 md-small-size-100 md-xsmall-size-100"
          >
            <file-pond
              name="myFiles"
              ref="pond"
              v-bind:files="myFiles"
              label-idle="Drop Photos here..."
              v-bind:allow-multiple="false"
              accepted-file-types="image/jpeg, image/png"
              v-bind:server="pondServerSettings"
              v-on:init="handleFilePondInit"
              v-on:processfile="handleFilePondProcess"
            />
          </div>
          <div
            class="md-layout-item md-medium-size-40 md-small-size-50 md-xsmall-size-50"
          >
            <md-button
              class="md-primary md-round md-lg"
              @click="open_upload_by_url"
            >
              <md-icon class="md-margin-right-15">cloud_upload</md-icon>Upload
              by URL
            </md-button>
          </div>
          <div
            class="md-layout-item md-medium-size-10 md-small-size-15 md-xsmall-size-15 md-margin-left-15"
          >
            <md-button class="md-rose md-just-icon md-round" @click="refresh">
              <md-icon>refresh</md-icon>
            </md-button>
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
              <md-card class="image md-min-height-150 md-bg-color-lightgray">
                <md-card-media>
                  <a href="javascript:void(0)" v-on:click="show(image)">
                    <vue-image
                      blurReverse
                      v-if="is_image_has_link(image)"
                      :src="
                        get_thumbnail_url(image, {
                          width: 300,
                          height: 300
                        })
                      "
                    />
                    <img
                      v-else
                      v-auth-image="
                        get_thumbnail_url(image, { width: 300, height: 300 })
                      "
                      src="@/assets/img/loading-ring-400x300.gif"
                      alt="Image"
                    />
                  </a>
                </md-card-media>
                <md-card-actions
                  class="md-pos-abs md-no-margin md-no-border md-no-border"
                >
                  <md-button
                    class="md-just-icon md-round md-simple"
                    v-if="image.editable"
                    v-on:click="edit(image)"
                  >
                    <md-icon>settings</md-icon>
                  </md-button>
                </md-card-actions>
              </md-card>
              <!--   <md-card class="image md-no-border">
                <md-card-media-cover md-solid>
                  <md-card-media md-ratio="1:1">
                    <a href="javascript:void(0)" v-on:click="show(image)">
                      <vue-image
                        blurReverse
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
                        src="@/assets/img/loading-ring-400x300.gif"
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
                          class="md-rose md-just-icon md-round"
                          v-if="image.editable"
                          v-on:click="edit(image)"
                        >
                          <md-icon>settings</md-icon>
                        </md-button>
                      </div>
                    </md-card-actions>
                  </md-card-area>
                </md-card-media-cover>
              </md-card>-->
            </md-content>
          </masonry>
        </div>
        <!-- end files -->
      </div>
    </div>
    <!-- url image upload -->
    <md-dialog :md-active.sync="uploadDialog.show" md-fullscreen>
      <md-dialog-title>Upload by URL</md-dialog-title>
      <md-dialog-content>
        <md-content md-ratio="1:1" class="md-alignment-center">
          <img
            v-lazy="uploadDialog.url"
            class="image-preview"
            @load="onImageExist"
          />
        </md-content>
        <md-field>
          <label>URL</label>
          <md-input v-model="uploadDialog.url"></md-input>
        </md-field>
        <md-switch v-model="uploadDialog.share">
          Share
          <small>(it's will be shared.)</small>
        </md-switch>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          class="md-primary md-sm"
          :disabled="!uploadDialog.exist"
          @click="do_upload_by_url"
          >Upload</md-button
        >
        <md-button
          class="md-danger md-simple"
          @click="uploadDialog.show = false"
          >Close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <!-- end url image upload -->

    <!-- edit iamge modal -->
    <modal v-if="editDialog.show" @click="editDialog.show = false">
      <template slot="header">
        <h4 class="modal-title">{{ editDialog.image.name }}</h4>
        <md-button
          class="md-simple md-just-icon md-round modal-default-button"
          @click="editDialog.show = false"
        >
          <md-icon>clear</md-icon>
        </md-button>
      </template>
      <template slot="body">
        <vue-dropzone
          ref="myVueDropzone"
          id="dropzone"
          :options="dropzoneOptions"
          v-on:vdropzone-sending="send_file_dropzone"
          v-on:vdropzone-success="upload_success_dropzone"
          class="md-margin-bottom-15"
        ></vue-dropzone>
        <md-switch v-model="editDialog.share" @click="share_or_unshare_image">
          Share
          <small>(it's will be shared.)</small>
        </md-switch>
      </template>
      <template slot="footer">
        <md-button class="md-danger md-simple md-round" @click="delete_image">
          <md-icon>delete</md-icon>DELETE
        </md-button>
        <md-button class="md-danger md-simple" @click="editDialog.show = false"
          >Close</md-button
        >
      </template>
    </modal>
    <!-- end image edit modal -->

    <md-dialog-confirm
      :md-active.sync="editDialog.showConfirmDialog"
      md-title="Are you sure you want to delete the image?"
      md-content="Permanently removes the selected image. <br/> This action cannot be undone."
      md-confirm-text="Agree"
      md-cancel-text="Cancle"
      @md-cancel="editDialog.showConfirmDialog = false"
      @md-confirm="confirm_delete_iamge"
    />

    <!--
    <md-dialog :md-active.sync="editDialog.show" md-fullscreen>
      <md-dialog-title>{{ editDialog.image.name }}</md-dialog-title>
      <md-dialog-content>
        <div class="md-layout md-margin-bottom-15">
          <div class="md-layout-item">
            <span class="md-body-1">
              {{
                new Date(editDialog.image.modifiedDate)
                  | moment("YYYY.MM.DD HH:mm")
              }}</span
            >
          </div>
        </div>
        <vue-dropzone
          ref="myVueDropzone"
          id="dropzone"
          :options="dropzoneOptions"
          class="md-margin-bottom-15"
        ></vue-dropzone>
        <md-switch v-model="editDialog.share">
          Share
          <small>(it's will be shared.)</small>
        </md-switch>
      </md-dialog-content>
      <md-dialog-actions md-alignment="space-between">
        <div>
          <md-button class="md-danger md-simple md-round"
            ><md-icon>delete</md-icon> DELETE</md-button
          >
          <md-button
            class="md-danger md-simple md-round"
            @click="editDialog.show = false"
            >Close</md-button
          >
        </div>
      </md-dialog-actions>
    </md-dialog>
    -->

    <!-- view image file -->
    <vue-easy-lightbox
      escDisabled
      moveDisabled
      :visible="visible"
      :imgs="imgs"
      :index="index"
      @hide="visible = false"
    ></vue-easy-lightbox>
    <!-- end view iamge file -->
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";
// UUID Install --------------------------
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
// Dropzone Install --------------------------
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
// VueSilentbox Install --------------------------
import VueEasyLightbox from "vue-easy-lightbox";
// VueImage Install --------------------------
import VueImage from "vue-image-effect";
// VueMasonry Install --------------------------
import VueMasonry from "vue-masonry-css";
Vue.use(VueMasonry);
// VueAuthImage Install --------------------------
import VueAuthImage from "vue-auth-image";
Vue.use(VueAuthImage);
axios.defaults.headers.common = authHeader();
// Install Toasted
import Toasted from "vue-toasted";
Vue.use(Toasted);
// Auth Header Helper --------------------------
import { authHeader } from "../utils";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
Object.assign(headers, authHeader());
const dorozone_headers = {
  "Cache-Control": null,
  "X-Requested-With": null
};
Object.assign(dorozone_headers, authHeader());
var DEFAULT_DOWNLOAD_OPTIONS = {
  thumbnail: false,
  width: 150,
  height: 150
};
import { Modal } from "@/components";
export default {
  bodyClass: "images-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/bg7.jpg")
    }
  },
  components: {
    FilePond,
    VueEasyLightbox,
    VueImage,
    vueDropzone: vue2Dropzone,
    Modal
  },
  data: () => ({
    pondServerSettings: {
      url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/photos/filepond`,
      process: {
        withCredentials: false,
        headers: authHeader()
      }
    },
    dropzoneOptions: {
      url: `${Vue.Constants.API_ROOT_URL}/data/images/0/upload.json`,
      thumbnailWidth: 150,
      maxFilesize: 0.5,
      headers: dorozone_headers,
      dictDefaultMessage:
        "<i class='material-icons' style='color:#9c27b0;font-size:5em;'>cloud_upload</i><br/> Drap or Click for replace image."
    },
    editDialog: {
      show: false,
      image: {},
      share: false,
      showConfirmDialog: false
    },
    uploadDialog: { show: false, share: true, url: null, exist: false },
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
      this.imgs = [
        {
          title: image.name,
          src: this.get_image_url(image)
        }
      ];
      this.visible = true;
    },
    edit(image) {
      this.editDialog.image = image;
      if (image.imageLink != null)
        this.editDialog.share = image.imageLink.publicShared;
      else this.editDialog.share = false;
      this.editDialog.showConfirmDialog = false;
      this.editDialog.show = true;
    },
    send_file_dropzone(file, xhr, formData) {
      formData.append("imageId", this.editDialog.image.imageId);
      formData.append("shared", this.editDialog.share);
    },
    upload_success_dropzone(file, response){
      console.log( response );
      this.editDialog.show = false;
      refersh();
    },
    delete_image(image) {
      this.editDialog.showConfirmDialog = true;
    },
    share_or_unshare_image() {
      let _url = `${Vue.Constants.API_ROOT_URL}/data/images/${this.editDialog.image.imageId}/share.json`;
      if (!this.editDialog.share)
        _url = `${Vue.Constants.API_ROOT_URL}/data/images/${this.editDialog.image.imageId}/unshare.json`;
      const loader = this.$loading.show({});
      const toast = this.$toasted;
      const $this = this;

      axios({
        url: _url,
        method: "post",
        data: JSON.stringify({}),
        headers: headers
      })
        .then(response => {
          const data = response.data;
          $this.editDialog.image = data;
        })
        .catch(error => {
          if (
            error.config.hasOwnProperty("errorHandle") &&
            error.config.errorHandle === false
          ) {
            return Promise.reject(error);
          }
          const data = error.response.data;
          if (data.error) {
            $this.editDialog.share = !$this.editDialog.share;
            toast.error(data.error.message, { icon: "error" }).goAway(2000);
          }
        })
        .finally(() => loader.hide());
    },
    confirm_delete_iamge() {
      var $this = this;
      if ($this.editDialog.image.imageId > 0) {
        $this.editDialog.showConfirmDialog = false;
        let loader = this.$loading.show({});
        axios({
          url: `${Vue.Constants.API_ROOT_URL}/data/images/${this.editDialog.image.imageId}/delete.json`,
          method: "post",
          data: JSON.stringify({}),
          headers: headers
        })
          .then(response => {
            var data = response.data;
            $this.editDialog.show = false;
            $this.refresh();
          })
          .then(function() {
            loader.hide();
          });
      }
    },
    reset_upload_by_url() {
      this.uploadDialog.share = true;
      this.uploadDialog.url = null;
      this.uploadDialog.exist = false;
      this.uploadDialog.show = true;
    },
    open_upload_by_url() {
      this.reset_upload_by_url();
      this.uploadDialog.show = true;
    },
    do_upload_by_url() {
      var $this = this;
      let loader = this.$loading.show({});
      axios({
        url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/images/0/upload_by_url.json`,
        method: "post",
        data: JSON.stringify({
          imageUrl: this.uploadDialog.url,
          share: this.uploadDialog.share
        }),
        headers: headers
      })
        .then(response => {
          var data = response.data;
          $this.reset_upload_by_url();
        })
        .then(function() {
          loader.hide();
        });
    },
    onImageExist() {
      if (this.uploadDialog.url != null) this.uploadDialog.exist = true;
    },
    handleHide() {
      this.visible = false;
    },
    handleFilePondInit: function() {
      // FilePond instance methods are available on `this.$refs.pond`
      /* eslint-disable */
      console.log("FilePond has initialized");
    },
    handleFilePondProcess() {
      console.log("FilePond processed.");
      this.refresh();
      this.myFiles = [];
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
    getImages() {
      var $this = this;
      let loader = this.$loading.show({});
      axios({
        url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/images/list.json?fields=link`,
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
  watch: {
    'editDialog.share': function(newValue, oldValue){
      if( this.editDialog.show && this.editDialog.image.imageLink != null ){
        if( this.editDialog.image.imageLink.publicShared!=newValue) {
          console.log( oldValue + ' share change ---> ' + this.editDialog.share);
          this.share_or_unshare_image();
        }
      }else if (this.editDialog.show && this.editDialog.image.imageLink == null){
        console.log(oldValue + ' share chang ---> ' + newValue);
        this.share_or_unshare_image();
      } 
    }
  },
  mounted() {
    this.getImages();
  }
};
</script>
<style lang="scss" scoped>
.images-page .page-header {
  height: 60vh;
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

.image .md-card-media figure {
  margin: 0 !important;
  line-height: 0px;
  text-align: center;
}

.image-preview {
  height: 200px;
}

.vertical-center {
  display: flex;
  align-items: center;
}
.flex-column {
  display: flex;
  flex-direction: column;
}
.md-checkbox,
.md-radio {
  display: flex;
  margin: 0;
  margin-bottom: 0.5rem;
}
.md-dialog {
  z-index: 9999;
}
</style>
