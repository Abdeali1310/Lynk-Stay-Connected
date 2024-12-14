/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },

  cutout: 120,
};

const labels = getLast7Days();

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: "#dfb3f2",
        borderColor: "#9f19d7",
      },
    ],
  };
  return <Line data={data} options={lineChartOptions} />;
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: ["magenta", "blue"],
        hoverBackgroundColor: ["purple", "darkblue"],
        borderColor: ["magenta", "navy"],
        offset: 20,
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      options={doughnutChartOptions}
      style={{ zIndex: 10 }}
    />
  );
};

export { LineChart, DoughnutChart };
