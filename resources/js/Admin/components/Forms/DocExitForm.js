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

const ExitClearance = Yup.object().shape({
    dept: Yup.string()
        .required('Required').nullable(),
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const DocExitForm = ({
    id,
    data,
    setSubmitted,
    setOpenModal,
    checkpoint
}) => {
    // const [isOpen, setIsOpen] = useState(false);
    // const [submitted, setSubmitted] = useState(false);

    const DeptInput = ({ dept, index }) => {
        const deptSelected = deptList.findIndex((element) => element.value == dept);
        return (
            <>
                {
                    deptList[deptSelected].children?.map((item, i) => (
                        <div className="flex-grow">
                            <label htmlFor={`items.${index}.${item}`}>{item}</label>
                            <Field name={`items.${index}.${item}`} />
                        </div>
                    ))
                }
            </>
        )
    }

    const deptList = [
        {
            name: 'Fastel',
            value: 'fastel',
            children: ['MSISDN', 'Outstanding'],
            cp : checkpoint?.confirm_fastel,
        },
        {
            name: 'Finance',
            value: 'finance',
            children: ['Vendor', 'Amount', 'Text'],
            cp : checkpoint?.confirm_finance,
        },
        {
            name: 'HR Dev',
            value: 'hrdev',
            children: ['Perihal', 'Tujuan', 'Tanggal Kegiatan', 'Penyelenggara', 'Periode Ikadin'],
            cp : checkpoint?.confirm_hrdev,
        },
        {
            name: 'Kopindosat',
            value: 'kopindosat',
            children: ['Hak', 'Kewajiban'],
            cp : checkpoint?.confirm_kopindosat,
        },
        {
            name: 'IT',
            value: 'it',
            children: ['Code', 'Item', 'Qty'],
            cp : checkpoint?.confirm_it,
        },
        {
            name: 'Medical',
            value: 'medical',
            children: ['Ekses Medical'],
            cp : checkpoint?.confirm_medical,
        },
    ]


    return (
        <>
            <h2 className="text-2xl font-bold">Document Exit Form - New Version</h2>
            <p className="text-justify">Cek outstanding per divisi</p>
            <hr className="mb-3" />
            <Formik
                initialValues={{
                    accept: false,
                    dept: '',
                    outstandingExist: false,
                    //General (Fastel,Medical)
                    outstanding: '',
                    //Fastel
                    msisdn: '',
                    //Kopindosat
                    member: false,
                    hak: '',
                    kewajiban: '',
                    //Ikatan Dinas, Finance, IT
                    items: [{}],

                }}
                validationSchema={ExitClearance}
                onSubmit={async (values) => {
                    setOpenModal(true);
                    const formData = new FormData();
                    formData.append('offboardingID', id);
                    formData.append('dept', values.dept);
                    formData.append('process_type', 3);
                    formData.append('outstanding_exist', values.outstandingExist);
                    formData.append('items', JSON.stringify(values.items));
                    // formData.append('qty', values.qty);
                    const res = await axios.post('/api/rightobligation', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(response => {
                        console.log(response)
                        return response
                    }).catch(error => {
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
                        <Field as="select" name="dept"
                            onBlur={() => setFieldValue('items', [{}])}
                        >
                            <option value="" disabled>Select Dept</option>
                            {/* <option value="payroll">Payroll</option> */}
                            {deptList.map((item, i) => (
                                <option value={item.value}
                                disabled={item.cp == "1" ? true : false}
                                >{item.name} </option>
                            ))}
                        </Field>
                        {errors.dept && touched.dept ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.dept}</div>
                        ) : null}
                        <label className="mb-4 block">
                            <Field type="checkbox" name="outstandingExist" className="my-0 mr-2" />
                            Any Outstanding ?
                        </label>
                        {values.outstandingExist &&
                            <FieldArray
                                name="items"
                                render={arrayHelpers => (
                                    <div>
                                        {values.dept == 'it' || values.dept == 'finance' ?
                                            <button type="button" className="bg-blue-600 text-white" onClick={() => arrayHelpers.push("")}>
                                                + Add Item
                                            </button>
                                            : null}
                                        {values.items && values.items.length > 0 ? (
                                            values.items.map((item, index) => (
                                                <div key={index} className={values.dept == 'it' || values.dept == 'finance' ? "flex" : null}>
                                                    {values.dept && <DeptInput dept={values.dept} index={index} />}
                                                    {/* <div className="flex-grow">
                                                   <label htmlFor={`items.${index}.code`}>Code</label>
                                                   <Field name={`items.${index}.code`} />
                                               </div>
                                               <div className="flex-grow px-2">
                                                   <label htmlFor={`items.${index}.item`}>Item</label>
                                                   <Field name={`items.${index}.item`} />
                                               </div>
                                               <div className="flex-grow px-2">
                                                   <label htmlFor={`items.${index}.qty`}>Qty</label>
                                                   <Field name={`items.${index}.qty`} />
                                               </div> */}
                                                    {values.dept == 'it' || values.dept == 'finance' ?
                                                        <button
                                                            className="w-min bg-red-600 text-white rounded mt-8"
                                                            type="button"
                                                            onClick={() => arrayHelpers.remove(index)} // remove a friend from the list
                                                        >
                                                            <IoTrashBin />
                                                        </button>
                                                        : null
                                                    }
                                                </div>
                                            ))
                                        ) : (
                                            null
                                        )}
                                    </div>
                                )}
                            />
                        }

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
            />
        </>

    )
}


export default DocExitForm
