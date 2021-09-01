import React, { useState } from 'react'
import { Formik, Field, Form } from 'formik'
import Modal from 'react-modal';
import { AiOutlineLoading3Quarters, AiOutlineCloseCircle, AiOutlineCheck } from "react-icons/ai";
import SubmitResignModal from '../Modals/SubmitResignModal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

const EmployeeResignForm = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    return (
        <>
            <Formik
                initialValues={{
                    employeeName: '',
                    employeeID: '',
                    reason: '',
                    resignLetter: '',
                    effectiveDate: '',
                }}
                onSubmit={async (values, { resetForm }) => {
                    setIsOpen(true);
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
                    setSubmitted(true)


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
            {/* <button onClick={openModal}>Open Modal</button> */}
            <SubmitResignModal
                openModal={isOpen}
                submitted={submitted}
                stateChanger={setIsOpen}
            />
        </>
    )
}

export default EmployeeResignForm
