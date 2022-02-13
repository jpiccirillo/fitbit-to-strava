<template>
  <div id="app">
    <ActivityCard :data="exercise" />
    <HeartRateChart :exercise="exercise" />
    <button @click="backOfLine" :disabled="buttonDisabled">
      Move to Back of Line
    </button>
    <button @click="getNewExercise" :disabled="buttonDisabled">Refetch</button>
  </div>
</template>

<script>
import ActivityCard from "./components/ActivityCard.vue";
import HeartRateChart from "./components/HeartRateChart.vue";
const base = `http://localhost:3000`;

export default {
  name: "App",
  components: {
    ActivityCard,
    HeartRateChart,
  },
  data() {
    return {
      exercise: {},
      buttonDisabled: false,
      id: "",
    };
  },
  methods: {
    async backOfLine() {
      this.buttonDisabled = true;
      await fetch(`${base}/exercises/${this.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backOfLine: true }),
      });
      this.buttonDisabled = false;
    },
    async getNewExercise() {
      const url = `${base}/exercises?size=1&activityName=Bike&backOfLine=false`;
      fetch(url)
        .then((r) => r.json())
        .then((r) => {
          this.exercise = r.data[0]._source;
          this.id = r.data[0]._id;
        });
    },
  },
  created() {
    this.getNewExercise();
  },
};
</script>

<style></style>
