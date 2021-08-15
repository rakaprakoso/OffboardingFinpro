import React from 'react'
import { Formik, Field, Form } from 'formik'
import axios from 'axios'

const ResignForm = () => {
    return (
        <div className="page-wrapper py-20">
            <Formik
                initialValues={{
                    employeeName: '',
                    lastName: '',
                    email: '',
                }}
                onSubmit={async (values) => {
                    console.log(values);
                    // await new Promise((r) => setTimeout(r, 500));
                    // alert(JSON.stringify(values, null, 2));
                    const formData = new FormData();
                    formData.append('employeeNameIn', values.employeeName);

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

                    <label htmlFor="lastName">Last Name</label>
                    <Field id="lastName" name="lastName" placeholder="Doe" />

                    <label htmlFor="email">Email</label>
                    <Field
                        id="email"
                        name="email"
                        placeholder="jane@acme.com"
                        type="email"
                    />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
        </div >
    )
}

export default ResignForm
