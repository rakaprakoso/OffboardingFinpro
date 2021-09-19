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
import StartOffboarding from "../../components/Forms/StartOffboarding.js";

export function CreateOffboarding() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 py-4 px-6 bg-white rounded shadow-md">
                    <StartOffboarding/>
                </div>
            </div>
        </>
    );
}
