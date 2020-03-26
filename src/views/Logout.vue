<template>
  <div class="wrapper">
    Logout
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {};
  },
  methods: {
    ...mapActions("accounts", ["login", "logout"]),
    doLogout: function() {
      this.logout();
    }
  },
  created: function() {
    this.logout();
    this.$router.push("/");
  }
};
</script>
