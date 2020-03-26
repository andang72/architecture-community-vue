<template>
  <div id="material-kit">
    <div :class="{ 'nav-open': NavbarStore.showNavbar }">
      <router-view name="header" />
      <div>
        <router-view />
      </div>
      <router-view name="footer" />
    </div>
  </div>
</template>
<style>
.md-no-border,
.md-no-border > .md-tabs-navigation {
  border: 0 !important;
  border-radius: 0;
}
.md-no-shadow,
.md-no-shadow > .md-tabs-navigation {
  box-shadow: none;
}
.md-no-margin,
.md-no-margin > .md-tabs-navigation {
  margin: 0 !important;
}
.md-no-padding {
  padding: 0 !important;
}
.md-height-500 {
  height: 500px !important;
}
.md-height-550 {
  height: 550px !important;
}
.md-height-600 {
  height: 600px !important;
}
.md-margin-top-15 {
  margin-top: 15px;
}
.md-margin-top-20 {
  margin-top: 20px;
}
.md-margin-top-25 {
  margin-top: 25px;
}
.md-margin-top-30 {
  margin-top: 30px;
}
.md-margin-top-50 {
  margin-top: 50px;
}
.md-margin-top-60 {
  margin-top: 60px;
}
.md-margin-top-65 {
  margin-top: 65px;
}
.md-margin-right-10 {
  margin-right: 10px;
}
.md-margin-right-15 {
  margin-right: 15px !important;
}
.md-font-weight-300 {
  font-weight: 300 !important;
}
.md-margin-left-5 {
  margin-left: 5px !important;
}
.md-margin-bottom-5 {
  margin-bottom: 5px !important;
}
.md-margin-bottom-15 {
  margin-bottom: 15px !important;
}
.md-min-height-200 {
  min-height: 200px;
}
.md-min-height-150 {
  min-height: 150px;
}

.md-pos-abs {
  position: absolute;
}
.md-bg-color-lightgray {
  background-color: #f5f5f5;
}
.md-pos-abs.md-card-actions {
  right: 0;
  bottom: 0;
}
</style>
