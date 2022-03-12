<template>
  <div id="app">
    <ActivityCard v-if="Object.keys(exercise).length > 0" :data="exercise" />
    <HeartRateChart :exercise="exercise" />
    <button
      class="styled-button neutral"
      @click="backOfLine"
      :disabled="backofline__inflight"
    >
      Move to Back of Line
    </button>
    <button
      class="styled-button neutral"
      @click="getNewExercise"
      :disabled="refetch__inflight"
    >
      Refetch
    </button>
    <button
      class="styled-button neutral"
      @click="viewInCalendar"
      :disabled="viewCalendar__inflight"
    >
      View in Calendar
    </button>
    <button
      class="styled-button neutral"
      @click="addToCalendar"
      :disabled="addCalendar__inflight"
    >
      Add to Calendar
    </button>
    <button
      class="styled-button neutral"
      @click="createGPXHRFile"
      :disabled="addCalendar__inflight"
    >
      Create HR GPX File
    </button>
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
      viewCalendar__inflight: false,
      addCalendar__inflight: false,
      refetch__inflight: false,
      backofline__inflight: false,
      id: "",
    };
  },
  methods: {
    async backOfLine() {
      this.backofline__inflight = true;
      await fetch(`${base}/exercises/${this.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ backOfLine: true }),
      });
      this.backofline__inflight = false;
    },
    async getNewExercise() {
      this.refetch__inflight = true;
      const url = `${base}/exercises?size=1&activityName=Bike&backOfLine=false&distance=2.0`;
      const r = await fetch(url).then((r) => r.json());
      this.exercise = r.data[0]._source;
      this.id = r.data[0]._id;
      this.refetch__inflight = false;
    },
    async viewInCalendar() {
      this.viewCalendar__inflight = true;
      const url = `${base}/exercises/${this.id}/view`;
      await fetch(url);
      this.viewCalendar__inflight = false;
    },
    async addToCalendar() {
      this.addCalendar__inflight = true;
      const url = `${base}/exercises/${this.id}/add`;
      await fetch(url, { method: "POST" });
      this.addCalendar__inflight = false;
    },
    async createGPXHRFile() {
      this.addCalendar__inflight = true;
      const url = `${base}/exercises/${this.id}/combineGPX`;
      await fetch(url, { method: "POST" });
      this.addCalendar__inflight = false;
    },
  },
  created() {
    this.getNewExercise();
  },
};
</script>

<style></style>
