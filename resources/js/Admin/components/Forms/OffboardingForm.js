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
    const [data, setData] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/offboarding/${id}`)
            .then(function (response) {
                console.log(response);
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
                data &&
                <div className="row">
                    <div className="col-lg-6">
                        {
                            parseInt(data?.status) == 1 ? (
                                query.get('process') != 3 ? (
                                    data && data?.checkpoint.acc_employee == 1 && data?.checkpoint.acc_svp == 1 ? 'Already Acc' :
                                        data && data?.checkpoint.acc_employee == 1 && employee ? 'Employee Already Acc' :
                                            data && data?.checkpoint.acc_svp == 1 && !employee ? 'SVP Already Acc' :
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
                                ) : "Still waiting document verification"
                            ) :
                                parseInt(data?.status) == 2 ? "Already Acc process 2" :
                                    parseInt(data?.status) == -2 ? "Declined" :
                                        parseInt(data?.status) == 0 ? "Still Waiting Document Verification" :
                                            parseInt(data?.status) >= 3 ? (
                                                query.get('process') == 3 ?
                                                    <>
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
                                                                    <button type="submit">Submit</button>
                                                                </Form>
                                                            )}
                                                        />
                                                    </>
                                                    : query.get('process') == 4 ?
                                                        <>
                                                            <Formik
                                                                initialValues={{
                                                                    type: '',
                                                                    signedDocument: '',
                                                                    formDocument: '',
                                                                }}
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


                                                                        <label htmlFor="signedDocument">Signed Document - Upload copy scan dokumen surat pernyataan berhenti, pengalihan pekerjaan</label>
                                                                        <input id="signedDocument" name="signedDocument" type="file" placeholder="Attachment"
                                                                            onChange={(event) => {
                                                                                setFieldValue("signedDocument", event.target.files[0]);
                                                                            }}
                                                                        />
                                                                        {errors.signedDocument && touched.signedDocument ? (
                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.signedDocument}</div>
                                                                        ) : null}

                                                                        <label htmlFor="formDocument">Return Item Document</label>
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
                                                                            Accept, declare it's true
                                                                        </label>
                                                                        {errors.accept && touched.accept ? (
                                                                            <div className="mb-4 text-red-600 text-sm">{errors.accept}</div>
                                                                        ) : null}
                                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                                    </Form>
                                                                )}
                                                            />
                                                        </>
                                                        : query.get('process') == 5 ?
                                                            <>
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

                                                                            <button type="submit">Submit</button>
                                                                        </Form>
                                                                    )}
                                                                />
                                                            </> : "Already Process 5"
                                            ) : null
                        }
                    </div>
                    <div className="col-lg-6"><CardEmployee data={data} /></div>
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
