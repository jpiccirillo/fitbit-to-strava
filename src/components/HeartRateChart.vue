<template>
  <div class="container">
    {{ heartrates }}
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: ["exercise"],
  data() {
    return {
      heartrates: [],
    };
  },
  watch: {
    exercise(exercise) {
      const { convertedStartTime: beginning, duration } = exercise;
      const end = beginning + duration;
      console.log(
        `http://localhost:3000/heartrates?size=1000&dateTimeBtwn=${beginning},${end}`
      );
      fetch(
        `http://localhost:3000/heartrates?size=1000&dateTimeBtwn=${beginning},${end}`
      )
        .then((r) => r.json())
        .then((r) => {
          console.log(r);
          this.heartrates = r.data.map(({ _source }) => ({
            bpm: _source.bpm,
            dateTime: _source.dateTime,
          }));
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
