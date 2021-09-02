import React from 'react'
import axios from 'axios'
import { Switch, BrowserRouter, Route } from 'react-router-dom';

import Navbar from "../components/Navbars/AuthNavbar.js";
import Footer from "../components/Footers/Footer.js";
import EmployeeResignForm from '../components/Forms/EmployeeResignForm.js';
import PmConfirmResignForm from '../components/Forms/PmConfirmResignForm.js';
import ConfirmResignForm from '../components/Forms/ConfirmResignForm.js';
import OffboardingForm from '../components/Forms/OffboardingForm.js';

const ResignForm = () => {
    return (
        <>
            <Navbar />
            <main>
                <div class="heading bg-yellow-500 pt-32 pb-20 text-gray-50">
                    <div class="container mx-auto">
                        <h1 class="text-center text-4xl font-bold">
                            Submit Resignation Form
                        </h1>
                    </div>
                </div>
                <div className="container py-20 mx-auto">
                    <Switch>
                        <Route path="/resignform" exact component={EmployeeResignForm} />
                        <Route path="/offboarding/:id" component={OffboardingForm} />
                    </Switch>
                </div >
            </main>
            <Footer />
        </>
    )
}

export default ResignForm
