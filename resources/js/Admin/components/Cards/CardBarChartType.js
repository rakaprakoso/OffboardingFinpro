import React, { useState, useEffect } from "react";
import { Chart, registerables } from "chart.js";

export default function CardBarChartType({ chartData, idName }) {
    const [countOffboardingData, setCountOffboardingData] = useState(null);

    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

    React.useEffect(async () => {
        var color = [];
        chartData?.name.forEach(element => {
            color.push(randomRGB())
        });
        Chart.register(...registerables);
        const data = {
            labels: chartData?.name,
            datasets: [{
                label: 'Offboarding Type',
                data: chartData?.count,
                backgroundColor: color,
                hoverOffset: 4
            }],
        }
        const config = {
            type: 'doughnut',
            data: data,
            options: {
                maintainAspectRatio: false,
                responsive: true,
            }
        };
        let ctx = document.getElementById(`bar-chart-${idName}`).getContext("2d");
        window.myBar = new Chart(ctx, config);
    }, []);

    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full max-w-full flex-grow flex-1">
                            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                                Total
                            </h6>
                            <h2 className="text-blueGray-700 text-xl font-semibold">
                                Offboarding Type
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex-auto">
                    {/* Chart */}
                    <div className="relative h-350-px">
                        <canvas id={`bar-chart-${idName}`}></canvas>
                    </div>
                </div>
            </div>
        </>
    );
}
