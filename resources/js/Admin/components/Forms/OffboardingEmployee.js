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
import DocExitForm from './DocExitForm';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';



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

const OffboardingEmployee = () => {

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

    const question = [
        {
            question: '1. Apa alasan utama Anda meninggalkan perusahaan?',
            value: '',
            type: 'text',
        },
        {
            question: '2. Apakah ada hal yang dapat perusahaan lakukan untuk mencegah Anda meninggalkan perusahaan?',
            value: '',
            type: 'text',
        },
        {
            question: '3. Apakah Anda mau merekomendasikan perusahaan ini ke teman Anda sebagai tempat bekerja yang baik? ',
            value: '',
            type: 'text',
        },
        {
            question: '4. Saran apa yang dapat Anda berikan untuk membuat Indosat menjadi tempat bekerja yang lebih baik?',
            value: '',
            type: 'text',
        },
        {
            question: '5. Dari 5 values perusahaan, sebutkan values apa yang menurut Anda belum diterapkan dengan baik dan alasannya.',
            value: '',
            type: 'text',
        },
        {
            question: '1. Menunjukkan perlakuan yang adil dan merata',
            value: '',
            type: 'radio',
            pretext: 'Bagaimana penilaian Anda terhadap atasan Anda pada hal-hal berikut',
        },
        {
            question: '2. Menghargai prestasi kerja staf nya',
            value: '',
            type: 'radio',
        },
        {
            question: '3. Menyelesaikan keluhan dan masalah',
            value: '',
            type: 'radio',
        },
        {
            question: '4. Memberikan umpan balik dan saran',
            value: '',
            type: 'radio',
        },
        {
            question: '5. Melakukan pengembangan karir staf nya',
            value: '',
            type: 'radio',
        },
        {
            question: '1. Kerjasama di dalam Divisi/Group Anda',
            value: '',
            type: 'radio',
            pretext: 'Bagaimana penilaian  Anda mengenai hal-hal yang ada di Divisi/Group Anda ',
        },
        {
            question: '2. Kerjasama dengan Divisi/Group lain',
            value: '',
            type: 'radio',
        },
        {
            question: '3. Komunikasi di dalam Divisi/Group',
            value: '',
            type: 'radio',
        },
        {
            question: '1. Sistem/manajemen karir ',
            value: '',
            type: 'radio',
            pretext: 'Bagaimana penilaian Anda mengenai hal-hal berikut',
        },
        {
            question: '2. Sistem penilaian kinerja',
            value: '',
            type: 'radio',
        },
        {
            question: '3. Kesempatan untuk berkembang',
            value: '',
            type: 'radio',
        },
        {
            question: '4. Kesesuain gaji yang diterima dengan tugas/jabatan',
            value: '',
            type: 'radio',
        },
        {
            question: '5. Perhatian perusahaan terhadap kesejahteraan karyawan',
            value: '',
            type: 'radio',
        },
        {
            question: '6. Fasilitas perusahaan',
            value: '',
            type: 'radio',
        },
        {
            question: '7. Keamanan dan kesehatan kerja',
            value: '',
            type: 'radio',
        },
        {
            question: 'Pilih salah satu',
            value: '',
            type: 'radio-vertical',
            pretext: 'Apa yang akan Anda lakukan setelah mengundurkan diri dari PT Indosat, Tbk ?',
        },
    ]

    const clearanceQuestion = [
        {
            question: 'No. Loker',
            value: '',
            type: 'text',
        },
        {
            question: [
                'ID Card',
                'Perangkat IT',
                'Bukti Upload File to Sharepoint',
            ],
            value: '',
            attachment: '',
            type: 'checkbox',
            pretext: 'Checklist item yang dikembalikan'
        },
    ]
    const clearanceOnlineQuestion = [
        {
            question: 'Nomor Resi Pengiriman Dokumen',
            value: '',
            type: 'text',
        },
        {
            question: 'Nomor Resi Pengiriman Perangkat IT',
            value: '',
            type: 'text',
        },
        {
            question: 'Bukti Upload File to Sharepoint (Link)',
            value: '',
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
                            {parseInt(data.status) >= 0 ?
                                <>
                                    <div className="w-full mb-3 text-center">
                                        <span className="text-gray-800 font-semibold text-xl">{Math.round(parseInt(data.status) / 6 * 100)} % - {data?.status_details?.name}</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-3 flex rounded bg-blue-200">
                                                <div
                                                    style={{ width: `${parseInt(data.status) / 6 * 100}%` }}
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
                                    <Tab>Exit Interview Form</Tab>
                                    {/* <Tab>Surat Pengalihan Pekerjaan</Tab> */}
                                    {/* <Tab>Form Perubahan No Telfon</Tab> */}
                                    <Tab>Form Pengembalian Barang</Tab>
                                    <Tab>Form Lampiran Departemen Lain</Tab>
                                </TabList>

                                <TabPanel>
                                    <CardEmployee data={data} visibility={tracking} />
                                </TabPanel>
                                <TabPanel>
                                    <Formik
                                        initialValues={{
                                            // type: 'confirmation',
                                            // confirmation: false,
                                            dept: '',
                                            activity: '',
                                            comment: '',
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
                                            formData.append('type', 'confirmation');
                                            formData.append('data', JSON.stringify(values));
                                            // formData.append('confirmation', values.confirmation);
                                            // formData.append("message", values.message);
                                            // formData.append("completed", values.completed);
                                            // formData.append('type', 4);
                                            const res = await axios.post('/api/employeeData', formData, {
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
                                                                                        <Field type="radio" className="mr-auto my-0" name={`items.${index}.value`} value="1" />
                                                                                        <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="2" />
                                                                                        <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="3" />
                                                                                        <Field type="radio" className="mx-auto my-0" name={`items.${index}.value`} value="4" />
                                                                                        <Field type="radio" className="ml-auto my-0" name={`items.${index}.value`} value="5" />
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
                                                                                                    <label htmlFor="activity">Kegiatan Lainnya</label>
                                                                                                    <Field id="activity" name="activity" placeholder="Kegiatan Lainnya" />
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
                                </TabPanel>
                                {/* <TabPanel>
                                    <h2>Pengalihan Pekerjaan</h2>
                                </TabPanel> */}
                                {/* <TabPanel>
                                    <h2>Form Perubahan No Telfon</h2>
                                </TabPanel> */}
                                <TabPanel>
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
                                            items: clearanceQuestion,
                                            itemOnline: clearanceOnlineQuestion,
                                        }}
                                        validationSchema={ConfirmDocument}
                                        onSubmit={async (values) => {
                                            alert(JSON.stringify(values))
                                            setIsOpen(true);
                                            const formData = new FormData();
                                            formData.append('offboardingID', id);
                                            formData.append('type', 'confirmation');
                                            formData.append('data', JSON.stringify(values));
                                            const res = await axios.post('/api/employeeData', formData, {
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
                                                <h2 className="text-3xl font-bold mt-5">FORMULIR PENGEMBALIAN BARANG</h2>
                                                <p className="text-justify">Pada aplikasi ini saudara diminta untuk mengupload scan / soft copy dari dokumen yang terlah dikirimkan lengkap beserta nomor resi pengiriman dokumen dan perangkat IT</p>
                                                <label htmlFor="type">Type</label>
                                                <Field as="select" name="type">
                                                    <option value="" disabled>Select Type</option>
                                                    <option value="online">Online</option>
                                                    <option value="offline">Offline</option>
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
                                                                                                        <label htmlFor="activity">Kegiatan Lainnya</label>
                                                                                                        <Field id="activity" name="activity" placeholder="Kegiatan Lainnya" />
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
                                </TabPanel>
                                <TabPanel>
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
                                            setIsOpen(true);
                                            const formData = new FormData();
                                            formData.append('offboardingID', id);
                                            formData.append('type', 'confirmation');
                                            formData.append('data', JSON.stringify(values));
                                            const res = await axios.post('/api/employeeData', formData, {
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
                                                <h2 className="text-3xl font-bold mt-5">FORM LAMPIRAN DEPARTEMEN LAIN</h2>
                                                {/* <p className="text-justify">Pada aplikasi ini saudara diminta untuk mengupload scan / soft copy dari dokumen yang terlah dikirimkan lengkap beserta nomor resi pengiriman dokumen dan perangkat IT</p> */}
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
                                </TabPanel>
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
