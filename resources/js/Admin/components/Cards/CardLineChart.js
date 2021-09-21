import React from "react";
import {Chart,registerables} from "chart.js";

export default function CardLineChart({ chartData, idName}) {
  React.useEffect(() => {
    Chart.register(...registerables);
    var config = {
      type: "line",
      data: {
        labels: chartData.name,
        datasets: [
          {
            label: new Date().getFullYear(),
            backgroundColor: "#4c51bf",
            borderColor: "#4c51bf",
            data: chartData.count,
            fill: false,
          },
        //   {
        //     label: new Date().getFullYear() - 1,
        //     fill: false,
        //     backgroundColor: "#fff",
        //     borderColor: "#fff",
        //     data: [40, 68, 86, 74, 56, 60, 87],
        //   },
        ],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: false,
          text: "Offboarding Charts",
          fontColor: "white",
        },
        legend: {
          labels: {
            fontColor: "white",
          },
          align: "end",
          position: "bottom",
        },
        tooltips: {
          mode: "index",
          intersect: false,
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },

      },
    };
    var ctx = document.getElementById("line-chart").getContext("2d");
    window.myLine = new Chart(ctx, config);
  }, []);
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase mb-1 text-xs font-semibold text-blueGray-400">
                Overview
              </h6>
              <h2 className="text-xl font-semibold text-blueGray-700">Offboarding Count</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <canvas id="line-chart"></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
