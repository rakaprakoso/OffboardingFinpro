import React from 'react'
import { Formik, Field, Form } from 'formik'
import axios from 'axios'

import Navbar from "../components/Navbars/AuthNavbar.js";
import Footer from "../components/Footers/Footer.js";

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
                    <Formik
                        initialValues={{
                            employeeName: '',
                            employeeID: '',
                            reason: '',
                            resignLetter: '',
                        }}
                        onSubmit={async (values) => {
                            console.log(values);
                            // await new Promise((r) => setTimeout(r, 500));
                            // alert(JSON.stringify(values, null, 2));
                            const formData = new FormData();
                            formData.append('employeeNameIn', values.employeeName);
                            formData.append('employeeIDIn', values.employeeID);

                            // // Post the form, just make sure to set the 'Content-Type' header
                            const res = await axios.post('/api/resignform', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            // // Prints "yinyang.png"
                            console.log(res.data);
                        }}
                    >
                        <Form>
                            <label htmlFor="employeeName">Employee Name</label>
                            <Field id="employeeName" name="employeeName" placeholder="Employee Name" />

                            <label htmlFor="employeeID">Employee ID</label>
                            <Field id="employeeID" name="employeeID" placeholder="Employee ID" />

                            <label htmlFor="reason">Resign Reason</label>
                            <Field id="reason" type="textarea" name="reason" placeholder="Resign Reason" />

                            <label htmlFor="file">Resign Letter</label>
                            <input id="file" name="file" type="file" placeholder="Resign Reason"
                                onChange={(event) => {
                                    setFieldValue("file", event.currentTarget.files[0]);
                                }}
                            />

                            <button type="submit">Submit</button>
                        </Form>
                    </Formik>
                </div >
            </main>
            <Footer />
        </>
    )
}

export default ResignForm
