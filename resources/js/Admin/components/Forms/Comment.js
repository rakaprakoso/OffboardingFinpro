import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';
import * as Yup from 'yup';

const commentVerification = Yup.object().shape({
    comment: Yup.string()
        .required('Required').nullable(),
});

const Comment = ({
    id,
    from,
    data,
    // setSubmitted,
    setOpenModal,
    checkpoint
}) => {
    const [submitted, setSubmitted] = useState(null);
    return (
        <Formik
            initialValues={{
                // accept: false,
                comment: '',
            }}
            validationSchema={commentVerification}
            onSubmit={async (values, { resetForm }) => {
                // setOpenModal(true);
                // alert(JSON.stringify(values));
                const formData = new FormData();
                formData.append('offboardingID', id);
                formData.append('from', from);
                formData.append('comment', values.comment);
                // formData.append('process_type', 3);
                // formData.append('outstanding_exist', values.outstandingExist);
                // formData.append('items', JSON.stringify(values.items));
                // formData.append('qty', values.qty);
                const res = await axios.post('/api/comment', formData, {
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
                    // alert('Success')
                    resetForm()
                    setSubmitted(true)
                } else {
                    // alert('Fail')
                    setSubmitted(false)
                }
            }}
            render={({ values, errors, touched, setFieldValue }) => (
                <Form>
                    <div class="flex mx-auto items-center justify-center shadow-lg mb-4">
                        <div class="w-full bg-white rounded-lg p-5">
                            <div class="flex flex-wrap -mx-3">
                                <h2 class="px-4 pt-3 pb-2 text-gray-800 font-bold">Give the feedback</h2>
                                <div class="w-full md:w-full px-3">
                                    <Field component="textarea" class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full py-2 px-3 mb-0 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" name="comment" placeholder='Type Your Comment' />
                                    {errors.comment && touched.comment ? (
                                        <div className="mb-4 text-red-600 text-sm">{errors.comment}</div>
                                    ) : null}
                                </div>
                                <div class="w-full md:w-full flex items-start px-3 justify-end">
                                    <div class="-mr-1">
                                        <button type='submit' class="bg-white text-gray-700 font-medium mb-2 py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100" >
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full md:w-full flex items-start px-3 justify-end">
                                    {submitted == true ?
                                        <div className="bg-green-300 text-gray-700 text-sm font-medium py-1 px-4 border rounded-lg tracking-wide text-center">Sucess</div>
                                        : submitted == false ?
                                            <div className="bg-red-300 text-gray-700 text-sm font-medium py-1 px-4 border rounded-lg tracking-wide text-center">Fail</div>
                                            : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        />

    )
}

export default Comment;
