import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("minutes", function (miliseconds) {
  return (miliseconds / 1000 / 60).toFixed(2);
});

Vue.filter("hours", function (miliseconds) {
  return (miliseconds / 1000 / 60 / 60).toFixed(2);
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
