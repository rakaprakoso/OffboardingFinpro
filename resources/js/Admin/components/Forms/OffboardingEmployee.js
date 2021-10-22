import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, FieldArray } from 'formik'
import CardEmployee from '../Cards/CardEmployee';
import CardProgressRecord from '../Cards/CardProgressRecord';
import axios from 'axios';
import {
    useParams,
    useLocation
} from "react-router-dom";
import ManagerModal from '../Modals/ManagerModal';
import { isNull } from 'lodash';
import { IoTrashBin } from "react-icons/io5";

import * as Yup from 'yup';
import DocExitForm from './DocExitForm';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CardComment from '../Cards/CardComment';



const ConfirmDocument = Yup.object().shape({
    // dept: Yup.string()
    //     .required('Required').nullable(),
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

const OffboardingEmployee = ({ HRMGR = false }) => {

    var { id } = useParams();
    let { search } = useLocation();

    const query = new URLSearchParams(search);

    const [token, setToken] = useState(false)
    const [employee, setEmployee] = useState(false)
    const [rejectEmployee, setRejectEmployee] = useState(false)
    const [data, setData] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState('loading');
    const [tracking, setTracking] = useState('employee');
    const [templateData, setTemplateData] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [clearanceStatus, setClearanceStatus] = useState(false);

    useEffect(async () => {
        const dataFetch = await axios
            .get(`/api/offboarding/${id}?progress=true`)
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });

        if (dataFetch?.id) {
            setData(dataFetch);
            if (dataFetch.employee_token == query.get('token') || HRMGR) {
                if (dataFetch?.checkpoint?.exit_interview == 1) {
                    setDisabled(true);
                }
                if (
                    dataFetch?.checkpoint?.return_to_svp == 1 &&
                    dataFetch?.checkpoint?.return_to_hrss_doc == 1 &&
                    dataFetch?.checkpoint?.return_to_hrss_it == 1
                ) {
                    setClearanceStatus(true)
                }
                setToken(true);
                if (query.get('employee') == 'true') {
                    setEmployee(true);
                }
                if (query.get('tracking') == 'true' || query.get('process') == '4') {
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

    const clearanceQuestion = [
        {
            question: 'No. Loker',
            value: data?.offboarding_form?.return_document_form?.data ? data?.offboarding_form?.return_document_form?.data[0]?.value : '',
            type: 'text',
        },
        {
            question: [
                'ID Card',
                'Perangkat IT',
                'Bukti Upload File to Sharepoint',
            ],
            value: data?.offboarding_form?.return_document_form?.data ? data?.offboarding_form?.return_document_form?.data[1]?.value : '',
            attachment: '',
            type: 'checkbox',
            pretext: 'Checklist item yang dikembalikan'
        },
    ]
    const clearanceOnlineQuestion = [
        {
            question: 'Nomor Resi Pengiriman Dokumen',
            value: data?.offboarding_form?.return_document_form?.return_type?.data ? data?.offboarding_form?.return_document_form?.return_type?.data[0]?.value : '',
            type: 'text',
        },
        {
            question: 'Nomor Resi Pengiriman Perangkat IT',
            value: data?.offboarding_form?.return_document_form?.return_type?.data ? data?.offboarding_form?.return_document_form?.return_type?.data[1]?.value : '',
            type: 'text',
        },
        {
            question: 'Bukti Upload File to Sharepoint (Link)',
            value: data?.offboarding_form?.return_document_form?.return_type?.data ? data?.offboarding_form?.return_document_form?.return_type?.data[2]?.value : '',
            type: 'text',
        },
    ]
    const relatedDept = [
        // {
        //     question: 'Perubahan No Telfon/Opers',
        //     value: '',
        //     type: 'text',
        // },
        {
            question: 'Pengalihan Pekerjaan',
            value: '',
            type: 'attachment',
            attachment: '',
            link: '',
        },
        {
            question: 'BAST',
            value: '',
            type: 'attachment',
            attachment: '',
            link: '',
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
                    <div className="row employee">
                        <div className="col-lg-12">
                            {parseInt(data?.status_id) >= 0 ?
                                <>
                                    <div className="w-full mb-3 text-center">
                                        <span className="text-gray-800 font-semibold text-xl">{Math.round(parseInt(data?.status_id) / 7 * 100)} % - {data?.status_details?.name}</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-3 flex rounded bg-blue-200">
                                                <div
                                                    style={{ width: `${parseInt(data?.status_id) / 7 * 100}%` }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </> :
                                <>
                                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 w-full px-1 rounded"
                                    >
                                        Failed
                                    </div>
                                </>
                            }
                        </div>
                        <div className="col-lg-12">
                            <Tabs>
                                <TabList>
                                    <Tab>Overview</Tab>
                                    <Tab>
                                        Exit Interview Form
                                        {data?.checkpoint?.exit_interview == 1 ? <i className="ml-2 fas fa-check text-green-600"></i> : <i className="animate-spin ml-2 fas fa-spinner text-gray-800"></i>}
                                    </Tab>
                                    {/* <Tab>Surat Pengalihan Pekerjaan</Tab> */}
                                    {/* <Tab>Form Perubahan No Telfon</Tab> */}
                                    {HRMGR != true ?
                                        <Tab disabled={data?.checkpoint?.confirm_it != 1 ? true : false}>
                                            Form Pengembalian Barang
                                            {data?.checkpoint?.return_to_svp == 1 ? <i className="ml-2 fas fa-check text-green-600"></i> : <i className="animate-spin ml-2 fas fa-spinner text-gray-800"></i>}
                                            {data?.checkpoint?.return_to_hrss_doc == 1 ? <i className="ml-2 fas fa-check text-green-600"></i> : <i className="animate-spin ml-2 fas fa-spinner text-gray-800"></i>}
                                            {data?.checkpoint?.return_to_hrss_it == 1 ? <i className="ml-2 fas fa-check text-green-600"></i> : <i className="animate-spin ml-2 fas fa-spinner text-gray-800"></i>}
                                        </Tab>
                                        : null
                                    }
                                    {/* <Tab>Form Lampiran Departemen Lain</Tab> */}
                                </TabList>

                                <TabPanel>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <CardEmployee data={data} visibility={tracking} />
                                        </div>
                                        <div className="col-lg-6">
                                            {data && <CardComment data={data?.comments} />}
                                        </div>
                                        <div className="col-lg-6">
                                            {data && <CardProgressRecord data={data?.progress_record} />}
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
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
                                                                                        <div className="flex w-full mt-2 mb-4">
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

                                                    {data?.checkpoint?.exit_interview != 1 && <>
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
                                                    </>}
                                                </fieldset>
                                            </Form>
                                        )}
                                    />
                                </TabPanel>
                                {/* <TabPanel>
                                    <h2>Pengalihan Pekerjaan</h2>
                                </TabPanel> */}
                                {/* <TabPanel>
                                    <h2>Form Perubahan No Telfon</h2>
                                </TabPanel> */}
                                {HRMGR != true ?
                                    <TabPanel>
                                        <Formik
                                            initialValues={{
                                                // type: 'confirmation',
                                                // confirmation: false,
                                                type: data?.offboarding_form?.return_document_form?.return_type?.type,
                                                resi: '',
                                                comment: data?.offboarding_form?.return_document_form?.additional_comment,
                                                message: '',
                                                accept: false,
                                                completed: false,
                                                // dept: '',
                                                items: clearanceQuestion,
                                                itemOnline: clearanceOnlineQuestion,
                                            }}
                                            validationSchema={ConfirmDocument}
                                            onSubmit={async (values) => {
                                                // alert(JSON.stringify(values))
                                                setIsOpen(true);
                                                const formData = new FormData();
                                                formData.append('offboardingID', id);
                                                formData.append('type', 'return_document');
                                                formData.append('returnType', values.type);
                                                formData.append('data', JSON.stringify(values));
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
                                                    <fieldset disabled={clearanceStatus}>
                                                        <h2 className="text-3xl font-bold mt-5">FORMULIR PENGEMBALIAN BARANG</h2>
                                                        <p className="text-justify">Pada aplikasi ini saudara diminta untuk mengupload scan / soft copy dari dokumen yang terlah dikirimkan lengkap beserta nomor resi pengiriman dokumen dan perangkat IT</p>
                                                        <label htmlFor="type">Type</label>
                                                        <Field as="select" name="type">
                                                            <option value="" disabled>Select Type</option>
                                                            <option value="online" selected={data?.offboarding_form?.return_document_form?.return_type?.type == 'online' ? true : false}>Online</option>
                                                            <option value="offline" selected={data?.offboarding_form?.return_document_form?.return_type?.type == 'offline' ? true : false}>Offline</option>
                                                        </Field>
                                                        {errors.type && touched.type ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.type}</div>
                                                        ) : null}
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
                                                                                            <div className="flex w-full mt-2 mb-4">
                                                                                                <span className="mr-3 text-base leading-none">Hampir Selalu</span>
                                                                                                <Field type="radio" className="mr-auto my-0" name={`items.${index}.value`} value="1" />
                                                                                                <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="2" />
                                                                                                <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="3" />
                                                                                                <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="4" />
                                                                                                <Field type="radio" className="ml-auto my-0" name={`items.${index}.value`} value="5" />
                                                                                                <span className="ml-3 text-base leading-none">Tidak Pernah</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        : item.type == 'checkbox' ?
                                                                                            <div key={index}>
                                                                                                {item.question.map((item2, index2) => (
                                                                                                    <>
                                                                                                        <div className="flex w-full mt-2 mb-4">
                                                                                                            <div>
                                                                                                                <Field type="checkbox" className="mr-2 my-0" name={`items.${index}.value.${index2}`} value="1" />
                                                                                                                {item2}
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </>
                                                                                                ))}
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
                                                        {values.type == 'online' ?
                                                            <FieldArray
                                                                name="itemOnline"
                                                                render={arrayHelpers => (
                                                                    <div>
                                                                        {values.itemOnline && values.itemOnline.length > 0 ? (
                                                                            values.itemOnline.map((item, index) => (
                                                                                <div>
                                                                                    <label htmlFor={`itemOnline.${index}.value`}>{item.question}</label>
                                                                                    <Field id={`itemOnline.${index}`} name={`itemOnline.${index}.value`} placeholder={item.value} />
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            null
                                                                        )}
                                                                    </div>
                                                                )}
                                                            /> : null
                                                        }

                                                        <div className="border-t border-gray-300 pt-2">
                                                            <label className="text-xl font-bold" htmlFor="comment">Catatan tambahan</label>
                                                            <Field id="comment" name="comment" placeholder="Catatan tambahan" />
                                                        </div>

                                                        {data?.checkpoint?.return_to_svp != 1 ||
                                                            data?.checkpoint?.return_to_hrss_doc != 1 ||
                                                            data?.checkpoint?.return_to_hrss_it != 1 ?
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
                                                            : null
                                                        }
                                                    </fieldset>
                                                </Form>
                                            )}
                                        />
                                    </TabPanel>
                                    : null
                                }
                                {/* <TabPanel>
                                    <Formik
                                        initialValues={{
                                            // type: 'confirmation',
                                            // confirmation: false,
                                            type: '',
                                            resi: '',
                                            comment: '',
                                            message: '',
                                            accept: false,
                                            completed: false,
                                            // dept: '',
                                            items: relatedDept,
                                        }}
                                        validationSchema={ConfirmDocument}
                                        onSubmit={async (values) => {
                                            // alert(JSON.stringify(values))
                                            // setIsOpen(true);
                                            const formData = new FormData();
                                            formData.append('offboardingID', id);
                                            formData.append('type', 'confirmation');
                                            formData.append('data', JSON.stringify(values));
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
                                                // setSubmitted(true)
                                            } else {
                                                // setSubmitted(false)
                                            }
                                        }}
                                        render={({ values, errors, touched, setFieldValue }) => (
                                            <Form autocomplete="off">
                                                <h2 className="text-3xl font-bold mt-5">FORM LAMPIRAN DEPARTEMEN LAIN</h2>{errors.type && touched.type ? (
                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.type}</div>
                                                ) : null}
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
                                                                            : item.type == 'attachment' ?
                                                                                <div key={index}>
                                                                                    <label htmlFor={`items.${index}`}>{item.question}</label>
                                                                                    <input id={`items.${index}`} name={`items.${index}.attachment`} type="file" placeholder="Attachment"
                                                                                        onChange={(event) => {
                                                                                            setFieldValue(`items.${index}.attachment`, event.target.files[0]);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                                : null
                                                                        }
                                                                    </>
                                                                ))
                                                            ) : (
                                                                null
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                                {values.type == 'online' ?
                                                    <FieldArray
                                                        name="itemOnline"
                                                        render={arrayHelpers => (
                                                            <div>
                                                                {values.itemOnline && values.itemOnline.length > 0 ? (
                                                                    values.itemOnline.map((item, index) => (
                                                                        <div>
                                                                            <label htmlFor={`itemOnline.${index}.value`}>{item.question}</label>
                                                                            <Field id={`itemOnline.${index}`} name={`itemOnline.${index}.value`} placeholder={item.value} />
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    null
                                                                )}
                                                            </div>
                                                        )}
                                                    /> : null
                                                }

                                                <div className="border-t border-gray-300 pt-2">
                                                    <label className="text-xl font-bold" htmlFor="comment">Catatan tambahan</label>
                                                    <Field id="comment" name="comment" placeholder="Catatan tambahan" />
                                                </div>

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
                                </TabPanel> */}

                            </Tabs>
                        </div>
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

export default OffboardingEmployee
