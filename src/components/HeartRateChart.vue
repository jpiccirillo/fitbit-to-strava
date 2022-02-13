<template>
  <div class="container">
    <div id="chart"></div>
  </div>
</template>

<script>
import c3 from "c3";
import staticConfiguration from "../assets/chartConfig.js";
import { mergeDeep } from "../helpers/index.js";

export default {
  name: "HeartRateChart",
  props: ["exercise"],
  data() {
    return {
      heartrates: [],
    };
  },
  watch: {
    exercise(exercise) {
      const buffer = 5 * 1000 * 60;
      let { convertedStartTime: beginning, duration } = exercise;
      const end = beginning + duration;
      const buff_begin = beginning - buffer;
      const buff_end = end + buffer;
      const url = `http://localhost:3000/heartrates?size=10000&dateTimeBtwn=${buff_begin},${buff_end}`;

      fetch(url)
        .then((r) => r.json())
        .then((r) => {
          this.heartrates = r.data.map(({ _source }) => ({
            bpm: _source.bpm,
            dateTime: _source.dateTime,
          }));
          return this.heartrates;
        })
        .then(() => {
          staticConfiguration.grid.x.lines[0].value = beginning;
          staticConfiguration.grid.x.lines[1].value = end;
          staticConfiguration.tooltip.format.title = (mouse) => {
            const { timezone: t, minutes: m } = this.$options.filters;
            const howFarThru = new Date(t(mouse)) - new Date(t(beginning));
            return m(howFarThru) + "min";
          };
          const exerciseSpecificConfig = {
            data: {
              x: "x",
              columns: [
                ["x", ...this.heartrates.map((r) => r.dateTime)],
                ["bpm", ...this.heartrates.map((r) => r.bpm)],
              ],
            },
          };
          c3.generate(
            mergeDeep({}, exerciseSpecificConfig, staticConfiguration)
          );
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  padding-top: 30px;
}
</style>
