import React,{useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
  } from "react-router-dom";

// components
import CardProgressRecord from "../../components/Cards/CardProgressRecord.js";
import CardSchedulerReport from "../../components/Cards/CardSchedulerReport.js";

export function DashboardScheduler() {

    let { id } = useParams();
    const [reportData, setReportData] = useState(null);

    useEffect(async () => {

        const dataFetch = await axios
            .get(`/api/reportScheduler`)
            .then(function (response) {
                console.log(response);
                // return response.data;
                return response;
            })
            .catch(function (error) {
                console.log(error);
                return 404;
            });
        if (dataFetch.status == 200) {
            setReportData(dataFetch.data);
        } else {
            setReportData(dataFetch);
        }

    }, []);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full px-4">
                    {reportData && <CardSchedulerReport data={reportData}/>}
                </div>
            </div>
        </>
    );
}
