import React, { useState, useEffect } from "react";

// components

import CardLineChart from "../../components/Cards/CardLineChart.js";
import CardTable from "../../components/Cards/CardTable.js";
import CardBarChart from "../../components/Cards/CardBarChart.js";
import CardPageVisits from "../../components/Cards/CardPageVisits.js";
import CardSocialTraffic from "../../components/Cards/CardSocialTraffic.js";
import CardBarChartType from "../../components/Cards/CardBarChartType.js";

export default function Dashboard() {
    const [offboardingData, setOffboardingData] = useState(null);
    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/offboardingstatus?type=progress`)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                return 404;
            });
        if (dataFetch.status == 200) {
            setOffboardingData(dataFetch.data);
        } else {
            setOffboardingData(dataFetch);
        }
    }, [])
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full xl:w-4/12 mb-12 xl:mb-0 px-4">
                {offboardingData ? <CardLineChart idName="months" chartData={offboardingData && offboardingData?.months} /> : null}

                </div>
                <div className="w-full xl:w-4/12 mb-12 xl:mb-0 px-4">
                    {offboardingData ? <CardBarChart idName="progress" chartData={offboardingData && offboardingData?.progress} /> : null}
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    {offboardingData ? <CardBarChartType idName="type" chartData={offboardingData && offboardingData?.type} /> : null}
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full mb-12 xl:mb-0 px-4">
                    <CardTable />
                </div>
            </div>
            {/* <div className="flex flex-wrap mt-4">
                <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4">
                    <CardPageVisits />
                </div>
                <div className="w-full xl:w-4/12 px-4">
                    <CardSocialTraffic />
                </div>
            </div>
            <h1>Raka</h1> */}
        </>
    );
}
