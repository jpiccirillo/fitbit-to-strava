import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("minutes", function (miliseconds) {
  return (miliseconds / 1000 / 60).toFixed(2);
});

Vue.filter("hours", function (miliseconds) {
  return (miliseconds / 1000 / 60 / 60).toFixed(2);
});

Vue.filter("timezone", function (miliseconds) {
  miliseconds = new Date(miliseconds);
  let adjusted = miliseconds - 5 * 60 * 60 * 1000; // to central time zone
  return new Date(adjusted).toLocaleString();
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
