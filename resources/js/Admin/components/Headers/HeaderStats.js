import React from "react";

// components

import CardStats from "../Cards/CardStats.js";

export default function HeaderStats({data}) {
  return (
    <>
      {/* Header */}
      <div className="relative bg-primary md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Total Offboarding"
                  statTitle={data.total}
                //   statArrow="up"
                //   statPercent="3.48"
                //   statPercentColor="text-emerald-500"
                //   statDescripiron="Since last month"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-yellow-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Ongoing Offboarding"
                  statTitle={data.ongoing}
                //   statArrow="down"
                //   statPercent="3.48"
                //   statPercentColor="text-red-500"
                //   statDescripiron="Since last week"
                  statIconName="fas fa-tasks"
                  statIconColor="bg-blue-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Failed Offboarding"
                  statTitle={data.failed}
                //   statArrow="up"
                //   statPercent="12"
                //   statPercentColor="text-emerald-500"
                //   statDescripiron="Since last month"
                  statIconName="fas fa-times"
                  statIconColor="bg-red-600"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Turn Over Ratio"
                  statTitle={`${Math.round(data.turnoverratio)} %`}
                //   statArrow="down"
                //   statPercent="1.10"
                //   statPercentColor="text-orange-500"
                //   statDescripiron="Since yesterday"
                  statIconName="fas fa-percentage"
                  statIconColor="bg-green-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
