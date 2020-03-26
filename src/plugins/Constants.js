// =========================================================
// * Globals Constants
// =========================================================
let Constants = {
  //  install
  install(Vue, options) {
    //  create global Constants
    Vue.Constants = {
      BUCKET: "s3-custom-images",
      VERSION: 1.0,
      API_ROOT_URL: "http://192.168.29.192"
      //API_ROOT_URL: "http://localhost:8080"
    };
  }
};
export default Constants;
