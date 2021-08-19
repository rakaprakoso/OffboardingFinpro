import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats.js";
import FooterAdmin from "../components/Footers/FooterAdmin.js";
import Home from '../pages/product/Home';
import Modify from '../pages/product/Modify';

// // views

import Dashboard from "../views/admin/Dashboard.js";
// import Maps from "views/admin/Maps.js";
// import Settings from "views/admin/Settings.js";
// import Tables from "views/admin/Tables.js";

export default function Admin() {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100 min-h-screen flex flex-col">
                <AdminNavbar />

                <HeaderStats />

                <div className="px-4 md:px-10 mx-auto w-full -mt-24 flex flex-col z-10">
                    <Switch>
                        <Route path="/admin/dashboard" exact component={Dashboard} />
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
