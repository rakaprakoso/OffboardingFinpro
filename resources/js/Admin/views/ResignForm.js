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
                            effectiveDate: '',
                        }}
                        onSubmit={async (values) => {
                            // console.log(values);
                            const formData = new FormData();
                            // await new Promise((r) => setTimeout(r, 500));
                            // alert(JSON.stringify(values, null, 2));
                            formData.append('employeeNameIn', values.employeeName);
                            formData.append('employeeIDIn', values.employeeID);
                            formData.append('reason', values.reason);
                            formData.append('effective_date', values.effectiveDate);
                            formData.append('process_type', 1);
                            formData.append("resign_letter", values.resignLetter);
                            console.log(formData);
                            // // Post the form, just make sure to set the 'Content-Type' header
                            const res = await axios.post('/api/resignform', formData, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            });

                            console.log(res.data);
                        }}
                    >
                        {(formProps) => (
                            <Form>
                                {/* <label htmlFor="employeeName">Employee Name</label>
                            <Field id="employeeName" name="employeeName" placeholder="Employee Name" /> */}

                                <label htmlFor="employeeID">Employee ID</label>
                                <Field id="employeeID" name="employeeID" placeholder="Employee ID" />

                                <label htmlFor="reason">Resign Reason</label>
                                <Field id="reason" type="textarea" name="reason" placeholder="Resign Reason" />

                                <label htmlFor="effectiveDate">Effective Date</label>
                                <Field type="date" id="effectiveDate" name="effectiveDate" />

                                <label htmlFor="resignLetter">Resign Letter</label>
                                <input id="resignLetter" name="resignLetter" type="file" placeholder="Resign Letter"
                                    onChange={(event) => {
                                        formProps.setFieldValue("resignLetter", event.target.files[0]);
                                    }}
                                />
                                <button type="submit">Submit</button>
                            </Form>


                        )}
                    </Formik>
                </div >
            </main>
            <Footer />
        </>
    )
}

export default ResignForm
