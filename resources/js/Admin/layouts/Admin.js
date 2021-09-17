import React, { useEffect, useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";
import Home from '../pages/product/Home';
import Modify from '../pages/product/Modify';
import {Modify as ModifyOffboarding} from '../pages/offboarding/Modify';

// // views

import Dashboard from "../views/admin/Dashboard.js";
import Settings from "../views/admin/Settings.js";
// import Maps from "views/admin/Maps.js";
// import Tables from "views/admin/Tables.js";

export default function Admin() {

    const [countOffboardingData, setCountOffboardingData] = useState(null);

    useEffect(async () => {

        const dataFetch = await axios
            .get(`/api/offboardingstatus`)
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
            setCountOffboardingData(dataFetch.data);
        } else {
            setCountOffboardingData(dataFetch);
        }

    }, []);

    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100 min-h-screen flex flex-col">
                <AdminNavbar />
                { countOffboardingData &&
                    <HeaderStats data={countOffboardingData}/>
                }

                <div className="px-4 md:px-10 mx-auto w-full -mt-24 flex flex-col z-10">
                    <Switch>
                        <Route path="/admin" exact component={Dashboard} />
                        <Route path="/admin/offboarding/:id?/:method?" exact component={ModifyOffboarding} />
                        <Route path="/admin/product/" exact component={Home} />
                        <Route path="/admin/product/:method/:id?" exact component={Modify} />
                        {/* <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Redirect from="/admin" to="/admin/dashboard" /> */}
                    </Switch>
                </div>
                <FooterAdmin />
            </div>
        </>
    );
}
