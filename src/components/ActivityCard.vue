<template>
  <div class="container">
    <div class="title-sequence">
      <h2 class="title title-grid">
        {{ data.activityName }}
        <div class="pill" @click="copy(data.logId)">
          <span>{{ data.logId }}</span>
        </div>
        <div class="pill fitbit" @click="copy(data.logId)">
          <a
            :href="`https://fitbit.com/activities/exercise/${data.logId}`"
            target="_blank"
            ><span>Fitbit</span></a
          >
        </div>
      </h2>
      <h3 class="subtitle">
        {{ data.startTime | timezone }}
      </h3>
    </div>
    <div>Duration: {{ data.originalDuration | minutes }}min</div>
    <div>Active Duration: {{ data.activeDuration | minutes }}min</div>
    <div>Distance: {{ data.distance.toFixed(2) }}mi</div>
    <div>Speed: {{ data.speed.toFixed(2) }}mph</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    data: Object,
  },
  methods: {
    copy(text) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "absolute";
      ta.style.left = "-999999999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" scoped>
.title {
  margin-top: 0px;
  margin-bottom: 5px;
}

.subtitle {
  margin-top: 5px;
}

.container {
  padding: 15px;
  border-radius: 5px;
  border: 2px solid grey;
  max-width: max-content;

  display: grid;
  align-content: top;
  justify-content: left;
}

.pill {
  padding: 3px;
  border: solid grey 1px;
  border-radius: 5px;
  font-size: 8pt;
  font-family: monospace;
  font-weight: normal;
  width: max-content;
  cursor: pointer;
}

.fitbit {
  background-color: var(--fitbitColor);
  border-color: var(--fitbitDarker);
}

.fitbit a {
  text-decoration: none;
}

.fitbit a {
  color: var(--fitbitDarker);
}

.title-grid {
  display: grid;
  grid-template-columns: min-content min-content min-content;
  grid-template-rows: min-content;
  grid-gap: 10px;
  align-items: center;
}
</style>
