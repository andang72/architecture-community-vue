<template>
  <div class="wrapper">
    <parallax class="section page-header header-filter" :style="headerStyle">
      <div class="container">
        <div class="md-layout">
          <div
            class="md-layout-item md-size-50 md-small-size-70 md-xsmall-size-100"
          >
            <h1 class="title">Your Story Starts With Us.</h1>
            <h4>
              Every landing page needs a small description after the big bold
              title, that's why we added this text here. Add here all the
              information that can make you or your product create the first
              impression.
            </h4>
            <br />
            <md-button
              class="md-rose md-just-icon md-round md-margin-right-15"
              @click="edit"
              ><md-icon>add</md-icon></md-button
            >
            <md-button class="md-rose md-just-icon md-round" @click="refresh"
              ><md-icon>refresh</md-icon></md-button
            >
          </div>
        </div>
      </div>
    </parallax>
    <div class="main main-raised">
      <div class="section">
        <div class="container">
          <div class="features text-center"></div>
        </div>

        <!-- posts -->
        <div class="container-fluid">
          <masonry
            :cols="{ default: 4, 1000: 3, 700: 2, 400: 1 }"
            :gutter="{ default: '30px', 700: '15px' }"
          >
            <div v-for="(post, index) in posts" :key="index">
              <md-card class="post">
                <md-card-media v-if="post.coverImgSrc != null">
                  <md-ripple>
                    <img
                      :src="
                        post.coverImgSrc
                          ? get_download_url(post.coverImgSrc)
                          : '@/assets/img/examples/studio-3.jpg'
                      "
                      class="Cover Image"
                      v-on:click="view(post)"
                    />
                  </md-ripple>
                </md-card-media>
                <md-card-header>
                  <div class="md-title">{{ post.rootMessage.subject }}</div>
                  <div class="md-subhead md-font-weight-300">
                    {{
                      new Date(post.modifiedDate) | moment("YYYY.MM.DD HH:mm")
                    }}
                  </div>
                </md-card-header>
                <md-card-content
                  v-html="smartTrim(post.rootMessage.body, 100)"
                ></md-card-content>
                <md-card-actions>
                  <div
                    class="author md-body-2 md-font-weight-300"
                    v-if="post.rootMessage.user != null"
                  >
                    <a href="javascript:void(0)">
                      <img
                        v-if="post.rootMessage.user != null"
                        :src="
                          get_user_avata_url(post.rootMessage.user.username)
                        "
                        class="avatar"
                        alt="Avatar"
                      />
                      <span>{{ post.rootMessage.user.name }}</span>
                    </a>
                  </div>
                  <div class="stats ml-auto">
                    <md-button v-if="post.editable" v-on:click="edit(post)"
                      >EDIT</md-button
                    >
                  </div>
                </md-card-actions>
              </md-card>
            </div>
          </masonry>
        </div>
        <!-- end posts -->
      </div>
    </div>
    <!-- view post -->
    <md-dialog
      :md-active.sync="showDialog"
      md-fullscreen
      class="md-dialog-fullwide"
    >
      <md-dialog-title>
        <md-field v-if="editable" :class="getValidationClass('post.subject')">
          <label>제목</label>
          <md-input v-model="post.subject"></md-input>
          <span class="md-helper-text">제목을 입력하세요</span>
        </md-field>
        <md-content v-if="!editable && post.rootMessage != null">
          <md-avatar>
            <img
              v-if="post.rootMessage != null"
              :src="get_user_avata_url(post.rootMessage.user.username)"
            />
          </md-avatar>
          <span class="md-caption">{{ post.rootMessage.user.name }}</span>
        </md-content>
        <md-tabs
          v-if="editable"
          class="md-primary md-no-border md-no-shadow md-no-margin md-margin-top-20"
          md-alignment="left"
          md-dynamic-height
        >
          <md-tab md-label="글쓰기" class="md-no-padding">
            <quill-editor
              v-model="post.body"
              :options="editorSettings"
              class="md-height-550"
            ></quill-editor>
          </md-tab>
          <md-tab md-label="HTML" class="md-no-padding">
            <!-- ace -->
            <ace-editor
              v-model="post.body"
              @init="init_ace_editor"
              lang="html"
              theme="chrome"
              width="100%"
              height="550"
            ></ace-editor>
            <!-- ace end -->
          </md-tab>
        </md-tabs>
        <h4 v-if="!editable && post.rootMessage != null">
          {{ post.rootMessage.subject }}
        </h4>
        <md-button
          class="md-icon-button md-dense md-round modal-default-button"
          @click="showDialog = false"
        >
          <md-icon>close</md-icon>
        </md-button>
      </md-dialog-title>
      <md-divider></md-divider>
      <md-dialog-content
        v-if="post.rootMessage != null"
        style="min-width:900px; height:100%;"
        v-html="post.rootMessage.body"
      >
      </md-dialog-content>
      <md-dialog-actions>
        <md-button
          v-if="editable"
          class="md-primary md-simple"
          @click="saveOrUpdate()"
          >Save</md-button
        >
        <md-button class="md-danger md-simple" @click="showDialog = false"
          >Close</md-button
        >
      </md-dialog-actions>
    </md-dialog>
    <!-- end view post -->
  </div>
