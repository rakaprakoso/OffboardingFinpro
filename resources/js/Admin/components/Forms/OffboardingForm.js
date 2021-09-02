import React, { useState, useEffect } from 'react'
import { Formik, Field, Form } from 'formik'
import CardEmployee from '../Cards/CardEmployee';
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';

const OffboardingForm = () => {

    var { id } = useParams();
    let { search } = useLocation();

    const query = new URLSearchParams(search);

    const [token, setToken] = useState(false)
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
            } else {
                setToken(false);
            }
        } else {
            setData(null);
        }

    }, []);

    return (
        <>
            {data == null ? "Data Not Found" : null}
            {data && token == false || null ?
                "Token Not Correct" :
                parseInt(data?.status) == 2 ? "Already Acc" :
                    parseInt(data?.status) == -2 ? "Declined" :
                        parseInt(data?.status) == 0 ? "Still waiting verification" :
                            data &&
                            <div className="row">
                                <div className="col-lg-6">
                                    {parseInt(data?.status) == 3 && query.get('process') == 3 ?
                                        <Formik
                                            initialValues={{
                                                item: '',
                                                dept: '',
                                                qty: '',
                                                status: '',
                                            }}
                                            onSubmit={async (values) => {
                                                setIsOpen(true);
                                                const formData = new FormData();
                                                formData.append('offboardingID', id);
                                                formData.append('item', values.item);
                                                formData.append('dept', values.dept);
                                                formData.append('qty', values.qty);

                                                formData.append('process_type', 3);
                                                const res = await axios.post('/api/requestdocument', formData, {
                                                    headers: {
                                                        'Content-Type': 'multipart/form-data'
                                                    }
                                                });
                                                console.log(res.data);
                                                setSubmitted(true)
                                            }}
                                        >
                                            {(formProps) => (
                                                <Form>

                                                    <label htmlFor="item">Item</label>
                                                    <Field id="item" name="item" placeholder="Item" />

                                                    <label htmlFor="qty">Qty</label>
                                                    <Field id="qty" name="qty" placeholder="Qty" />
                                                    <label htmlFor="dept">Dept</label>
                                                    <Field id="dept" name="dept" placeholder="Dept" />

                                                    <button type="submit" className="bg-primary text-white">Submit</button>
                                                </Form>
                                            )}
                                        </Formik>
                                        : parseInt(data?.status) > 1 ? "Already Acc" :
                                            <Formik
                                                initialValues={{
                                                    managerID: '',
                                                    effectiveDate: data.effective_date,
                                                    status: '',
                                                }}
                                                onSubmit={async (values) => {
                                                    setIsOpen(true);
                                                    const formData = new FormData();
                                                    formData.append('offboardingID', id);
                                                    formData.append('IN_managerID', values.managerID);
                                                    formData.append('effective_date', values.effectiveDate);
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
                                                {(formProps) => (
                                                    <Form>

                                                        <label htmlFor="managerID">Manager ID</label>
                                                        <Field id="managerID" name="managerID" placeholder="Manager ID" />

                                                        <label htmlFor="effectiveDate">Effective Date</label>
                                                        <Field type="date" id="effectiveDate" name="effectiveDate" />

                                                        <div id="status-radio-group" className="mb-2">Action</div>
                                                        <div role="group" className="mb-2" aria-labelledby="status-radio-group">
                                                            <label className="p-2 border rounded mr-2">
                                                                <Field type="radio" name="status" value="1" className="my-2 mr-2" />
                                                                Accept
                                                            </label>
                                                            <label className="p-2 border rounded mr-2">
                                                                <Field type="radio" name="status" value="0" className="my-2 mr-2" />
                                                                Reject
                                                            </label>
                                                        </div>

                                                        <button type="submit" className="bg-primary text-white">Submit</button>
                                                    </Form>


                                                )}
                                            </Formik>
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
