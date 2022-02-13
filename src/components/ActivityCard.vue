<template>
  <div class="container">
    <div class="title-sequence">
      <h2 class="title">{{ data.activityName }}</h2>
      <h3 class="subtitle">
        {{ new Date(data.originalStartTime).toLocaleString() }}
      </h3>
    </div>
    <div>Duration: {{ data.originalDuration | minutes }}min</div>
    <div>Active Duration: {{ data.activeDuration | minutes }}min</div>
    <div>Distance: {{ data.distance.toFixed(2) }}mi</div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    data: Object,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