</template>
<script>
import Vue from "vue";
import axios from "axios";

// VueMoment Install --------------------------
import VueMoment from "vue-moment";
Vue.use(VueMoment);

// VueMasonry Install --------------------------
import VueMasonry from "vue-masonry-css";
Vue.use(VueMasonry);

// VueQuillEditor Install --------------------------
import { quillEditor } from "vue-quill-editor";
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
//Vue.use("quillEditor", Quill, /* { default global options } */)
import { Quill } from "quill";
window.Quill = require("quill");
//import { ImageDrop } from "quill-image-drop-module";
//Quill.register("modules/imageDrop", ImageDrop);
//import { ImageResize } from "quill-image-resize-module";
//Quill.register("modules/imageResize", ImageResize);

// Import vue-loading-overlay  --------------------------
import Loading from "vue-loading-overlay";
// Import stylesheet
import "vue-loading-overlay/dist/vue-loading.css";
// Init plugin
Vue.use(Loading);

// Vuelidate Install --------------------------
import { validationMixin } from "vuelidate";
import {
  required,
  between,
  minLength,
  maxLength
} from "vuelidate/lib/validators";
import { isNull } from "util";
// Auth Header Helper --------------------------
import { authHeader } from "../utils";
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json"
};
Object.assign(headers, authHeader());

