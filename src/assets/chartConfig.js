export default {
  bindto: "#chart",
  axis: {
    x: {
      tick: {
        values: [],
      },
    },
    y: {
      label: "beats / min",
    },
  },
  legend: {
    show: false,
  },
  grid: {
    x: {
      show: true,
      lines: [
        {
          text: "Ride started",
          class: "label-5",
        },
        {
          text: "Ride ended",
          class: "label-5",
        },
      ],
    },
  },
  point: {
    show: false,
  },
  data: {
    colors: {
      bpm: "red",
    },
  },
  tooltip: { format: {} },
};
