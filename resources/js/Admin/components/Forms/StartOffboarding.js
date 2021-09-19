import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';
import { isNull } from 'lodash';
import { IoTrashBin } from "react-icons/io5";

import * as Yup from 'yup';
const OffboardingSchema = Yup.object().shape({
    employeeID: Yup.string()
        .required('Required').nullable(),
    type: Yup.string()
        .required('Required').nullable(),
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});
export default function StartOffboarding() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    return (
        <>
            <h2 className="text-2xl font-bold">New Offboarding</h2>
            <hr className="mb-3" />
            <Formik
                initialValues={{
                    employeeID: '',
                    type: '',
                    effectiveDate: '',
                    accept: false,
                }}
                validationSchema={OffboardingSchema}
                onSubmit={async (values) => {
                    setIsOpen(true);
                    const formData = new FormData();
                    formData.append('employeeID', values.employeeID);
                    formData.append('type', values.type);
                    formData.append('effective_date', values.effectiveDate);
                    formData.append('admin', 'true');

                    const res = await axios.post('/api/resignform', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(res.data);
                    setSubmitted(true)
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <label htmlFor="employeeID">Employee ID</label>
                        <Field id="employeeID" name="employeeID" placeholder="Employee ID" />
                        {errors.employeeID && touched.employeeID ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.employeeID}</div>
                        ) : null}

                        <label htmlFor="type">Type Offboarding</label>
                        <Field as="select" name="type">
                            <option value="" disabled>Select type offboarding</option>
                            <option value="e101">Pensiun Usia</option>
                            <option value="e102">Pensiun Dini</option>
                            <option value="e103">Meninggal Dunia</option>
                            <option value="e201">Pengunduran Diri</option>
                            <option value="e301">Pemberhentian Tidak Hormat (Belum Pernah)</option>
                            <option value="e302">Pemberhentian Bukan Atas Permintaan</option>
                            <option value="e303">Karyawan yang didiskualifikasi mengundurkan diri (Belum Pernah)</option>
                        </Field>
                        {errors.type && touched.type ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.type}</div>
                        ) : null}

                        <label htmlFor="effectiveDate">Effective Date</label>
                        <Field type="date" id="effectiveDate" name="effectiveDate" />
                        {errors.effectiveDate && touched.effectiveDate ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.effectiveDate}</div>
                        ) : null}

                        {errors.status && touched.status ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.status}</div>
                        ) : null}
                        <label className="mb-4">
                            <Field type="checkbox" name="accept" className="my-0 mr-2" />
                            Accept, declare it's true
                        </label>
                        {errors.accept && touched.accept ? (
                            <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                        ) : null}

                        <button type="submit" className="bg-primary text-white">Submit</button>
                    </Form>
                )}
            </Formik>
            <ManagerModal
                openModal={isOpen}
                submitted={submitted}
                stateChanger={setIsOpen}
            />
        </>

    );
}

