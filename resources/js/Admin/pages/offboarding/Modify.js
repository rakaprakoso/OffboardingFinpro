import React,{useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
  } from "react-router-dom";

// components

import CardSettings from "../../components/Cards/CardSettings.js";
import CardProfile from "../../components/Cards/CardProfile.js";
import CardEmployee from "../../components/Cards/CardEmployee.js";

export function Modify() {

    let { id } = useParams();
    const [offboardingData, setOffboardingData] = useState(null);

    useEffect(async () => {

        const dataFetch = await axios
            .get(`/api/offboarding/${id}`)
            .then(function (response) {
                console.log(response);
                // return response.data;
                return response;
            })
            .catch(function (error) {
                return 404;
                console.log(error);
            });
        // console.log(dataFetch.cartSession[5]);
        // setRawData(dataFetch);
        if (dataFetch.status == 200) {
            setOffboardingData(dataFetch.data);
        } else {
            setOffboardingData(dataFetch);
        }

    }, []);
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                    {offboardingData && <CardEmployee data={offboardingData} />}
                </div>
                <div className="w-full lg:w-6/12 px-4">
                    {offboardingData && <CardSettings data={offboardingData} />}
                </div>
            </div>
        </>
    );
}
