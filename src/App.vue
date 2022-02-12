<template>
  <div id="app">
    <ActivityCard :data="exercise" />
    <HeartRateChart :exercise="exercise" />
  </div>
</template>

<script>
import ActivityCard from "./components/ActivityCard.vue";
import HeartRateChart from "./components/HeartRateChart.vue";

export default {
  name: "App",
  components: {
    ActivityCard,
    HeartRateChart,
  },
  data() {
    return {
      exercise: {},
    };
  },
  created() {
    fetch("http://localhost:3000/exercises?size=1")
      .then((r) => r.json())
      .then((r) => {
        this.exercise = r.data[0]._source;
      });
  },
};
</script>

<style></style>
