import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import Navbar from "../components/Navbars/AuthNavbar.js";
import Footer from "../components/Footers/Footer.js";
import EmployeeResignForm from '../components/Forms/EmployeeResignForm.js';
import ConfirmResignForm from '../components/Forms/ConfirmResignFormDisabled.js';
import OffboardingForm from '../components/Forms/OffboardingForm.js';
import StartOffboarding from '../components/Forms/StartOffboarding.js';
import OffboardingEmployee from '../components/Forms/OffboardingEmployee.js';


const ResignForm = () => {
    return (
        <>
            <Navbar />
            <main>
                <div className="heading bg-yellow-500 pt-32 pb-20 text-gray-50">
                    <div className="container mx-auto">
                        <h1 className="text-center text-4xl font-bold">
                            Offboarding
                        </h1>
                    </div>
                </div>
                <div className="w-full px-2 py-3 navbar-expand-lg">
                    <div className="container px-4 py-20 mx-auto items-center justify-between">
                        <Switch>
                            <Route path="/resignform" exact component={EmployeeResignForm} />
                            <Route path="/newOffboarding" exact component={StartOffboarding} />
                            <Route path="/offboarding/:id" exact component={OffboardingForm} />
                            <Route path="/offboarding/employee/:id" component={OffboardingEmployee} />
                            <Route path="/exitDocument" component={Folder} />
                            <Route path="/exitClearance" component={FolderClearance} />
                        </Switch>
                    </div >

                </div>
            </main>
            <Footer />
        </>
    )
}

const Folder = () => {
    const [data, setData] = useState(null);
    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/exitDocument`)
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        setData(dataFetch)
    }, [])
    return (
        <>
            <h2 className="text-2xl font-bold">Template Document Exit Form</h2>
            <p className="text-justify">Download file terkait</p>
            <hr className="mb-3" />
            {data && data.map((item) => (
                <a
                    download
                    href={item.file}
                    className="text-lightBlue-500 text-lg border rounded p-5 block my-3"
                >
                    <i className="fas fa-file mr-2 text-xs"></i>
                    Download - {item.name}
                </a>
            ))
            }
        </>
    )
}
const FolderClearance = () => {
    const [data, setData] = useState(null);
    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/exitDocument?clearance=true`)
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        setData(dataFetch)
    }, [])
    return (
        <>
            <h2 className="text-2xl font-bold">Template Document Clearance Form</h2>
            <p className="text-justify">Download file terkait</p>
            <hr className="mb-3" />
            {data && data.map((item) => (
                <a
                    download
                    href={item.file}
                    className="text-lightBlue-500 text-lg border rounded p-5 block my-3"
                >
                    <i className="fas fa-file mr-2 text-xs"></i>
                    Download - {item.name}
                </a>
            ))
            }
        </>
    )
}

export default ResignForm
