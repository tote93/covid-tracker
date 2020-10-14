import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "../axios";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    points: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLiness: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState([]);
  const buildChartData = (data, casesType) => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/historical/all?lastdays=120");
      const chartData = buildChartData(response.data, casesType);
      setData(chartData);
    };
    fetchData();
  }, [casesType]);

  return (
    <div>
      <Line
        options={options}
        data={{
          datasets: [
            {
              backgroundColor: "rgba(204,16,52,0.4)",
              borderColor: "#CC1034",
              data: data,
            },
          ],
        }}
      />
    </div>
  );
}

export default LineGraph;
