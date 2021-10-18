import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';

import * as Yup from 'yup';



const ConfirmDocument = Yup.object().shape({
    accept: Yup.bool().oneOf([true], 'Accept Terms & Conditions is required'),
});

const ExitInterviewForm = ({ admin = false, data = null }) => {

    var { id } = useParams();
    let { search } = useLocation();

    const query = new URLSearchParams(search);

    const [token, setToken] = useState(false)
    const [employee, setEmployee] = useState(false)
    const [rejectEmployee, setRejectEmployee] = useState(false)
    // const [data, setData] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState('loading');
    const [tracking, setTracking] = useState('employee');
    const [templateData, setTemplateData] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(async () => {
        if (admin) {
            setToken(true);
            setDisabled(true);
        }
        // if (dataFetch?.id) {
        //     setData(dataFetch);
        //     if (dataFetch.employee_token == query.get('token') || HRMGR) {
        //         if (dataFetch?.checkpoint?.exit_interview == 1) {
        //             setDisabled(true);
        //         }
        //         setToken(true);
        //     } else {
        //         setToken(false);
        //     }
        // } else {
        //     setData(null);
        // }

    }, []);

    const question = [
        {
            question: '1. Apa alasan utama Anda meninggalkan perusahaan?',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[0]?.value : '',
            type: 'text',
        },
        {
            question: '2. Apakah ada hal yang dapat perusahaan lakukan untuk mencegah Anda meninggalkan perusahaan?',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[1]?.value : '',
            type: 'text',
        },
        {
            question: '3. Apakah Anda mau merekomendasikan perusahaan ini ke teman Anda sebagai tempat bekerja yang baik? ',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[2]?.value : '',
            type: 'text',
        },
        {
            question: '4. Saran apa yang dapat Anda berikan untuk membuat Indosat menjadi tempat bekerja yang lebih baik?',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[3]?.value : '',
            type: 'text',
        },
        {
            question: '5. Dari 5 values perusahaan, sebutkan values apa yang menurut Anda belum diterapkan dengan baik dan alasannya.',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[4]?.value : '',
            type: 'text',
        },
        {
            question: '1. Menunjukkan perlakuan yang adil dan merata',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[5]?.value : '',
            type: 'radio',
            pretext: 'Bagaimana penilaian Anda terhadap atasan Anda pada hal-hal berikut',
        },
        {
            question: '2. Menghargai prestasi kerja staf nya',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[6]?.value : '',
            type: 'radio',
        },
        {
            question: '3. Menyelesaikan keluhan dan masalah',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[7]?.value : '',
            type: 'radio',
        },
        {
            question: '4. Memberikan umpan balik dan saran',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[8]?.value : '',
            type: 'radio',
        },
        {
            question: '5. Melakukan pengembangan karir staf nya',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[9]?.value : '',
            type: 'radio',
        },
        {
            question: '1. Kerjasama di dalam Divisi/Group Anda',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[10]?.value : '',
            type: 'radio',
            pretext: 'Bagaimana penilaian  Anda mengenai hal-hal yang ada di Divisi/Group Anda ',
        },
        {
            question: '2. Kerjasama dengan Divisi/Group lain',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[11]?.value : '',
            type: 'radio',
        },
        {
            question: '3. Komunikasi di dalam Divisi/Group',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[12]?.value : '',
            type: 'radio',
        },
        {
            question: '1. Sistem/manajemen karir ',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[13]?.value : '',
            type: 'radio',
            pretext: 'Bagaimana penilaian Anda mengenai hal-hal berikut',
        },
        {
            question: '2. Sistem penilaian kinerja',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[14]?.value : '',
            type: 'radio',
        },
        {
            question: '3. Kesempatan untuk berkembang',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[15]?.value : '',
            type: 'radio',
        },
        {
            question: '4. Kesesuain gaji yang diterima dengan tugas/jabatan',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[16]?.value : '',
            type: 'radio',
        },
        {
            question: '5. Perhatian perusahaan terhadap kesejahteraan karyawan',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[17]?.value : '',
            type: 'radio',
        },
        {
            question: '6. Fasilitas perusahaan',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[18]?.value : '',
            type: 'radio',
        },
        {
            question: '7. Keamanan dan kesehatan kerja',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[19]?.value : '',
            type: 'radio',
        },
        {
            question: 'Pilih salah satu',
            value: data?.offboarding_form?.exit_interview_form?.data ? data?.offboarding_form?.exit_interview_form?.data[20]?.value : '',
            type: 'radio-vertical',
            pretext: 'Apa yang akan Anda lakukan setelah mengundurkan diri dari PT Indosat, Tbk ?',
        },
    ]

    return (
        <>
            {data == null ? "Data Not Found" : null}
            {data && token == false || null ?
                "Token Not Correct" :
                rejectEmployee && rejectEmployee == true ?
                    "Reject Success" :
                    data &&
                    <div className="row text-left px-3">
                        <Formik
                            initialValues={{
                                // type: 'confirmation',
                                // confirmation: false,
                                dept: '',
                                otherActivity: '',
                                comment: data?.offboarding_form?.exit_interview_form?.additional_comment,
                                message: '',
                                accept: false,
                                completed: false,
                                items: question,
                            }}
                            validationSchema={ConfirmDocument}
                            onSubmit={async (values) => {
                                // alert(JSON.stringify(values))
                                setIsOpen(true);
                                const formData = new FormData();
                                formData.append('offboardingID', id);
                                formData.append('type', 'exit_interview_form');
                                formData.append('data', JSON.stringify(values));
                                // formData.append("message", values.message);
                                // formData.append('confirmation', values.confirmation);
                                // formData.append("completed", values.completed);
                                // formData.append('type', 4);
                                const res = await axios.post('/api/offboardingForm', formData, {
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
                                <Form autocomplete="off">
                                    <fieldset disabled={disabled}>
                                        <h2 className="text-3xl font-bold mt-5">FORMULIR WAWANCARA PENGUNDURAN DIRI</h2>
                                        <p className="text-justify">Pendapat Anda selama bekerja di PT Indosat, Tbk. sangat penting dalam upaya untuk memelihara lingkungan kerja yang positif. Kami pastikan masukan Anda yang berharga ini akan dijaga kerahasiaannya. Untuk itu, mohon dapat memberikan jawaban yang lengkap, jelas dan jujur.</p>
                                        <FieldArray
                                            name="items"
                                            render={arrayHelpers => (
                                                <div>
                                                    {values.items && values.items.length > 0 ? (
                                                        values.items.map((item, index) => (
                                                            <>
                                                                {item?.pretext != null && index != 0 ?
                                                                    <h3 className="text-xl font-bold border-t border-gray-300 pt-5">{item.pretext}</h3> : null}
                                                                {item.type == 'text' ?
                                                                    <div>
                                                                        <label htmlFor={`items.${index}.value`}>{item.question}</label>
                                                                        <Field id={`items.${index}`} name={`items.${index}.value`} placeholder={item.value} />
                                                                    </div>
                                                                    : item.type == 'radio' ?
                                                                        <div key={index}>
                                                                            <label htmlFor={`items.${index}`}>{item.question}</label>
                                                                            <div className="flex w-full mt-2 mb-4 items-center">
                                                                                <span className="mr-3 text-base leading-none">Hampir Selalu</span>
                                                                                <label className="flex-grow mx-4 my-0 py-2 text-center cursor-pointer"><Field type="radio" className="mr-auto my-0" name={`items.${index}.value`} value="1" checked={item?.value == '1' ? true : false} /></label>
                                                                                <label className="flex-grow mx-4 my-0 py-2 text-center cursor-pointer"><Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="2" checked={item?.value == '2' ? true : false} /></label>
                                                                                <label className="flex-grow mx-4 my-0 py-2 text-center cursor-pointer"><Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="3" checked={item?.value == '3' ? true : false} /></label>
                                                                                <label className="flex-grow mx-4 my-0 py-2 text-center cursor-pointer"><Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="4" checked={item?.value == '4' ? true : false} /></label>
                                                                                <label className="flex-grow mx-4 my-0 py-2 text-center cursor-pointer"><Field type="radio" className="ml-auto my-0" name={`items.${index}.value`} value="5" checked={item?.value == '5' ? true : false} /></label>
                                                                                <span className="ml-3 text-base leading-none">Tidak Pernah</span>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div key={index}>
                                                                            <label htmlFor={`items.${index}`}>{item.question}</label>
                                                                            <div className="w-full mt-2 mb-4">
                                                                                <div>
                                                                                    <Field type="radio" className="mr-2 my-0" name={`items.${index}.value`} value="1" />
                                                                                    Bekerja di perusahaan lain
                                                                                </div>
                                                                                <div>
                                                                                    <Field type="radio" className="mr-2 my-0" name={`items.${index}.value`} value="2" />
                                                                                    Wirausaha/wiraswasta
                                                                                </div>
                                                                                <div>
                                                                                    <Field type="radio" className="mr-2 my-0" name={`items.${index}.value`} value="3" />
                                                                                    Lain-Lain
                                                                                    {values.items[values.items.length - 1].value == "3" ?
                                                                                        <div>
                                                                                            <label htmlFor="otherActivity">Kegiatan Lainnya</label>
                                                                                            <Field id="otherActivity" name="otherActivity" placeholder="Kegiatan Lainnya" />
                                                                                        </div> : null
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                }
                                                            </>
                                                        ))
                                                    ) : (
                                                        null
                                                    )}
                                                </div>
                                            )}
                                        />

                                        <div className="border-t border-gray-300 pt-2">
                                            <label className="text-xl font-bold" htmlFor="comment">Komentar tambahan</label>
                                            <Field id="comment" name="comment" placeholder="Komentar tambahan" />
                                        </div>

                                        {admin != true &&
                                            <>
                                                <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                    <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                    Approve Data
                                                    {errors.accept
                                                        // && touched.accept
                                                        ? (
                                                            <div className="text-red-600 text-sm">{errors.accept}</div>
                                                        ) : null}
                                                </label>
                                                {values.accept &&
                                                    <button type="submit" className="bg-primary text-white p-3 text-lg uppercase">Submit</button>
                                                }
                                            </>
                                        }
                                    </fieldset>
                                </Form>
                            )}
                        />
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

export default ExitInterviewForm