export default {
  bodyClass: "posts-page",
  props: {
    header: {
      type: String,
      default: require("@/assets/img/bg7.jpg")
    }
  },
  mixins: [validationMixin],
  components: {
    quillEditor,
    aceEditor: require("vue2-ace-editor")
  },
  data: () => ({
    editorSettings: {
      placeholder: "Compose an epic...",
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["blockquote", "code-block"],
            ["bold", "italic"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"]
          ],
          handlers: {
            image: function() {
              var editor = this.quill;
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.click();
              // Listen upload local image and save to server
              input.onchange = () => {
                const file = input.files[0];
                if (/^image\//.test(file.type)) {
                  const fd = new FormData();
                  fd.append("shared", true);
                  fd.append("objectType", 12);
                  fd.append("image", file);
                  axios({
                    url: `${Vue.Constants.API_ROOT_URL}/data/images/0/upload.json`,
                    method: "post",
                    headers: headers,
                    data: fd
                  }).then(response => {
                    if (response.data.error) {
                    } else {
                      var dataItems = response.data.items;
                      dataItems.forEach(function(value, index, array) {
                        // push image url to rich editor.
                        const range = editor.getSelection();
                        editor.insertEmbed(
                          range.index,
                          "image",
                          "/download/images/" + value.imageLink.linkId
                        );
                      });
                    }
                  });
                } else {
                  this.$toasted.error("You could only upload images.", {
                    icon: "error",
                    position: "bottom-center",
                    duration: 5000,
                    action: {
                      text: "Close",
                      onClick: (e, toastObject) => {
                        toastObject.goAway(0);
                      }
                    }
                  });
                }
              };
            }
          }
        },
        history: {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        }
        //imageDrop: false,
        /*imageResize: {
          displayStyles: {
            backgroundColor: "black",
            border: "none",
            color: "white"
          },
          modules: ["Resize", "DisplaySize", "Toolbar"]
        }
        */
      }
    },
    code: "console.log([\n\t1,\n\t2,\n\t5\n]);",
    editable: false,
    showDialog: false,
    posts: [],
    post: {}
  }),
  validations: {
    post: {
      subject: { required, minLength: minLength(1) },
      body: { required, minLength: minLength(1) }
    }
  },
  methods: {
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
    refresh() {
      this.posts = [];
      this.getPosts();
    },
    clear_post() {
      this.post = {
        messageId: 0,
        subject: null,
        body: null
      };
    },
    view(post) {
      var $this = this;
      if (post != null && typeof post.rootMessage !== "undefined") {
        $this.post = post;
      }
      $this.editable = false;
      $this.showDialog = true;
    },
    edit(post) {
      var $this = this;
      if (typeof post.rootMessage === "undefined") {
        $this.clear_post();
      } else {
        $this.post = post.rootMessage;
      }
      $this.editable = true;
      $this.showDialog = true;
    },
    saveOrUpdate() {
      var $this = this;
      $this.$v.$touch();
      if (!$this.$v.$invalid) {
      }
      let loader = this.$loading.show({});
      if ($this.post.messageId > 0) {
        axios({
          url: `${Vue.Constants.API_ROOT_URL}/data/streams/messages/0/update.json`,
          method: "post",
          data: JSON.stringify($this.post),
          headers: headers
        })
          .then(response => {
            $this.post = response.data;
            $this.showDialog = false;
          })
          .then(function() {
            // always executed
            loader.hide();
          });
      } else {
        axios({
          url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/threads/add.json`,
          method: "post",
          data: JSON.stringify($this.post),
          headers: headers
        })
          .then(response => {
            $this.posts.push(response.data);
            $this.showDialog = false;
          })
          .then(function() {
            // always executed
            loader.hide();
          });
      }
    },
    getPosts() {
      var $this = this;
      let loader = this.$loading.show({});
      axios({
        url: `${Vue.Constants.API_ROOT_URL}/data/streams/me/threads/list.json`,
        method: "post",
        data: JSON.stringify({}),
        headers: headers
      })
        .then(response => {
          var dataItems = response.data.items;
          dataItems.forEach(function(value, index, array) {
            var editable = false;
            if (
              value.rootMessage.user != null &&
              $this.get_current_user().userId == value.rootMessage.user.userId
            ) {
              editable = true;
            }
            value.editable = editable;
            $this.posts.push(value);
          });
        })
        .then(function() {
          // always executed
          loader.hide();
        });
    },
    smartTrim(string, maxLength) {
      if (string == null) return "";
      var trimmedString = string.substr(0, maxLength);
      return trimmedString.substr(
        0,
        Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
      );
    },
    getValidationClass(fieldName) {
      const field = this.$v[fieldName];
      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty
        };
      }
    },
    init_ace_editor: function() {
      require("brace/ext/language_tools"); //language extension prerequsite...
      require("brace/mode/html");
      require("brace/mode/javascript"); //language
      require("brace/mode/less");
      require("brace/theme/chrome");
      require("brace/snippets/javascript"); //snippet
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
    showDialog: function(newShowDialog) {
      if (this.showDialog) {
        document.documentElement.style.overflow = "hidden";
        return;
      }
      document.documentElement.style.overflow = "auto";
    }
  },
  mounted() {
    this.getPosts();
  }
};
</script>

<style lang="scss" scoped>
.posts-page .page-header {
  height: 50vh;
}
.md-card-actions.text-center {
  display: flex;
  justify-content: center !important;
}
.md-has-textarea + .md-layout {
  margin-top: 15px;
}

.md-list-item a .md-ripple p {
  font-weight: 400;
  font-size: 12px;
  margin: 0;
}
.md-card-content .md-field {
  margin-bottom: 30px;
}
.md-card-content .md-field .md-error {
  padding-top: 0px;
  right: 0;
  left: unset;
}
.section-download .md-button + .md-button {
  margin-left: 5px;
}
@media all and (min-width: 991px) {
  .btn-container {
    display: -webkit-box;
    display: flex;
  }
}

.md-card {
  min-width: 200px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
}

.md-card.post .md-card-header {
  box-shadow: none;
  margin: 0;
  border-radius: 0;
  padding: 16px;
  background-color: rgba(0, 0, 0, 0);
}
.md-card.post .md-card-actions {
  padding: 8px;
  display: flex;
  align-items: center;
  margin: 0;
  border: 0;
}

.post .md-button.md-theme-default {
  padding: 0;
  background: transparent !important;
  min-width: 88px;
  height: 36px;
  color: rgba(0, 0, 0, 0.87) !important;
  box-shadow: none;
}

.md-card.post .md-card-media img {
  cursor: pointer;
}

.md-dialog-fullwide {
  max-width: 100%;
  height: 100%;
  border-radius: 0;
  transform: none;
  z-index: 1400;
  right: 0;
  left: 0;
  top: 0;
}

.md-dialog-fullheight {
  max-height: 100%;
  height: 100%;
  border-radius: 0;
  transform: none;
  z-index: 1400;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
