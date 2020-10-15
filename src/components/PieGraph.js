import React from "react";
import { Pie } from "react-chartjs-2";

function PieGraph({ dataset, label1, label2 }) {
  const percentage = ((dataset[label1] * 100) / dataset[label2]).toFixed(2);
  const data = [percentage, (100 - percentage).toFixed(2)];
  return (
    <Pie
      data={{
        labels: [label1 + " (%)", label2 + " (%)"],
        datasets: [
          {
            data: data,
            backgroundColor: ["rgb(211, 136, 211)", "red"],
          },
        ],
      }}
      height="100%"
      width="100%"
    />
  );
}

export default PieGraph;
