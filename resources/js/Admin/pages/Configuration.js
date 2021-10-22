import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import axios from 'axios';
import SubmitResignModal from '../components/Modals/SubmitResignModal';

export function Configuration() {
    return (
        <>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 px-4">
                    <div className="bg-white p-6 rounded shadow-md w-full">
                        <ConfigurationForm />
                    </div>
                </div>
            </div>
        </>
    );
}

function ConfigurationForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [data, setData] = useState(null);

    useEffect(async () => {
        const dataFetch = await axios
            .post(`/api/configuration?type=get`)
            .then(function (response) {
                console.log(response);
                return response;
            })
            .catch(function (error) {
                console.log(error);
            });

        if (dataFetch.status == '200') {
            if (dataFetch.data.value) {
                setData(JSON.parse(dataFetch.data.value))
            } else {
                setData(dataFetch.data)
            }
        }else{
            setData(dataFetch)
        }

    }, [])
    const emailList = [
        {
            name: 'HRSS Document Email',
            value: data ? data[0]['value'] : '',
        },
        {
            name: 'IT Staff Email',
            value: data && data[1]['value']
        },
        {
            name: 'Finance Dept Email',
            value: data && data[2]['value']
        },
        {
            name: 'Kopindosat Email',
            value: data && data[3]['value']
        },
        {
            name: 'HRDev Email',
            value: data && data[4]['value']
        },
        {
            name: 'Fastel Email',
            value: data && data[5]['value']
        },
        {
            name: 'Medical Email',
            value: data && data[6]['value']
        },
        {
            name: 'Payroll Email',
            value: data && data[7]['value']
        },
        {
            name: 'HRBP Manager Email',
            value: data && data[8]['value']
        },
    ]

    return (
        <>
            <h2 className="text-2xl font-bold">Offboarding Configuration</h2>
            <hr className="mb-3" />
            {data && <Formik
                initialValues={{
                    // employeeID: '',
                    // svpID: '',
                    // svpPassword: '',
                    // type: '',
                    // effectiveDate: '',
                    // resignLetter: '',
                    accept: false,
                    items: emailList,
                }}
                // validationSchema={OffboardingSchema}
                onSubmit={async (values) => {
                    setSubmitted("loading");
                    setIsOpen(true);
                    const formData = new FormData();

                    // formData.append('employeeID', values.employeeID);
                    // formData.append('svpID', values.svpID);
                    // formData.append('svpPassword', values.svpPassword);
                    // formData.append('type', values.type);
                    // formData.append('resign_letter', values.resignLetter);
                    // formData.append('effective_date', values.effectiveDate);
                    // formData.append('admin', 'true');
                    formData.append('data', JSON.stringify(values.items));

                    const res = await axios.post('/api/configuration', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                        // });
                    }).then(response => {
                        console.log(response)
                        return response
                    }).catch(error => {
                        console.log(error.response)
                        // setSubmitted(true)
                        // setSubmitted(false)
                        return error.response
                    });
                    // console.log(res.data);
                    if (res.status == '200') {
                        setSubmitted(true)
                    } else {
                        setSubmitted(false)
                    }
                    // console.log(res.data);
                    // setSubmitted(true)
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <FieldArray
                            name="items"
                            render={arrayHelpers => (
                                <>
                                    {values.items && values.items.length > 0 ?
                                        (
                                            values.items.map((item, index) => (
                                                <div className="mb-2">
                                                    <label htmlFor={`items.${index}.value`}>{item.name}</label>
                                                    <Field id={`items.${index}`} name={`items.${index}.value`} placeholder={item.name} />
                                                </div>
                                            ))
                                        )
                                        : null
                                    }
                                </>
                            )}
                        />

                        <button type="submit" className="bg-primary text-white">SAVE</button>
                    </Form>
                )}
            </Formik>
            }
            <SubmitResignModal
                openModal={isOpen}
                submitted={submitted}
                stateChanger={setIsOpen}
            />
        </>

    );
}
