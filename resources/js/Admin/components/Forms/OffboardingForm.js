import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import CardEmployee from '../Cards/CardEmployee';
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';
import { isNull } from 'lodash';
import { IoTrashBin } from "react-icons/io5";

import * as Yup from 'yup';


const ConfirmDocument = Yup.object().shape({
    dept: Yup.string()
        .required('Required').nullable(),
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const ConfirmationDocument = Yup.object().shape({
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const ExitClearance = Yup.object().shape({
    dept: Yup.string()
        .required('Required').nullable(),
    // file: Yup.mixed().required('Required').test(
    //     "file",
    //     "Your video is too big :(",
    //     value => value && value.size <= 262144000
    // ),
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const OffboardingForm = () => {

    var { id } = useParams();
    let { search } = useLocation();

    const query = new URLSearchParams(search);

    const [token, setToken] = useState(false)
    const [employee, setEmployee] = useState(false)
    const [rejectEmployee, setRejectEmployee] = useState(false)
    const [data, setData] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [tracking, setTracking] = useState(false);
    const [templateData, setTemplateData] = useState(null);

    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/offboarding/${id}`)
            .then(function (response) {
                // console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

        if (dataFetch?.id) {
            setData(dataFetch);
            if (dataFetch.token == query.get('token')) {
                setToken(true);
                if (query.get('employee') == 'true') {
                    setEmployee(true);
                }
                if (query.get('tracking') == 'true') {
                    setTracking('employee');
                }
                if (query.get('approval') == 'hrmgr') {
                    setTracking('admin');
                }
                if (query.get('payroll') == 'true') {
                    setTracking('payroll');
                }
                if (query.get('process') == '3') {
                    const dataFetch = await axios
                        .get(`/api/exitDocument?clearance=true`)
                        .then(function (response) {
                            console.log(response);
                            return response.data;
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    setTemplateData(dataFetch)
                }
                if (query.get('process') == '5') {
                    setTracking('clearance');
                }
                if (query.get('rejectEmployee') == 'true') {
                    const formData = new FormData();
                    formData.append('offboardingID', id);
                    formData.append('employee', 1);
                    formData.append('status', 0);

                    formData.append('process_type', 2);
                    const res = await axios.post('/api/managerconfirmation', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                    console.log(res);
                    if (res.status == 200) {
                        setRejectEmployee(true)
                    }
                }
            } else {
                setToken(false);
            }
        } else {
            setData(null);
        }

    }, []);

    const ConfirmSchema = employee == false ?
        Yup.object().shape({
            managerID: Yup.string()
                .required('Required'),
            status: Yup.string()
                .required('Required'),
            effectiveDate: Yup.date('Invalid Date').required('Required'),
        })
        : Yup.object().shape({
            status: Yup.string()
                .required('Required')
        })

    return (
        <>
            {data == null ? "Data Not Found" : null}
            {data && token == false || null ?
                "Token Not Correct" :
                rejectEmployee && rejectEmployee == true ?
                    "Reject Success" :
                    data &&
                    <div className="row">
                        <div className="col-lg-6">
                            {
                                parseInt(data?.status) < 0 ?
                                    "Process Terminated" :
                                    parseInt(data?.status) == 1 ? (
                                        query.get('process') != 3 ? (
                                            data && data?.checkpoint.acc_svp == 1 ? 'Already Acc' :
                                                data && data?.checkpoint.acc_employee == 1 && employee ? 'Employee Already Acc' :
                                                    data && data?.checkpoint.acc_svp == 1 && !employee ? 'SVP Already Acc' :
                                                        <>
                                                            <h2 className="text-2xl font-bold">SVP Confirmation</h2>
                                                            <hr className="mb-3" />
                                                            <Formik
                                                                initialValues={{
                                                                    managerID: '',
                                                                    effectiveDate: data.effective_date,
                                                                    status: '',
                                                                }}
                                                                validationSchema={ConfirmSchema}
                                                                onSubmit={async (values) => {
                                                                    setIsOpen(true);
                                                                    const formData = new FormData();
                                                                    formData.append('offboardingID', id);
                                                                    if (employee == false) {
                                                                        formData.append('employee', 0);
                                                                        formData.append('IN_managerID', values.managerID);
                                                                        formData.append('effective_date', values.effectiveDate);
                                                                    } else {
                                                                        formData.append('employee', 1);
                                                                    }
                                                                    // formData.append('IN_managerID', values.managerID);
                                                                    // formData.append('effective_date', values.effectiveDate);
                                                                    formData.append('status', values.status);

                                                                    formData.append('process_type', 2);
                                                                    const res = await axios.post('/api/managerconfirmation', formData, {
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
                                                                        {employee == false ?
                                                                            <>
                                                                                <label htmlFor="managerID">Manager ID</label>
                                                                                <Field id="managerID" name="managerID" placeholder="Manager ID" />
                                                                                {errors.managerID && touched.managerID ? (
                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.managerID}</div>
                                                                                ) : null}

                                                                                <label htmlFor="effectiveDate">Effective Date</label>
                                                                                <Field type="date" id="effectiveDate" name="effectiveDate" />
                                                                                {errors.effectiveDate && touched.effectiveDate ? (
                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.effectiveDate}</div>
                                                                                ) : null}
                                                                            </> : null
                                                                        }
                                                                        <div id="status-radio-group" className="mb-2">Action</div>
                                                                        <div role="group" className="mb-4 block" aria-labelledby="status-radio-group">
                                                                            <label className="p-2 border rounded mr-2">
                                                                                <Field type="radio" name="status" value="1" className="my-2 mr-2" />
                                                                                Accept
                                                                            </label>
                                                                            <label className="p-2 border rounded mr-2">
                                                                                <Field type="radio" name="status" value="0" className="my-2 mr-2" />
                                                                                Reject
                                                                            </label>
                                                                        </div>
                                                                        {errors.status && touched.status ? (
                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.status}</div>
                                                                        ) : null}
                                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                                    </Form>
                                                                )}
                                                            </Formik>
                                                        </>
                                        ) : "Still waiting document verification"
                                    ) :
                                        parseInt(data?.status) == 2 ? "Already Acc process 2" :
                                            parseInt(data?.status) == -2 ? "Declined" :
                                                parseInt(data?.status) == 0 ? "Still Waiting Document Verification" :
                                                    parseInt(data?.status) >= 3 ? (
                                                        query.get('approval') == 'hrmgr' ?
                                                            <>
                                                                <h2 className="text-2xl font-bold">HR Manager Approval</h2>
                                                                <hr className="mb-3" />
                                                                <Formik
                                                                    initialValues={{
                                                                        accept: false,
                                                                    }}
                                                                    validationSchema={ConfirmationDocument}
                                                                    onSubmit={async (values) => {
                                                                        setIsOpen(true);
                                                                        const formData = new FormData();
                                                                        formData.append('offboardingID', id);
                                                                        formData.append('hrmgr', 1);
                                                                        formData.append('status', 1);
                                                                        formData.append('process_type', 2);
                                                                        const res = await axios.post('/api/managerconfirmation', formData, {
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
                                                                            <label className="mb-4">
                                                                                <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                Approve
                                                                            </label>
                                                                            {errors.accept && touched.accept ? (
                                                                                <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                            ) : null}
                                                                            <button type="submit" className="bg-primary text-white">Submit</button>
                                                                        </Form>
                                                                    )}
                                                                </Formik>
                                                            </>
                                                            :
                                                            query.get('process') == 3 ?
                                                                query.get('exitInterview') == 'true' ?
                                                                    <>
                                                                        <h2 className="text-2xl font-bold">Exit Interview Document</h2>
                                                                        <hr className="mb-3" />
                                                                        <Formik
                                                                            initialValues={{
                                                                                type: '',
                                                                                exit_interview_form: '',
                                                                                note_procedure: '',
                                                                                opers: '',
                                                                                accept: false,
                                                                            }}
                                                                            validationSchema={ConfirmationDocument}
                                                                            onSubmit={async (values) => {
                                                                                // setTimeout(() => {
                                                                                //     alert(JSON.stringify(values, null, 2));
                                                                                // }, 500)
                                                                                setIsOpen(true);
                                                                                const formData = new FormData();
                                                                                formData.append('offboardingID', id);
                                                                                formData.append('type', 'exitinterview');
                                                                                formData.append('dept', 'hrbp');
                                                                                formData.append('exit_interview_form', values.exit_interview_form);
                                                                                formData.append('note_procedure', values.note_procedure);
                                                                                formData.append("opers", values.opers);
                                                                                const res = await axios.post('/api/requestdocument', formData, {
                                                                                    headers: {
                                                                                        'Content-Type': 'multipart/form-data'
                                                                                    }
                                                                                }).then(response => {
                                                                                    console.log(response)
                                                                                    return response
                                                                                }).catch(error => {
                                                                                    // console.log(error.response)
                                                                                    // setSubmitted(true)
                                                                                    return error.response
                                                                                });
                                                                                console.log(res.data);
                                                                                if (res.status == '200') {
                                                                                    setSubmitted(true)
                                                                                } else {
                                                                                    setSubmitted(false)
                                                                                }
                                                                            }}
                                                                            render={({ values, errors, touched, setFieldValue }) => (
                                                                                <Form>
                                                                                    <label htmlFor="exit_interview_form">Exit Interview Form</label>
                                                                                    <input id="exit_interview_form" name="exit_interview_form" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("exit_interview_form", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.exit_interview_form && touched.exit_interview_form ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.exit_interview_form}</div>
                                                                                    ) : null}

                                                                                    <label htmlFor="note_procedure">Note Procedure</label>
                                                                                    <input id="note_procedure" name="note_procedure" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("note_procedure", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.note_procedure && touched.note_procedure ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.note_procedure}</div>
                                                                                    ) : null}

                                                                                    <label htmlFor="opers">Change Opers</label>
                                                                                    <input id="opers" name="opers" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("opers", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.opers && touched.opers ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.opers}</div>
                                                                                    ) : null}

                                                                                    <label className="mb-4 block">
                                                                                        <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                        Saya menyetujui data yang dikirimkan adalah benar
                                                                                    </label>
                                                                                    {errors.accept && touched.accept ? (
                                                                                        <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                                    ) : null}
                                                                                    <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                </Form>
                                                                            )}
                                                                        />
                                                                    </> :
                                                                    query.get('cv') == 'true' ?
                                                                    <>
                                                                        <h2 className="text-2xl font-bold">Upload CV</h2>
                                                                        <hr className="mb-3" />
                                                                        <Formik
                                                                            initialValues={{
                                                                                cv: '',
                                                                            }}
                                                                            validationSchema={ConfirmationDocument}
                                                                            onSubmit={async (values) => {
                                                                                setIsOpen(true);
                                                                                const formData = new FormData();
                                                                                formData.append('offboardingID', id);
                                                                                formData.append('type', 'cv');
                                                                                formData.append('cv', values.cv);
                                                                                const res = await axios.post('/api/requestdocument', formData, {
                                                                                    headers: {
                                                                                        'Content-Type': 'multipart/form-data'
                                                                                    }
                                                                                }).then(response => {
                                                                                    console.log(response)
                                                                                    return response
                                                                                }).catch(error => {
                                                                                    // console.log(error.response)
                                                                                    // setSubmitted(true)
                                                                                    return error.response
                                                                                });
                                                                                console.log(res.data);
                                                                                if (res.status == '200') {
                                                                                    setSubmitted(true)
                                                                                } else {
                                                                                    setSubmitted(false)
                                                                                }
                                                                            }}
                                                                            render={({ values, errors, touched, setFieldValue }) => (
                                                                                <Form>
                                                                                    <label htmlFor="cv">CV</label>
                                                                                    <input id="cv" name="cv" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("cv", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.cv && touched.cv ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.cv}</div>
                                                                                    ) : null}
                                                                                    <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                </Form>
                                                                            )}
                                                                        />
                                                                    </> :
                                                                    query.get('document') == 'true' ?
                                                                        <>
                                                                            <h2 className="text-2xl font-bold">Document Exit Form (PL)</h2>
                                                                            <p className="text-justify">Cek outstanding per divisi</p>
                                                                            <hr className="mb-3" />
                                                                            <Formik
                                                                                initialValues={{
                                                                                    type: '',
                                                                                    pl: '',
                                                                                    paklaring: '',
                                                                                    termination_letter: '',
                                                                                    accept: false,
                                                                                }}
                                                                                validationSchema={ConfirmationDocument}
                                                                                onSubmit={async (values) => {
                                                                                    // setTimeout(() => {
                                                                                    //     alert(JSON.stringify(values, null, 2));
                                                                                    // }, 500)
                                                                                    setIsOpen(true);
                                                                                    const formData = new FormData();
                                                                                    formData.append('offboardingID', id);
                                                                                    formData.append('type', 'PL');
                                                                                    formData.append('dept', 'hrss');
                                                                                    formData.append('pl', values.pl);
                                                                                    formData.append('paklaring', values.paklaring);
                                                                                    formData.append("termination_letter", values.termination_letter);
                                                                                    const res = await axios.post('/api/requestdocument', formData, {
                                                                                        headers: {
                                                                                            'Content-Type': 'multipart/form-data'
                                                                                        }
                                                                                    }).then(response => {
                                                                                        console.log(response)
                                                                                        return response
                                                                                    }).catch(error => {
                                                                                        // console.log(error.response)
                                                                                        // setSubmitted(true)
                                                                                        return error.response
                                                                                    });
                                                                                    console.log(res.data);
                                                                                    if (res.status == '200') {
                                                                                        setSubmitted(true)
                                                                                    } else {
                                                                                        setSubmitted(false)
                                                                                    }
                                                                                }}
                                                                                render={({ values, errors, touched, setFieldValue }) => (
                                                                                    <Form>
                                                                                        <label htmlFor="pl">PL</label>
                                                                                        <input id="pl" name="pl" type="file" placeholder="Attachment"
                                                                                            onChange={(event) => {
                                                                                                setFieldValue("pl", event.target.files[0]);
                                                                                            }}
                                                                                        />
                                                                                        {errors.pl && touched.pl ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.pl}</div>
                                                                                        ) : null}

                                                                                        <label htmlFor="paklaring">Paklaring</label>
                                                                                        <input id="paklaring" name="paklaring" type="file" placeholder="Attachment"
                                                                                            onChange={(event) => {
                                                                                                setFieldValue("paklaring", event.target.files[0]);
                                                                                            }}
                                                                                        />
                                                                                        {errors.paklaring && touched.paklaring ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.paklaring}</div>
                                                                                        ) : null}

                                                                                        <label htmlFor="termination_letter">Termination Letter</label>
                                                                                        <input id="termination_letter" name="termination_letter" type="file" placeholder="Attachment"
                                                                                            onChange={(event) => {
                                                                                                setFieldValue("termination_letter", event.target.files[0]);
                                                                                            }}
                                                                                        />
                                                                                        {errors.termination_letter && touched.termination_letter ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.termination_letter}</div>
                                                                                        ) : null}

                                                                                        <label className="mb-4 block">
                                                                                            <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                            Saya menyetujui data yang dikirimkan adalah benar
                                                                                        </label>
                                                                                        {errors.accept && touched.accept ? (
                                                                                            <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                                        ) : null}
                                                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                    </Form>
                                                                                )}
                                                                            />
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <h2 className="text-2xl font-bold">Document Exit Form</h2>
                                                                            <p className="text-justify">Cek outstanding per divisi</p>
                                                                            <hr className="mb-3" />
                                                                            <Formik
                                                                                initialValues={{
                                                                                    accept: false,
                                                                                    fileExist: false,
                                                                                    dept: '',
                                                                                    items: [],
                                                                                    file: '',
                                                                                }}
                                                                                validationSchema={ExitClearance}
                                                                                onSubmit={async (values) => {
                                                                                    // setTimeout(() => {
                                                                                    //     alert(JSON.stringify(values, null, 2));
                                                                                    // }, 500)
                                                                                    setIsOpen(true);
                                                                                    const formData = new FormData();
                                                                                    formData.append('offboardingID', id);
                                                                                    formData.append('dept', values.dept);
                                                                                    formData.append("file", values.file);
                                                                                    formData.append('process_type', 3);
                                                                                    // formData.append('items', JSON.stringify(values.items));
                                                                                    // formData.append('qty', values.qty);
                                                                                    const res = await axios.post('/api/requestdocument', formData, {
                                                                                        headers: {
                                                                                            'Content-Type': 'multipart/form-data'
                                                                                        }
                                                                                    }).then(response => {
                                                                                        console.log(response)
                                                                                        return response
                                                                                    }).catch(error => {
                                                                                        // console.log(error.response)
                                                                                        // setSubmitted(true)
                                                                                        return error.response
                                                                                    });
                                                                                    console.log(res.data);
                                                                                    if (res.status == '200') {
                                                                                        setSubmitted(true)
                                                                                    } else {
                                                                                        setSubmitted(false)
                                                                                    }
                                                                                }}
                                                                                render={({ values, errors, touched, setFieldValue }) => (
                                                                                    <Form>
                                                                                        <label htmlFor="dept">Dept</label>
                                                                                        <Field as="select" name="dept">
                                                                                            <option value="" disabled>Select Dept</option>
                                                                                            <option value="payroll">Payroll</option>
                                                                                            <option value="fastel">Fastel</option>
                                                                                            <option value="hrdev">HR Dev</option>
                                                                                            <option value="it">IT</option>
                                                                                            <option value="kopindosat">Kopindosat</option>
                                                                                            <option value="finance">Finance</option>
                                                                                            <option value="medical">Medical</option>
                                                                                        </Field>
                                                                                        {errors.dept && touched.dept ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.dept}</div>
                                                                                        ) : null}


                                                                                        <label className="mb-4 block">
                                                                                            <Field type="checkbox" name="fileExist" className="my-0 mr-2" />
                                                                                            Any Outstanding ?
                                                                                        </label>
                                                                                        {values.fileExist &&
                                                                                            <>
                                                                                                <label htmlFor="file">Attachment</label>
                                                                                                <input id="file" name="file" type="file" placeholder="Attachment"
                                                                                                    onChange={(event) => {
                                                                                                        setFieldValue("file", event.target.files[0]);
                                                                                                    }}
                                                                                                />
                                                                                                {errors.file && touched.file ? (
                                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.file}</div>
                                                                                                ) : null}
                                                                                            </>
                                                                                        }
                                                                                        <label className="mb-4">
                                                                                            <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                            Accept, declare it's true
                                                                                        </label>
                                                                                        {errors.accept && touched.accept ? (
                                                                                            <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                                        ) : null}
                                                                                        {/* <FieldArray
                                                                        name="items"
                                                                        render={arrayHelpers => (
                                                                            <div>
                                                                                {values.items && values.items.length > 0 ? (
                                                                                    values.items.map((friend, index) => (
                                                                                        <div key={index} className="flex">
                                                                                            <div className="flex-grow">
                                                                                                <label htmlFor={`items.${index}.item`}>Item</label>
                                                                                                <Field name={`items.${index}.item`} />
                                                                                            </div>
                                                                                            <div className="flex-grow px-2">
                                                                                                <label htmlFor={`items.${index}.qty`}>Qty</label>
                                                                                                <Field name={`items.${index}.qty`} />
                                                                                            </div>
                                                                                            <button
                                                                                                className="w-min bg-red-600 text-white rounded mt-8"
                                                                                                type="button"
                                                                                                onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                                                            >
                                                                                                <IoTrashBin />
                                                                                            </button>

                                                                                        </div>
                                                                                    ))
                                                                                ) : (
                                                                                    null

                                                                                )}
                                                                                <button type="button" onClick={() => arrayHelpers.push("")}>
                                                                                    Add Item
                                                                                </button>
                                                                            </div>
                                                                        )}
                                                                    /> */}
                                                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                    </Form>
                                                                                )}
                                                                            />
                                                                            <div className="border p-4">
                                                                                <h2 className="text-2xl font-bold">Template Document Clearance Form</h2>
                                                                                <p className="text-justify">Download file terkait</p>
                                                                                <hr className="mb-3" />
                                                                                {templateData && templateData.map((item) => (
                                                                                    <a
                                                                                        download
                                                                                        href={item.file}
                                                                                        className="text-lightBlue-500 text-lg border rounded p-2 block my-1"
                                                                                    >
                                                                                        <i className="fas fa-file mr-2 text-xs"></i>
                                                                                        Download - {item.name}
                                                                                    </a>
                                                                                ))
                                                                                }
                                                                            </div>
                                                                        </>
                                                                : query.get('process') == 4 ?
                                                                    <>
                                                                        <h2 className="text-2xl font-bold">Exit Clearance</h2>
                                                                        <p className="text-justify">Pada aplikasi ini saudara diminta untuk mengupload scan / soft copy dari dokumen yang terlah dikirimkan lengkap beserta nomor resi pengiriman dokumen dan perangkat IT</p>
                                                                        <hr className="mb-3" />
                                                                        <Formik
                                                                            initialValues={{
                                                                                type: '',
                                                                                signedDocument: '',
                                                                                formDocument: '',
                                                                                accept: false,
                                                                            }}
                                                                            validationSchema={ConfirmationDocument}
                                                                            onSubmit={async (values) => {
                                                                                // setTimeout(() => {
                                                                                //     alert(JSON.stringify(values, null, 2));
                                                                                // }, 500)
                                                                                setIsOpen(true);
                                                                                const formData = new FormData();
                                                                                formData.append('offboardingID', id);
                                                                                formData.append('type', values.type);
                                                                                formData.append('signedDocument', values.signedDocument);
                                                                                formData.append("formDocument", values.formDocument);
                                                                                formData.append('process_type', 4);
                                                                                // formData.append('items', JSON.stringify(values.items));
                                                                                // formData.append('qty', values.qty);
                                                                                const res = await axios.post('/api/returndocument', formData, {
                                                                                    headers: {
                                                                                        'Content-Type': 'multipart/form-data'
                                                                                    }
                                                                                }).then(response => {
                                                                                    console.log(response)
                                                                                    return response
                                                                                }).catch(error => {
                                                                                    // console.log(error.response)
                                                                                    // setSubmitted(true)
                                                                                    return error.response
                                                                                });
                                                                                console.log(res.data);
                                                                                if (res.status == '200') {
                                                                                    setSubmitted(true)
                                                                                } else {
                                                                                    setSubmitted(false)
                                                                                }
                                                                            }}
                                                                            render={({ values, errors, touched, setFieldValue }) => (
                                                                                <Form>
                                                                                    <label htmlFor="type">Type</label>
                                                                                    <Field as="select" name="type">
                                                                                        <option value="" disabled>Select Type</option>
                                                                                        <option value="online">Online</option>
                                                                                        <option value="offline">Offline</option>
                                                                                    </Field>
                                                                                    {errors.type && touched.type ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.type}</div>
                                                                                    ) : null}


                                                                                    <label htmlFor="signedDocument">Signed Document - Dokumen surat pernyataan berhenti, pengalihan pekerjaan, Form berhenti BPJS Kesehatan</label>
                                                                                    <input id="signedDocument" name="signedDocument" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("signedDocument", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.signedDocument && touched.signedDocument ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.signedDocument}</div>
                                                                                    ) : null}

                                                                                    <label htmlFor="formDocument">Checklist Pengembalian Barang</label>
                                                                                    <input id="formDocument" name="formDocument" type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue("formDocument", event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                    {errors.formDocument && touched.formDocument ? (
                                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.formDocument}</div>
                                                                                    ) : null}

                                                                                    <label className="mb-4 block">
                                                                                        <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                        Saya menyetujui data yang dikirimkan adalah benar
                                                                                    </label>
                                                                                    {errors.accept && touched.accept ? (
                                                                                        <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                                    ) : null}
                                                                                    <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                </Form>
                                                                            )}
                                                                        />
                                                                        <div className="border p-4">
                                                                                <h2 className="text-2xl font-bold">Template Return Form</h2>
                                                                                <p className="text-justify">Download file terkait</p>
                                                                                <hr className="mb-3" />
                                                                                <a
                                                                                        download
                                                                                        href="/TemplateDocuments/Form Pengembalian Barang.docx"
                                                                                        className="text-lightBlue-500 text-lg border rounded p-2 block my-1"
                                                                                    >
                                                                                        <i className="fas fa-file mr-2 text-xs"></i>
                                                                                        Download - Form Pengembalian Barang
                                                                                    </a>
                                                                                    <a
                                                                                        download
                                                                                        href="/TemplateDocuments/Form BAST.docx"
                                                                                        className="text-lightBlue-500 text-lg border rounded p-2 block my-1"
                                                                                    >
                                                                                        <i className="fas fa-file mr-2 text-xs"></i>
                                                                                        Download - Form BAST
                                                                                    </a>
                                                                            </div>
                                                                    </>
                                                                    : query.get('process') == 5 ?
                                                                        <>
                                                                            <h2 className="text-2xl font-bold">Check Return Document</h2>
                                                                            <hr className="mb-3" />
                                                                            <Formik
                                                                                initialValues={{
                                                                                    // type: 'confirmation',
                                                                                    // confirmation: false,
                                                                                    dept: '',
                                                                                    message: '',
                                                                                    accept: false,
                                                                                    completed: false,
                                                                                }}
                                                                                validationSchema={ConfirmDocument}
                                                                                onSubmit={async (values) => {
                                                                                    setIsOpen(true);
                                                                                    const formData = new FormData();
                                                                                    formData.append('offboardingID', id);
                                                                                    formData.append('type', 'confirmation');
                                                                                    // formData.append('confirmation', values.confirmation);
                                                                                    formData.append('dept', values.dept);
                                                                                    formData.append("message", values.message);
                                                                                    formData.append("completed", values.completed);
                                                                                    formData.append('process_type', 4);
                                                                                    const res = await axios.post('/api/returndocument', formData, {
                                                                                        headers: {
                                                                                            'Content-Type': 'multipart/form-data'
                                                                                        }
                                                                                    }).then(response => {
                                                                                        console.log(response)
                                                                                        return response
                                                                                    }).catch(error => {
                                                                                        // console.log(error.response)
                                                                                        // setSubmitted(true)
                                                                                        return error.response
                                                                                    });
                                                                                    console.log(res.data);
                                                                                    if (res.status == '200') {
                                                                                        setSubmitted(true)
                                                                                    } else {
                                                                                        setSubmitted(false)
                                                                                    }
                                                                                }}
                                                                                render={({ values, errors, touched, setFieldValue }) => (
                                                                                    <Form>
                                                                                        <label htmlFor="dept">Dept</label>
                                                                                        <Field as="select" name="dept">
                                                                                            <option value="" disabled>Select Dept</option>
                                                                                            <option value="hrss_softfile">HR SS Softfile</option>
                                                                                            <option value="hrss_it">HR SS IT</option>
                                                                                            <option value="svp">SVP</option>
                                                                                        </Field>
                                                                                        {errors.dept && touched.dept ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.dept}</div>
                                                                                        ) : null}


                                                                                        {!values.completed &&
                                                                                            <>
                                                                                                <label htmlFor="message">Note</label>
                                                                                                <Field type="text" id="message" name="message" />
                                                                                            </>
                                                                                        }
                                                                                        <label className="mb-4 block">
                                                                                            <Field type="checkbox" name="completed" className="my-0 mr-2" />
                                                                                            Completed ?
                                                                                        </label>

                                                                                        <label className="mb-4">
                                                                                            <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                            Declare it's true
                                                                                        </label>
                                                                                        {errors.accept && touched.accept ? (
                                                                                            <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                                        ) : null}

                                                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                    </Form>
                                                                                )}
                                                                            />
                                                                        </> :
                                                                        <>
                                                                            <h2 className="text-4xl font-bold text-right">
                                                                                Are you lost step?
                                                                            </h2>
                                                                            <p className="text-right">
                                                                                <a className="border p-2 rounded text-right text-blue-600 inline-block m-2 font-semibold" href="/exitDocument">Template Exit Document</a>
                                                                                <a className="border p-2 rounded text-right text-blue-600 inline-block m-2 font-semibold" href="/exitClearance">Template Clearance Exit</a>
                                                                            </p>
                                                                        </>
                                                    ) : null
                            }
                        </div>
                        <div className="col-lg-6"><CardEmployee data={data} visibility={tracking} /></div>
                        <ManagerModal
                            openModal={isOpen}
                            submitted={submitted}
                            stateChanger={setIsOpen}
                        />
                    </div>
            }
        </>
    )
}

export default OffboardingForm
