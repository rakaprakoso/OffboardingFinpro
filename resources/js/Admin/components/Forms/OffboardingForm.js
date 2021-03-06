import React, { useState, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import CardEmployee from "../Cards/CardEmployee";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import ManagerModal from "../Modals/ManagerModal";
import { isNull } from "lodash";
import { IoTrashBin } from "react-icons/io5";

import * as Yup from "yup";
import DocExitForm from "./DocExitForm";
import Comment from "./Comment";
import OffboardingEmployee from "./OffboardingEmployee";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from "react-accessible-accordion";
import CardComment from "../Cards/CardComment";
import CardProgressRecord from "../Cards/CardProgressRecord";
import StatusProgress from "../StatusProgress";
import moment from "moment";
import ReadForm from "../../functions/ReadForm";

const ReturnClearance = Yup.object().shape({
    dept: Yup.string().required("Required").nullable(),
    completed: Yup.string().required("Required").nullable(),
});
const HRMGR = Yup.object().shape({
    completed: Yup.string().required("Required").nullable(),
});
const ConfirmDocument = Yup.object().shape({
    dept: Yup.string().required("Required").nullable(),
    accept: Yup.bool().oneOf([true], "Accept Terms & Conditions is required"),
});

const CompletedVerification = Yup.object().shape({
    completed: Yup.string().required("Required").nullable(),
});
const ConfirmationDocument = Yup.object().shape({
    accept: Yup.bool().oneOf([true], "Accept Terms & Conditions is required"),
});

const ExitClearance = Yup.object().shape({
    dept: Yup.string().required("Required").nullable(),
    // file: Yup.mixed().required('Required').test(
    //     "file",
    //     "Your video is too big :(",
    //     value => value && value.size <= 262144000
    // ),
    accept: Yup.bool().oneOf([true], "Accept Terms & Conditions is required"),
});

const dateMin = (date = null, type = "normal") => {
    if (type == "verification") {
        var dtToday = moment(date).add(1, "M").subtract(1, "days");
        date = dtToday.format("YYYY-MM-DD");
        return date;
    }
    var dtToday = moment(date).add(1, "M");
    date = dtToday.format("YYYY-MM-DD");
    // var month = dtToday.getMonth() + 2;
    // var day = dtToday.getDate() + 1;
    // var year = dtToday.getFullYear();
    // if (month < 10)
    //     month = '0' + month.toString();
    // if (day < 10)
    //     day = '0' + day.toString();

    // var minDate = year + '-' + month + '-' + day;
    return date;
};

const OffboardingForm = () => {
    var { id } = useParams();
    let { search } = useLocation();

    const query = new URLSearchParams(search);

    const [token, setToken] = useState(false);
    const [employee, setEmployee] = useState(false);
    const [rejectEmployee, setRejectEmployee] = useState(false);
    const [data, setData] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState("loading");
    const [tracking, setTracking] = useState(false);
    const [templateData, setTemplateData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(async () => {
        var dataFetch = null;
        if (
            query.get("exitInterview") == "true" ||
            query.get("process") == "5" ||
            query.get("approval") == "hrmgr" ||
            query.get("payroll") == "true"
        ) {
            dataFetch = await axios
                .get(`/api/offboarding/${id}?progress=true`)
                .then(function (response) {
                    // console.log(response);
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });

            // setData(dataFetch);
        } else {
            dataFetch = await axios
                .get(`/api/offboarding/${id}`)
                .then(function (response) {
                    // console.log(response);
                    return response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (dataFetch?.id) {
            setData(dataFetch);
            if (dataFetch.token == query.get("token")) {
                setToken(true);
                if (query.get("employee") == "true") {
                    setEmployee(true);
                }
                if (
                    query.get("tracking") == "true" ||
                    query.get("process") == "4"
                ) {
                    setTracking("employee");
                }
                if (query.get("approval") == "hrmgr") {
                    setTracking("admin");
                }
                if (query.get("payroll") == "true") {
                    setTracking("payroll");
                }
                if (query.get("process") == "3") {
                    // const dataFetch = await axios
                    //     .get(`/api/exitDocument?clearance=true`)
                    //     .then(function (response) {
                    //         console.log(response);
                    //         return response.data;
                    //     })
                    //     .catch(function (error) {
                    //         console.log(error);
                    //     });
                    // setTemplateData(dataFetch)
                }
                if (query.get("exitInterview") == "true") {
                    ReadForm(dataFetch.id, "exitInterview");
                }

                if (query.get("process") == "5") {
                    setTracking("clearance");
                }

                if (query.get("approval") == "hrmgr") {
                    if (dataFetch.status_id == 6) {
                        var dataLoading = await ReadForm(
                            dataFetch.id,
                            "hrbp_manager"
                        );
                        if (dataLoading.status == 200) {
                            location.reload();
                            // setLoading(false)
                        }
                    } else {
                        setLoading(false);
                    }
                }
                // if (query.get('exitInterview') == 'true' || query.get('process') == '5' || query.get('approval') == 'hrmgr') {
                //     const dataFetch = await axios
                //         .get(`/api/offboarding/${id}?type=full`)
                //         .then(function (response) {
                //             // console.log(response);
                //             return response.data;
                //         })
                //         .catch(function (error) {
                //             console.log(error);
                //         });

                //     setData(dataFetch);
                // }
                if (query.get("rejectEmployee") == "true") {
                    const formData = new FormData();
                    formData.append("offboardingID", id);
                    formData.append("employee", 1);
                    formData.append("status", 0);

                    formData.append("process_type", 2);
                    const res = await axios.post(
                        "/api/managerconfirmation",
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    console.log(res);
                    if (res.status == 200) {
                        setRejectEmployee(true);
                    }
                }
            } else {
                setToken(false);
            }
        } else {
            setData(null);
        }
    }, []);

    const [inputToken, setInputToken] = useState(false);
    const [errorToken, setErrorToken] = useState(false);
    const [defaultToken, setDefaultToken] = useState(query.get("inputToken"));
    // const [isOpen, setIsOpen] = useState(false);
    // const [submitted, setSubmitted] = useState(false);
    useEffect(async () => {
        if (query.get("process") == "5") {
            if (deptList.find(isSelectedToken)) {
                setInputToken(deptList.find(isSelectedToken));
                readForm(deptList.find(isSelectedToken).value);
            }
        }
    }, [data]);

    const readForm = async (dept) => {
        const formData = new FormData();
        formData.append("offboardingID", id);
        formData.append("dept", dept);
        const res = await axios
            .post("/api/readinput", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error.response;
            });
    };

    const deptList = [
        {
            name: "HR SS Softfile",
            value: "hrss_softfile",
            cp: data?.checkpoint?.return_to_hrss_doc,
            inputToken: data?.input_token?.hrss_doc,
        },
        {
            name: "HR SS IT",
            value: "hrss_it",
            cp: data?.checkpoint?.return_to_hrss_it,
            inputToken: data?.input_token?.it,
        },
        {
            name: "SVP",
            value: "svp",
            cp: data?.checkpoint?.return_to_svp,
            inputToken: data?.input_token?.svp,
        },
    ];
    function isSelectedToken(deptList) {
        return deptList.inputToken === defaultToken;
    }

    const ConfirmSchema =
        data &&
        (employee == false
            ? Yup.object().shape({
                  // managerID: Yup.string()
                  //     .required('Required'),
                  status: Yup.string().required("Required"),
                  effectiveDate: Yup.date("Invalid Date")
                      .required("Required")
                      .min(
                          new Date(dateMin(data?.created_at, "verification")),
                          "At least 1 month"
                      ),
              })
            : Yup.object().shape({
                  status: Yup.string().required("Required"),
              }));

    return (
        <>
            {data == null ? "Data Not Found" : null}
            {(data && token == false) || null ? (
                "Token Not Correct"
            ) : rejectEmployee && rejectEmployee == true ? (
                "Reject Success"
            ) : data && query.get("approval") == "hrmgr" ? (
                <>
                    {loading ? (
                        <div className="text-center">
                            <div>
                                <i className="animate-spin fas fa-spinner text-gray-800"></i>
                            </div>
                            Finalizing Data, Don't Close tab
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold">
                                HR Manager Approval
                            </h2>
                            <hr className="mb-3" />
                            <StatusProgress data={data} />
                            <Accordion
                                allowMultipleExpanded
                                allowZeroExpanded
                                className="mb-5"
                            >
                                <AccordionItem>
                                    <AccordionItemHeading>
                                        <AccordionItemButton>
                                            Offboarding Data
                                        </AccordionItemButton>
                                    </AccordionItemHeading>
                                    <AccordionItemPanel className="border p-5">
                                        <div className="w-full">
                                            <CardEmployee
                                                data={data}
                                                visibility={tracking}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <div className="-mx-4 flex">
                                                <div className="w-full lg:w-1/2 px-4">
                                                    {data && (
                                                        <CardComment
                                                            data={
                                                                data?.comments
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                <div className="w-full lg:w-1/2 px-4">
                                                    {data && (
                                                        <CardProgressRecord
                                                            data={
                                                                data?.progress_record
                                                            }
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionItemPanel>
                                </AccordionItem>
                            </Accordion>

                            {data?.checkpoint?.acc_hrbp_mgr != 1 ? (
                                // <Formik
                                //     initialValues={{
                                //         accept: false,
                                //         completed: '',
                                //     }}
                                //     validationSchema={HRMGR}
                                //     onSubmit={async (values) => {
                                //         setIsOpen(true);
                                //         const formData = new FormData();
                                //         formData.append('offboardingID', id);
                                //         formData.append('hrmgr', 1);
                                //         formData.append('status', 1);
                                //         formData.append('process_type', 2);
                                //         const res = await axios.post('/api/managerconfirmation', formData, {
                                //             headers: {
                                //                 'Content-Type': 'multipart/form-data'
                                //             }
                                //         });
                                //         // console.log(res.data);
                                //         setSubmitted(true)
                                //     }}
                                // >
                                //     {({ values, errors, touched, setFieldValue }) => (
                                //         <>

                                //             <Form>
                                //                 <label className="mb-4 block bg-gray-100 p-3 rounded">
                                //                     <Field type="radio" name="completed" value="1" className="my-0 mr-2" />
                                //                     Lengkap
                                //                 </label>

                                //                 <label className="mb-4 block bg-gray-100 p-3 rounded">
                                //                     <Field type="radio" name="completed" value="0" className="my-0 mr-2" />
                                //                     Tidak Lengkap
                                //                 </label>

                                //                 {errors.completed && touched.completed && (
                                //                     <div className="text-red-600 text-sm">{errors.completed}</div>
                                //                 )}
                                //                 {values.completed == '1' &&
                                //                     <button type="submit" className="bg-primary text-white p-3 text-lg uppercase">Submit</button>
                                //                 }

                                //             </Form>
                                //             {values.completed == '0' &&
                                //                 <>
                                //                     <div className="border-t border-gray-200 w-full mb-4" />
                                //                     <Comment from="HR MGR" id={id} />
                                //                 </>
                                //             }
                                //         </>
                                //     )}
                                // </Formik>
                                <></>
                            ) : (
                                <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                    <i class="fas fa-check"></i> CONFIRMED
                                </div>
                            )}
                            <ManagerModal
                                openModal={isOpen}
                                submitted={submitted}
                                stateChanger={setIsOpen}
                            />
                        </>
                    )}
                </>
            ) : (
                data && (
                    <div className="row">
                        <div className="col-lg-12">
                            <StatusProgress data={data} />
                        </div>
                        <div className="col-lg-6 order-2 lg:order-1">
                            {parseInt(data?.status_id) < 0 ? (
                                "Process Terminated"
                            ) : parseInt(data?.status_id) == 1 ? (
                                query.get("process") != 3 ? (
                                    data && data?.checkpoint.acc_svp == 1 ? (
                                        "Already Acc"
                                    ) : data &&
                                      data?.checkpoint.acc_employee == 1 &&
                                      employee ? (
                                        "Employee Already Acc"
                                    ) : data &&
                                      data?.checkpoint.acc_svp == 1 &&
                                      !employee ? (
                                        "SVP Already Acc"
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                SVP Confirmation
                                            </h2>
                                            <hr className="mb-3" />
                                            <Formik
                                                initialValues={{
                                                    managerID: "",
                                                    effectiveDate:
                                                        data.effective_date,
                                                    status: "",
                                                }}
                                                validationSchema={ConfirmSchema}
                                                onSubmit={async (values) => {
                                                    setIsOpen(true);
                                                    const formData =
                                                        new FormData();
                                                    formData.append(
                                                        "offboardingID",
                                                        id
                                                    );
                                                    if (employee == false) {
                                                        formData.append(
                                                            "employee",
                                                            0
                                                        );
                                                        // formData.append('IN_managerID', values.managerID);
                                                        formData.append(
                                                            "effective_date",
                                                            values.effectiveDate
                                                        );
                                                    } else {
                                                        formData.append(
                                                            "employee",
                                                            1
                                                        );
                                                    }
                                                    // formData.append('IN_managerID', values.managerID);
                                                    // formData.append('effective_date', values.effectiveDate);
                                                    formData.append(
                                                        "status",
                                                        values.status
                                                    );

                                                    formData.append(
                                                        "process_type",
                                                        2
                                                    );
                                                    const res =
                                                        await axios.post(
                                                            "/api/managerconfirmation",
                                                            formData,
                                                            {
                                                                headers: {
                                                                    "Content-Type":
                                                                        "multipart/form-data",
                                                                },
                                                            }
                                                        );
                                                    console.log(res.data);
                                                    setSubmitted(true);
                                                }}
                                            >
                                                {({
                                                    values,
                                                    errors,
                                                    touched,
                                                    setFieldValue,
                                                }) => (
                                                    <Form>
                                                        {employee == false ? (
                                                            <>
                                                                {/* <label htmlFor="managerID">Manager ID</label>
                                                                                <Field id="managerID" name="managerID" placeholder="Manager ID" />
                                                                                {errors.managerID && touched.managerID ? (
                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.managerID}</div>
                                                                                ) : null} */}

                                                                <label htmlFor="effectiveDate">
                                                                    Effective
                                                                    Date
                                                                </label>
                                                                <Field
                                                                    type="date"
                                                                    id="effectiveDate"
                                                                    min={dateMin(
                                                                        data?.created_at
                                                                    )}
                                                                    name="effectiveDate"
                                                                />
                                                                {errors.effectiveDate &&
                                                                touched.effectiveDate ? (
                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                        {
                                                                            errors.effectiveDate
                                                                        }
                                                                    </div>
                                                                ) : null}
                                                            </>
                                                        ) : null}
                                                        <div
                                                            id="status-radio-group"
                                                            className="mb-2"
                                                        >
                                                            Action
                                                        </div>
                                                        <div
                                                            role="group"
                                                            className="mb-4 flex -mx-4"
                                                            aria-labelledby="status-radio-group"
                                                        >
                                                            <label className="border rounded mx-4 flex-grow text-center cursor-pointer border-green-600">
                                                                <Field
                                                                    type="radio"
                                                                    name="status"
                                                                    value="1"
                                                                    className="my-2 mr-2 hidden"
                                                                />
                                                                <div className="p-2 label-checked:bg-green-600 label-checked:text-white">
                                                                    Accept
                                                                </div>
                                                            </label>
                                                            <label className="border rounded mx-4 flex-grow text-center cursor-pointer border-red-600">
                                                                <Field
                                                                    type="radio"
                                                                    name="status"
                                                                    value="0"
                                                                    className="my-2 mr-2 hidden"
                                                                />
                                                                <div className="p-2 label-checked:bg-red-600 label-checked:text-white">
                                                                    Reject
                                                                </div>
                                                            </label>
                                                        </div>
                                                        {errors.status &&
                                                        touched.status ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.status}
                                                            </div>
                                                        ) : null}
                                                        <button
                                                            type="submit"
                                                            className="bg-primary text-white p-3 text-lg uppercase"
                                                        >
                                                            Submit
                                                        </button>
                                                    </Form>
                                                )}
                                            </Formik>
                                        </>
                                    )
                                ) : (
                                    "Still waiting document verification"
                                )
                            ) : parseInt(data?.status_id) == 2 ? (
                                "Already Acc process 2"
                            ) : parseInt(data?.status_id) == -2 ? (
                                "Declined"
                            ) : parseInt(data?.status_id) == 0 ? (
                                "Still Waiting Document Verification"
                            ) : parseInt(data?.status_id) >= 3 ? (
                                query.get("tracking") == "true" ? (
                                    "Don't Forget always check your offboarding status"
                                ) : query.get("bast") == "true" ? (
                                    <>
                                        <h2 className="text-2xl font-bold">
                                            BAST Form (Berita Acara Serah
                                            Terima)
                                        </h2>
                                        {/* <p className="text-justify">Cek outstanding per divisi</p> */}
                                        <hr className="mb-3" />
                                        <Formik
                                            initialValues={{
                                                type: "",
                                                bast: "",
                                                accept: false,
                                            }}
                                            validationSchema={
                                                ConfirmationDocument
                                            }
                                            onSubmit={async (values) => {
                                                setIsOpen(true);
                                                const formData = new FormData();
                                                formData.append(
                                                    "offboardingID",
                                                    id
                                                );
                                                formData.append(
                                                    "bast",
                                                    values.bast
                                                );
                                                const res = await axios
                                                    .post(
                                                        "/api/bast",
                                                        formData,
                                                        {
                                                            headers: {
                                                                "Content-Type":
                                                                    "multipart/form-data",
                                                            },
                                                        }
                                                    )
                                                    .then((response) => {
                                                        console.log(response);
                                                        return response;
                                                    })
                                                    .catch((error) => {
                                                        return error.response;
                                                    });
                                                console.log(res.data);
                                                if (res.status == "200") {
                                                    setSubmitted(true);
                                                } else {
                                                    setSubmitted(false);
                                                }
                                            }}
                                            render={({
                                                values,
                                                errors,
                                                touched,
                                                setFieldValue,
                                            }) => (
                                                <Form>
                                                    <label htmlFor="bast">
                                                        BAST
                                                    </label>
                                                    <input
                                                        id="bast"
                                                        name="bast"
                                                        type="file"
                                                        placeholder="Attachment"
                                                        onChange={(event) => {
                                                            setFieldValue(
                                                                "bast",
                                                                event.target
                                                                    .files[0]
                                                            );
                                                        }}
                                                    />
                                                    {errors.bast &&
                                                    touched.bast ? (
                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                            {errors.bast}
                                                        </div>
                                                    ) : null}

                                                    {/* <label htmlFor="termination_letter">Termination Letter</label>
                                                                    <input id="termination_letter" name="termination_letter" type="file" placeholder="Attachment"
                                                                        onChange={(event) => {
                                                                            setFieldValue("termination_letter", event.target.files[0]);
                                                                        }}
                                                                    />
                                                                    {errors.termination_letter && touched.termination_letter ? (
                                                                        <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.termination_letter}</div>
                                                                    ) : null} */}

                                                    <label className="mb-4 block">
                                                        <Field
                                                            type="checkbox"
                                                            name="accept"
                                                            className="my-0 mr-2"
                                                        />
                                                        Saya menyetujui data
                                                        yang dikirimkan adalah
                                                        benar
                                                    </label>
                                                    {errors.accept &&
                                                    touched.accept ? (
                                                        <div className="mb-4 text-red-600 text-sm">
                                                            {errors.accept}
                                                        </div>
                                                    ) : null}
                                                    <button
                                                        type="submit"
                                                        className="bg-primary text-white p-3 text-lg uppercase"
                                                    >
                                                        Submit
                                                    </button>
                                                </Form>
                                            )}
                                        />
                                    </>
                                ) : query.get("process") == 3 ? (
                                    query.get("exitInterview") == "true" ? (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                Exit Interview Document
                                            </h2>
                                            <hr className="mb-3" />
                                            {data?.checkpoint?.exit_interview !=
                                            1 ? (
                                                <Formik
                                                    initialValues={{
                                                        type: "",
                                                        // exit_interview_form: '',
                                                        // note_procedure: '',
                                                        // opers: '',
                                                        accept: false,
                                                        completed: "",
                                                    }}
                                                    validationSchema={
                                                        CompletedVerification
                                                    }
                                                    onSubmit={async (
                                                        values
                                                    ) => {
                                                        // setTimeout(() => {
                                                        //     alert(JSON.stringify(values, null, 2));
                                                        // }, 500)
                                                        setIsOpen(true);
                                                        const formData =
                                                            new FormData();
                                                        formData.append(
                                                            "offboardingID",
                                                            id
                                                        );
                                                        formData.append(
                                                            "type",
                                                            "exitinterview"
                                                        );
                                                        formData.append(
                                                            "dept",
                                                            "hrbp"
                                                        );
                                                        // formData.append('exit_interview_form', values.exit_interview_form);
                                                        // formData.append('note_procedure', values.note_procedure);
                                                        // formData.append("opers", values.opers);
                                                        const res = await axios
                                                            .post(
                                                                "/api/requestdocument",
                                                                formData,
                                                                {
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "multipart/form-data",
                                                                    },
                                                                }
                                                            )
                                                            .then(
                                                                (response) => {
                                                                    console.log(
                                                                        response
                                                                    );
                                                                    return response;
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                // console.log(error.response)
                                                                // setSubmitted(true)
                                                                return error.response;
                                                            });
                                                        console.log(res.data);
                                                        if (
                                                            res.status == "200"
                                                        ) {
                                                            setSubmitted(true);
                                                        } else {
                                                            setSubmitted(false);
                                                        }
                                                    }}
                                                    render={({
                                                        values,
                                                        errors,
                                                        touched,
                                                        setFieldValue,
                                                    }) => (
                                                        <>
                                                            <Form>
                                                                {/* <label htmlFor="exit_interview_form">Exit Interview Form</label>
                                                                                                <input id="exit_interview_form" name="exit_interview_form" type="file" placeholder="Attachment"
                                                                                                    onChange={(event) => {
                                                                                                        setFieldValue("exit_interview_form", event.target.files[0]);
                                                                                                    }}
                                                                                                />
                                                                                                {errors.exit_interview_form && touched.exit_interview_form ? (
                                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.exit_interview_form}</div>
                                                                                                ) : null} */}
                                                                {data.offboarding_form &&
                                                                data
                                                                    ?.offboarding_form
                                                                    ?.exit_interview_form
                                                                    ?.data ==
                                                                    null ? (
                                                                    <h3 className="text-xl font-bold text-center p-3 bg-red-600 text-white rounded mb-2">
                                                                        Data
                                                                        belum
                                                                        diisi
                                                                    </h3>
                                                                ) : (
                                                                    data?.offboarding_form?.exit_interview_form?.data?.map(
                                                                        (
                                                                            item,
                                                                            index
                                                                        ) => (
                                                                            <>
                                                                                {item?.pretext !=
                                                                                    null &&
                                                                                index !=
                                                                                    0 ? (
                                                                                    <h3 className="text-xl font-bold border-t border-gray-300 pt-5">
                                                                                        {
                                                                                            item.pretext
                                                                                        }
                                                                                    </h3>
                                                                                ) : null}
                                                                                <p>
                                                                                    {
                                                                                        item.question
                                                                                    }
                                                                                </p>
                                                                                {item.type ==
                                                                                "radio" ? (
                                                                                    <div className="flex w-full mt-2 mb-4">
                                                                                        <span className="mr-3 text-base leading-none">
                                                                                            Hampir
                                                                                            Selalu
                                                                                        </span>
                                                                                        <input
                                                                                            type={
                                                                                                item.type
                                                                                            }
                                                                                            className="mr-auto my-0"
                                                                                            disabled
                                                                                            checked={
                                                                                                item.value ==
                                                                                                "1"
                                                                                            }
                                                                                            value={
                                                                                                item.value
                                                                                            }
                                                                                        />
                                                                                        <input
                                                                                            type={
                                                                                                item.type
                                                                                            }
                                                                                            className="mr-auto my-0"
                                                                                            disabled
                                                                                            checked={
                                                                                                item.value ==
                                                                                                "2"
                                                                                            }
                                                                                            value={
                                                                                                item.value
                                                                                            }
                                                                                        />
                                                                                        <input
                                                                                            type={
                                                                                                item.type
                                                                                            }
                                                                                            className="mr-auto my-0"
                                                                                            disabled
                                                                                            checked={
                                                                                                item.value ==
                                                                                                "3"
                                                                                            }
                                                                                            value={
                                                                                                item.value
                                                                                            }
                                                                                        />
                                                                                        <input
                                                                                            type={
                                                                                                item.type
                                                                                            }
                                                                                            className="mr-auto my-0"
                                                                                            disabled
                                                                                            checked={
                                                                                                item.value ==
                                                                                                "4"
                                                                                            }
                                                                                            value={
                                                                                                item.value
                                                                                            }
                                                                                        />
                                                                                        <input
                                                                                            type={
                                                                                                item.type
                                                                                            }
                                                                                            className="mr-auto my-0"
                                                                                            disabled
                                                                                            checked={
                                                                                                item.value ==
                                                                                                "5"
                                                                                            }
                                                                                            value={
                                                                                                item.value
                                                                                            }
                                                                                        />
                                                                                        <span className="ml-3 text-base leading-none">
                                                                                            Tidak
                                                                                            Pernah
                                                                                        </span>
                                                                                    </div>
                                                                                ) : item.type ==
                                                                                  "radio-vertical" ? (
                                                                                    <input
                                                                                        type="text"
                                                                                        disabled
                                                                                        value={
                                                                                            item.value ==
                                                                                            "1"
                                                                                                ? "Bekerja di perusahaan lain"
                                                                                                : item.value ==
                                                                                                  "2"
                                                                                                ? "Wirausaha/wiraswasta"
                                                                                                : "(Lain - lain) - " +
                                                                                                  data
                                                                                                      ?.offboarding_form
                                                                                                      ?.exit_interview_form
                                                                                                      ?.other_activity
                                                                                        }
                                                                                    />
                                                                                ) : (
                                                                                    <input
                                                                                        type={
                                                                                            item.type
                                                                                        }
                                                                                        disabled
                                                                                        value={
                                                                                            item.value
                                                                                        }
                                                                                    />
                                                                                )}
                                                                                {/* <p>{item.value}</p> */}
                                                                            </>
                                                                        )
                                                                    )
                                                                )}
                                                                <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                    <Field
                                                                        type="radio"
                                                                        name="completed"
                                                                        value="1"
                                                                        className="my-0 mr-2"
                                                                    />
                                                                    Lengkap
                                                                </label>

                                                                <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                    <Field
                                                                        type="radio"
                                                                        name="completed"
                                                                        value="0"
                                                                        className="my-0 mr-2"
                                                                    />
                                                                    Tidak
                                                                    Lengkap
                                                                </label>

                                                                {errors.completed &&
                                                                    touched.completed && (
                                                                        <div className="text-red-600 text-sm">
                                                                            {
                                                                                errors.completed
                                                                            }
                                                                        </div>
                                                                    )}
                                                                {values.completed ==
                                                                    "1" && (
                                                                    <button
                                                                        type="submit"
                                                                        className="bg-primary text-white p-3 text-lg uppercase"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                )}
                                                            </Form>
                                                            {values.completed ==
                                                                "0" && (
                                                                <>
                                                                    <div className="border-t border-gray-200 w-full mb-4" />
                                                                    <Comment
                                                                        from="SVP - Exit Interview Form"
                                                                        id={id}
                                                                    />
                                                                </>
                                                            )}
                                                            {/* <label className="mb-4 block bg-gray-100 p-3 rounded">
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
                                                                                                    } */}

                                                            {/* {data.offboarding_form &&
                                                                                                    // JSON.stringify(data?.offboarding_form?.exit_interview_form)
                                                                                                    data?.offboarding_form?.exit_interview_form?.data.map((item, index) => (
                                                                                                        <>
                                                                                                            {item?.pretext != null && index != 0 ?
                                                                                                                <h3 className="text-xl font-bold border-t border-gray-300 pt-5">{item.pretext}</h3> : null}
                                                                                                            <p>{item.question}</p>
                                                                                                            {item.type == 'radio' ?
                                                                                                                <div className="flex w-full mt-2 mb-4">
                                                                                                                    <span className="mr-3 text-base leading-none">Hampir Selalu</span>
                                                                                                                    <input type={item.type} className="mr-auto my-0" disabled checked={item.value == '1'} value={item.value} />
                                                                                                                    <input type={item.type} className="mr-auto my-0" disabled checked={item.value == '2'} value={item.value} />
                                                                                                                    <input type={item.type} className="mr-auto my-0" disabled checked={item.value == '3'} value={item.value} />
                                                                                                                    <input type={item.type} className="mr-auto my-0" disabled checked={item.value == '4'} value={item.value} />
                                                                                                                    <input type={item.type} className="mr-auto my-0" disabled checked={item.value == '5'} value={item.value} />
                                                                                                                    <span className="ml-3 text-base leading-none">Tidak Pernah</span>
                                                                                                                </div>

                                                                                                                : item.type == 'radio-vertical' ?
                                                                                                                    <input type='text' disabled value={
                                                                                                                        item.value == '1' ? 'Bekerja di perusahaan lain'
                                                                                                                            : item.value == '2' ? 'Wirausaha/wiraswasta'
                                                                                                                                : '(Lain - lain) - ' + data?.offboarding_form?.exit_interview_form?.other_activity
                                                                                                                    } />
                                                                                                                    : <input type={item.type} disabled value={item.value} />
                                                                                                            }
                                                                                                        </>
                                                                                                    ))
                                                                                                } */}

                                                            {/* <label htmlFor="note_procedure">Note Procedure</label>
                                                                                                <input id="note_procedure" name="note_procedure" type="file" placeholder="Attachment"
                                                                                                    onChange={(event) => {
                                                                                                        setFieldValue("note_procedure", event.target.files[0]);
                                                                                                    }}
                                                                                                />
                                                                                                {errors.note_procedure && touched.note_procedure ? (
                                                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.note_procedure}</div>
                                                                                                ) : null} */}

                                                            {/* <label htmlFor="opers">Change Opers</label>
                                                                                        <input id="opers" name="opers" type="file" placeholder="Attachment"
                                                                                            onChange={(event) => {
                                                                                                setFieldValue("opers", event.target.files[0]);
                                                                                            }}
                                                                                        />
                                                                                        {errors.opers && touched.opers ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.opers}</div>
                                                                                        ) : null} */}
                                                            {/* <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                                                    <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                                    Saya menyetujui data yang dikirimkan adalah benar
                                                                                                    {errors.accept && touched.accept ? (
                                                                                                        <div className="text-red-600 text-sm">{errors.accept}</div>
                                                                                                    ) : null}
                                                                                                </label>
                                                                                                {values.accept &&
                                                                                                    <button type="submit" className="bg-primary text-white">Submit</button>
                                                                                                } */}
                                                            {/* </Form>
                                                                                                {!values.accept &&

                                                                                                    <>
                                                                                                        <div className="border-t border-gray-200 w-full mb-4" />
                                                                                                        <Comment from="SVP - Exit Interview Form" id={id} />
                                                                                                    </>
                                                                                                } */}
                                                        </>
                                                    )}
                                                />
                                            ) : (
                                                <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                                    <i class="fas fa-check"></i>{" "}
                                                    CONFIRMED
                                                </div>
                                            )}
                                        </>
                                    ) : query.get("cv") == "true" ? (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                Upload CV
                                            </h2>
                                            <hr className="mb-3" />
                                            <Formik
                                                initialValues={{
                                                    cv: "",
                                                }}
                                                validationSchema={
                                                    ConfirmationDocument
                                                }
                                                onSubmit={async (values) => {
                                                    setIsOpen(true);
                                                    const formData =
                                                        new FormData();
                                                    formData.append(
                                                        "offboardingID",
                                                        id
                                                    );
                                                    formData.append(
                                                        "type",
                                                        "cv"
                                                    );
                                                    formData.append(
                                                        "cv",
                                                        values.cv
                                                    );
                                                    const res = await axios
                                                        .post(
                                                            "/api/requestdocument",
                                                            formData,
                                                            {
                                                                headers: {
                                                                    "Content-Type":
                                                                        "multipart/form-data",
                                                                },
                                                            }
                                                        )
                                                        .then((response) => {
                                                            console.log(
                                                                response
                                                            );
                                                            return response;
                                                        })
                                                        .catch((error) => {
                                                            // console.log(error.response)
                                                            // setSubmitted(true)
                                                            return error.response;
                                                        });
                                                    console.log(res.data);
                                                    if (res.status == "200") {
                                                        setSubmitted(true);
                                                    } else {
                                                        setSubmitted(false);
                                                    }
                                                }}
                                                render={({
                                                    values,
                                                    errors,
                                                    touched,
                                                    setFieldValue,
                                                }) => (
                                                    <Form>
                                                        <label htmlFor="cv">
                                                            CV
                                                        </label>
                                                        <input
                                                            id="cv"
                                                            name="cv"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "cv",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.cv &&
                                                        touched.cv ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.cv}
                                                            </div>
                                                        ) : null}
                                                        <button
                                                            type="submit"
                                                            className="bg-primary text-white p-3 text-lg uppercase"
                                                        >
                                                            Submit
                                                        </button>
                                                    </Form>
                                                )}
                                            />
                                        </>
                                    ) : query.get("document") == "true" ? (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                Document Exit Form (PL)
                                            </h2>
                                            <p className="text-justify">
                                                Cek outstanding per divisi
                                            </p>
                                            <hr className="mb-3" />
                                            <Formik
                                                initialValues={{
                                                    type: "",
                                                    pl: "",
                                                    paklaring: "",
                                                    // termination_letter: '',
                                                    accept: false,
                                                }}
                                                validationSchema={
                                                    ConfirmationDocument
                                                }
                                                onSubmit={async (values) => {
                                                    // setTimeout(() => {
                                                    //     alert(JSON.stringify(values, null, 2));
                                                    // }, 500)
                                                    setIsOpen(true);
                                                    const formData =
                                                        new FormData();
                                                    formData.append(
                                                        "offboardingID",
                                                        id
                                                    );
                                                    formData.append(
                                                        "type",
                                                        "PL"
                                                    );
                                                    formData.append(
                                                        "dept",
                                                        "hrss"
                                                    );
                                                    formData.append(
                                                        "pl",
                                                        values.pl
                                                    );
                                                    formData.append(
                                                        "paklaring",
                                                        values.paklaring
                                                    );
                                                    // formData.append("termination_letter", values.termination_letter);
                                                    const res = await axios
                                                        .post(
                                                            "/api/requestdocument",
                                                            formData,
                                                            {
                                                                headers: {
                                                                    "Content-Type":
                                                                        "multipart/form-data",
                                                                },
                                                            }
                                                        )
                                                        .then((response) => {
                                                            console.log(
                                                                response
                                                            );
                                                            return response;
                                                        })
                                                        .catch((error) => {
                                                            // console.log(error.response)
                                                            // setSubmitted(true)
                                                            return error.response;
                                                        });
                                                    console.log(res.data);
                                                    if (res.status == "200") {
                                                        setSubmitted(true);
                                                    } else {
                                                        setSubmitted(false);
                                                    }
                                                }}
                                                render={({
                                                    values,
                                                    errors,
                                                    touched,
                                                    setFieldValue,
                                                }) => (
                                                    <Form>
                                                        <label htmlFor="pl">
                                                            PL
                                                        </label>
                                                        <input
                                                            id="pl"
                                                            name="pl"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "pl",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.pl &&
                                                        touched.pl ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.pl}
                                                            </div>
                                                        ) : null}

                                                        <label htmlFor="paklaring">
                                                            Paklaring
                                                        </label>
                                                        <input
                                                            id="paklaring"
                                                            name="paklaring"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "paklaring",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.paklaring &&
                                                        touched.paklaring ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {
                                                                    errors.paklaring
                                                                }
                                                            </div>
                                                        ) : null}

                                                        {/* <label htmlFor="termination_letter">Termination Letter</label>
                                                                                        <input id="termination_letter" name="termination_letter" type="file" placeholder="Attachment"
                                                                                            onChange={(event) => {
                                                                                                setFieldValue("termination_letter", event.target.files[0]);
                                                                                            }}
                                                                                        />
                                                                                        {errors.termination_letter && touched.termination_letter ? (
                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.termination_letter}</div>
                                                                                        ) : null} */}

                                                        <label className="mb-4 block">
                                                            <Field
                                                                type="checkbox"
                                                                name="accept"
                                                                className="my-0 mr-2"
                                                            />
                                                            Saya menyetujui data
                                                            yang dikirimkan
                                                            adalah benar
                                                        </label>
                                                        {errors.accept &&
                                                        touched.accept ? (
                                                            <div className="mb-4 text-red-600 text-sm">
                                                                {errors.accept}
                                                            </div>
                                                        ) : null}
                                                        <button
                                                            type="submit"
                                                            className="bg-primary text-white p-3 text-lg uppercase"
                                                        >
                                                            Submit
                                                        </button>
                                                    </Form>
                                                )}
                                            />
                                        </>
                                    ) : query.get("payroll") == "true" ? (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                Payroll Approval
                                            </h2>
                                            <p className="text-justify">
                                                Approval perhitungan kompensasi
                                                karyawan keluar
                                            </p>
                                            <hr className="mb-3" />
                                            {data?.checkpoint?.confirm_fastel !=
                                                1 ||
                                            data?.checkpoint
                                                ?.confirm_kopindosat != 1 ||
                                            data?.checkpoint?.confirm_hrdev !=
                                                1 ||
                                            data?.checkpoint?.confirm_finance !=
                                                1 ||
                                            data?.checkpoint?.confirm_medical !=
                                                1 ? (
                                                <h3 className="text-xl font-bold text-center p-3 bg-red-600 text-white rounded mb-2">
                                                    Data belum lengkap
                                                </h3>
                                            ) : data?.checkpoint
                                                  ?.confirm_payroll != 1 ? (
                                                <Formik
                                                    initialValues={{
                                                        anyComment: false,
                                                        accept: false,
                                                        comment: "",
                                                    }}
                                                    validationSchema={
                                                        ConfirmationDocument
                                                    }
                                                    onSubmit={async (
                                                        values
                                                    ) => {
                                                        // setTimeout(() => {
                                                        //     alert(JSON.stringify(values, null, 2));
                                                        // }, 500)
                                                        setIsOpen(true);
                                                        const formData =
                                                            new FormData();
                                                        formData.append(
                                                            "offboardingID",
                                                            id
                                                        );
                                                        formData.append(
                                                            "dept",
                                                            "payroll"
                                                        );
                                                        // formData.append("file", values.file);
                                                        formData.append(
                                                            "process_type",
                                                            3
                                                        );
                                                        formData.append(
                                                            "accept",
                                                            values.accept
                                                        );

                                                        const res = await axios
                                                            .post(
                                                                "/api/requestdocument",
                                                                formData,
                                                                {
                                                                    headers: {
                                                                        "Content-Type":
                                                                            "multipart/form-data",
                                                                    },
                                                                }
                                                            )
                                                            .then(
                                                                (response) => {
                                                                    console.log(
                                                                        response
                                                                    );
                                                                    return response;
                                                                }
                                                            )
                                                            .catch((error) => {
                                                                // console.log(error.response)
                                                                // setSubmitted(true)
                                                                return error.response;
                                                            });
                                                        console.log(res.data);
                                                        if (
                                                            res.status == "200"
                                                        ) {
                                                            setSubmitted(true);
                                                        } else {
                                                            setSubmitted(false);
                                                        }
                                                    }}
                                                    render={({
                                                        values,
                                                        errors,
                                                        touched,
                                                        setFieldValue,
                                                    }) => (
                                                        <>
                                                            <Form>
                                                                <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                    <Field
                                                                        type="checkbox"
                                                                        name="accept"
                                                                        className="my-0 mr-2"
                                                                    />
                                                                    Approve Data
                                                                    {errors.accept ? (
                                                                        // && touched.accept
                                                                        <div className="text-red-600 text-sm">
                                                                            {
                                                                                errors.accept
                                                                            }
                                                                        </div>
                                                                    ) : null}
                                                                </label>
                                                                {values.accept && (
                                                                    <button
                                                                        type="submit"
                                                                        className="bg-primary text-white p-3 text-lg uppercase"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                )}
                                                            </Form>
                                                            {!values.accept && (
                                                                <>
                                                                    <div className="border-t border-gray-200 w-full mb-4" />
                                                                    <Comment
                                                                        from="Payroll"
                                                                        id={id}
                                                                    />
                                                                </>
                                                            )}
                                                        </>
                                                    )}
                                                />
                                            ) : (
                                                <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                                    <i class="fas fa-check"></i>{" "}
                                                    CONFIRMED
                                                </div>
                                            )}
                                        </>
                                    ) : query.get("newVersion") == "true" ? (
                                        data && (
                                            <DocExitForm
                                                id={id}
                                                setSubmitted={setSubmitted}
                                                setOpenModal={setIsOpen}
                                                checkpoint={data.checkpoint}
                                                data={data}
                                                inputToken={query.get(
                                                    "inputToken"
                                                )}
                                            />
                                        )
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold">
                                                Document Exit Form
                                            </h2>
                                            <p className="text-justify">
                                                Cek outstanding per divisi
                                            </p>
                                            <hr className="mb-3" />
                                            <Formik
                                                initialValues={{
                                                    accept: false,
                                                    fileExist: false,
                                                    dept: "",
                                                    items: [],
                                                    file: "",
                                                }}
                                                validationSchema={ExitClearance}
                                                onSubmit={async (values) => {
                                                    // setTimeout(() => {
                                                    //     alert(JSON.stringify(values, null, 2));
                                                    // }, 500)
                                                    setIsOpen(true);
                                                    const formData =
                                                        new FormData();
                                                    formData.append(
                                                        "offboardingID",
                                                        id
                                                    );
                                                    formData.append(
                                                        "dept",
                                                        values.dept
                                                    );
                                                    formData.append(
                                                        "file",
                                                        values.file
                                                    );
                                                    formData.append(
                                                        "process_type",
                                                        3
                                                    );
                                                    // formData.append('items', JSON.stringify(values.items));
                                                    // formData.append('qty', values.qty);
                                                    const res = await axios
                                                        .post(
                                                            "/api/requestdocument",
                                                            formData,
                                                            {
                                                                headers: {
                                                                    "Content-Type":
                                                                        "multipart/form-data",
                                                                },
                                                            }
                                                        )
                                                        .then((response) => {
                                                            console.log(
                                                                response
                                                            );
                                                            return response;
                                                        })
                                                        .catch((error) => {
                                                            // console.log(error.response)
                                                            // setSubmitted(true)
                                                            return error.response;
                                                        });
                                                    console.log(res.data);
                                                    if (res.status == "200") {
                                                        setSubmitted(true);
                                                    } else {
                                                        setSubmitted(false);
                                                    }
                                                }}
                                                render={({
                                                    values,
                                                    errors,
                                                    touched,
                                                    setFieldValue,
                                                }) => (
                                                    <Form>
                                                        <label htmlFor="dept">
                                                            Dept
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name="dept"
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select Dept
                                                            </option>
                                                            <option value="payroll">
                                                                Payroll
                                                            </option>
                                                            <option value="fastel">
                                                                Fastel
                                                            </option>
                                                            <option value="hrdev">
                                                                HR Dev
                                                            </option>
                                                            <option value="it">
                                                                IT
                                                            </option>
                                                            <option value="kopindosat">
                                                                Kopindosat
                                                            </option>
                                                            <option value="finance">
                                                                Finance
                                                            </option>
                                                            <option value="medical">
                                                                Medical
                                                            </option>
                                                        </Field>
                                                        {errors.dept &&
                                                        touched.dept ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.dept}
                                                            </div>
                                                        ) : null}

                                                        <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                            <Field
                                                                type="checkbox"
                                                                name="fileExist"
                                                                className="my-0 mr-2"
                                                            />
                                                            Saya menyetujui data
                                                            yang dikirimkan
                                                            adalah benar
                                                            {errors.accept &&
                                                            touched.accept ? (
                                                                <div className="text-red-600 text-sm">
                                                                    {
                                                                        errors.accept
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </label>

                                                        {/* <label className="mb-4 block">
                                                                                                                <Field type="checkbox" name="fileExist" className="my-0 mr-2" />
                                                                                                                Any Outstanding ?
                                                                                                            </label> */}
                                                        {values.fileExist && (
                                                            <>
                                                                <label htmlFor="file">
                                                                    Attachment
                                                                </label>
                                                                <input
                                                                    id="file"
                                                                    name="file"
                                                                    type="file"
                                                                    placeholder="Attachment"
                                                                    onChange={(
                                                                        event
                                                                    ) => {
                                                                        setFieldValue(
                                                                            "file",
                                                                            event
                                                                                .target
                                                                                .files[0]
                                                                        );
                                                                    }}
                                                                />
                                                                {errors.file &&
                                                                touched.file ? (
                                                                    <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                        {
                                                                            errors.file
                                                                        }
                                                                    </div>
                                                                ) : null}
                                                            </>
                                                        )}
                                                        <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                            <Field
                                                                type="checkbox"
                                                                name="accept"
                                                                className="my-0 mr-2"
                                                            />
                                                            Approve Data
                                                            {errors.accept ? (
                                                                // && touched.accept
                                                                <div className="text-red-600 text-sm">
                                                                    {
                                                                        errors.accept
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </label>

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
                                                        {values.accept && (
                                                            <button
                                                                type="submit"
                                                                className="bg-primary text-white p-3 text-lg uppercase"
                                                            >
                                                                Submit
                                                            </button>
                                                        )}
                                                    </Form>
                                                )}
                                            />
                                            <div className="border p-4">
                                                <h2 className="text-2xl font-bold">
                                                    Template Document Clearance
                                                    Form
                                                </h2>
                                                <p className="text-justify">
                                                    Download file terkait
                                                </p>
                                                <hr className="mb-3" />
                                                {templateData &&
                                                    templateData.map((item) => (
                                                        <a
                                                            download
                                                            href={item.file}
                                                            className="text-lightBlue-500 text-lg border rounded p-2 block my-1"
                                                        >
                                                            <i className="fas fa-file mr-2 text-xs"></i>
                                                            Download -{" "}
                                                            {item.name}
                                                        </a>
                                                    ))}
                                            </div>
                                        </>
                                    )
                                ) : query.get("process") == 4 ? (
                                    <>
                                        <h2 className="text-2xl font-bold">
                                            Exit Clearance
                                        </h2>
                                        <p className="text-justify">
                                            Pada aplikasi ini saudara diminta
                                            untuk mengupload scan / soft copy
                                            dari dokumen yang terlah dikirimkan
                                            lengkap beserta nomor resi
                                            pengiriman dokumen dan perangkat IT
                                        </p>
                                        <hr className="mb-3" />
                                        <Formik
                                            initialValues={{
                                                type: "",
                                                signedDocument: "",
                                                formDocument: "",
                                                opers: "",
                                                jobTransfer: "",
                                                bpjs: "",
                                                accept: false,
                                            }}
                                            validationSchema={
                                                ConfirmationDocument
                                            }
                                            onSubmit={async (values) => {
                                                // setTimeout(() => {
                                                //     alert(JSON.stringify(values, null, 2));
                                                // }, 500)
                                                setIsOpen(true);
                                                const formData = new FormData();
                                                formData.append(
                                                    "offboardingID",
                                                    id
                                                );
                                                formData.append(
                                                    "type",
                                                    values.type
                                                );
                                                formData.append(
                                                    "signedDocument",
                                                    values.signedDocument
                                                );
                                                formData.append(
                                                    "formDocument",
                                                    values.formDocument
                                                );
                                                formData.append(
                                                    "opers",
                                                    values.opers
                                                );
                                                formData.append(
                                                    "jobTransfer",
                                                    values.jobTransfer
                                                );
                                                formData.append(
                                                    "bpjs",
                                                    values.bpjs
                                                );
                                                formData.append(
                                                    "process_type",
                                                    4
                                                );
                                                // formData.append('items', JSON.stringify(values.items));
                                                // formData.append('qty', values.qty);
                                                const res = await axios
                                                    .post(
                                                        "/api/returndocument",
                                                        formData,
                                                        {
                                                            headers: {
                                                                "Content-Type":
                                                                    "multipart/form-data",
                                                            },
                                                        }
                                                    )
                                                    .then((response) => {
                                                        console.log(response);
                                                        return response;
                                                    })
                                                    .catch((error) => {
                                                        // console.log(error.response)
                                                        // setSubmitted(true)
                                                        return error.response;
                                                    });
                                                console.log(res.data);
                                                if (res.status == "200") {
                                                    setSubmitted(true);
                                                } else {
                                                    setSubmitted(false);
                                                }
                                            }}
                                            render={({
                                                values,
                                                errors,
                                                touched,
                                                setFieldValue,
                                            }) => (
                                                <>
                                                    <Form>
                                                        <label htmlFor="type">
                                                            Type
                                                        </label>
                                                        <Field
                                                            as="select"
                                                            name="type"
                                                        >
                                                            <option
                                                                value=""
                                                                disabled
                                                            >
                                                                Select Type
                                                            </option>
                                                            <option value="online">
                                                                Online
                                                            </option>
                                                            <option value="offline">
                                                                Offline
                                                            </option>
                                                        </Field>
                                                        {errors.type &&
                                                        touched.type ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.type}
                                                            </div>
                                                        ) : null}

                                                        <label htmlFor="signedDocument">
                                                            Dokumen Surat
                                                            Pernyataan Berhenti
                                                        </label>
                                                        <input
                                                            id="signedDocument"
                                                            name="signedDocument"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "signedDocument",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.signedDocument &&
                                                        touched.signedDocument ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {
                                                                    errors.signedDocument
                                                                }
                                                            </div>
                                                        ) : null}
                                                        <label htmlFor="opers">
                                                            Form Perubahan Nomor
                                                            Telepon
                                                        </label>
                                                        <input
                                                            id="opers"
                                                            name="opers"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "opers",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.opers &&
                                                        touched.opers ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.opers}
                                                            </div>
                                                        ) : null}

                                                        <label htmlFor="jobTransfer">
                                                            Surat Pengalihan
                                                            Pekerjaan
                                                        </label>
                                                        <input
                                                            id="jobTransfer"
                                                            name="jobTransfer"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "jobTransfer",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.jobTransfer &&
                                                        touched.jobTransfer ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {
                                                                    errors.jobTransfer
                                                                }
                                                            </div>
                                                        ) : null}
                                                        <label htmlFor="bpjs">
                                                            Form BPJS
                                                        </label>
                                                        <input
                                                            id="bpjs"
                                                            name="bpjs"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "bpjs",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.bpjs &&
                                                        touched.bpjs ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {errors.bpjs}
                                                            </div>
                                                        ) : null}

                                                        <label htmlFor="formDocument">
                                                            Checklist
                                                            Pengembalian Barang
                                                        </label>
                                                        <input
                                                            id="formDocument"
                                                            name="formDocument"
                                                            type="file"
                                                            placeholder="Attachment"
                                                            onChange={(
                                                                event
                                                            ) => {
                                                                setFieldValue(
                                                                    "formDocument",
                                                                    event.target
                                                                        .files[0]
                                                                );
                                                            }}
                                                        />
                                                        {errors.formDocument &&
                                                        touched.formDocument ? (
                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                                                {
                                                                    errors.formDocument
                                                                }
                                                            </div>
                                                        ) : null}

                                                        <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                            <Field
                                                                type="checkbox"
                                                                name="accept"
                                                                className="my-0 mr-2"
                                                            />
                                                            Approve Data
                                                            {errors.accept ? (
                                                                // && touched.accept
                                                                <div className="text-red-600 text-sm">
                                                                    {
                                                                        errors.accept
                                                                    }
                                                                </div>
                                                            ) : null}
                                                        </label>
                                                        {values.accept && (
                                                            <button
                                                                type="submit"
                                                                className="bg-primary text-white p-3 text-lg uppercase"
                                                            >
                                                                Submit
                                                            </button>
                                                        )}
                                                    </Form>
                                                </>
                                            )}
                                        />
                                        <div className="border p-4">
                                            <h2 className="text-2xl font-bold">
                                                Template Return Form
                                            </h2>
                                            <p className="text-justify">
                                                Download file terkait
                                            </p>
                                            <hr className="mb-3" />
                                            <a
                                                download
                                                href="/TemplateDocuments/Form Pengembalian Barang.docx"
                                                className="text-lightBlue-500 text-lg border rounded p-2 block my-1"
                                            >
                                                <i className="fas fa-file mr-2 text-xs"></i>
                                                Download - Form Pengembalian
                                                Barang
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
                                ) : query.get("process") == 5 ? (
                                    <>
                                        <h2 className="text-2xl font-bold">
                                            Check Return Document
                                        </h2>
                                        <hr className="mb-3" />
                                        {!inputToken && (
                                            <>
                                                <Formik
                                                    initialValues={{
                                                        token: "",
                                                    }}
                                                    onSubmit={async (
                                                        values
                                                    ) => {
                                                        function isTokenSame(
                                                            deptList
                                                        ) {
                                                            return (
                                                                deptList.inputToken ===
                                                                values.token
                                                            );
                                                        }
                                                        if (
                                                            deptList.find(
                                                                isTokenSame
                                                            )
                                                        ) {
                                                            setInputToken(
                                                                deptList.find(
                                                                    isTokenSame
                                                                )
                                                            );
                                                            ReadForm(
                                                                id,
                                                                deptList.find(
                                                                    isTokenSame
                                                                ).value
                                                            );
                                                        } else {
                                                            setErrorToken({
                                                                message:
                                                                    "Token Not Correct",
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Form>
                                                        <label htmlFor="token">
                                                            Input Token
                                                        </label>
                                                        <Field
                                                            id="token"
                                                            type="password"
                                                            name="token"
                                                            placeholder="Token"
                                                        />
                                                        {errorToken && (
                                                            <div className="text-red-600 text-sm -mt-4">
                                                                {
                                                                    errorToken.message
                                                                }
                                                            </div>
                                                        )}
                                                        <button
                                                            type="submit"
                                                            className="bg-primary text-white p-3 text-lg uppercase"
                                                        >
                                                            Unlock
                                                        </button>
                                                    </Form>
                                                </Formik>
                                            </>
                                        )}
                                        {inputToken && (
                                            <>
                                                {inputToken.cp != 1 && (
                                                    <Formik
                                                        initialValues={{
                                                            // type: 'confirmation',
                                                            // confirmation: false,
                                                            dept: inputToken?.value,
                                                            message: "",
                                                            accept: false,
                                                            completed: "",
                                                        }}
                                                        validationSchema={
                                                            ReturnClearance
                                                        }
                                                        onSubmit={async (
                                                            values
                                                        ) => {
                                                            setIsOpen(true);
                                                            const formData =
                                                                new FormData();
                                                            formData.append(
                                                                "offboardingID",
                                                                id
                                                            );
                                                            formData.append(
                                                                "type",
                                                                "confirmation"
                                                            );
                                                            // formData.append('confirmation', values.confirmation);
                                                            formData.append(
                                                                "dept",
                                                                values.dept
                                                            );
                                                            formData.append(
                                                                "message",
                                                                values.message
                                                            );
                                                            // formData.append("completed", values.completed);
                                                            formData.append(
                                                                "completed",
                                                                "true"
                                                            );
                                                            formData.append(
                                                                "process_type",
                                                                4
                                                            );
                                                            const res =
                                                                await axios
                                                                    .post(
                                                                        "/api/returndocument",
                                                                        formData,
                                                                        {
                                                                            headers:
                                                                                {
                                                                                    "Content-Type":
                                                                                        "multipart/form-data",
                                                                                },
                                                                        }
                                                                    )
                                                                    .then(
                                                                        (
                                                                            response
                                                                        ) => {
                                                                            console.log(
                                                                                response
                                                                            );
                                                                            return response;
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            error
                                                                        ) => {
                                                                            // console.log(error.response)
                                                                            // setSubmitted(true)
                                                                            return error.response;
                                                                        }
                                                                    );
                                                            console.log(
                                                                res.data
                                                            );
                                                            if (
                                                                res.status ==
                                                                "200"
                                                            ) {
                                                                setSubmitted(
                                                                    true
                                                                );
                                                            } else {
                                                                setSubmitted(
                                                                    false
                                                                );
                                                            }
                                                        }}
                                                        render={({
                                                            values,
                                                            errors,
                                                            touched,
                                                            setFieldValue,
                                                        }) => (
                                                            <>
                                                                <Form>
                                                                    <h3 className="text-lg font-bold mb-2">
                                                                        Dept :{" "}
                                                                        {
                                                                            inputToken.name
                                                                        }
                                                                    </h3>
                                                                    {/* <label htmlFor="dept">Dept</label>
                                                                                                        <Field as="select" name="dept">
                                                                                                            <option value="" disabled>Select Dept</option>
                                                                                                            <option value="hrss_softfile" disabled={data?.checkpoint?.return_to_hrss_doc == '1' ? true : false}>HR SS Softfile</option>
                                                                                                            <option value="hrss_it" disabled={data?.checkpoint?.return_to_hrss_it == '1' ? true : false}>HR SS IT</option>
                                                                                                            <option value="svp" disabled={data?.checkpoint?.return_to_svp == '1' ? true : false}>SVP</option>
                                                                                                        </Field>
                                                                                                        {errors.dept && touched.dept ? (
                                                                                                            <div className="-mt-4 mb-4 text-red-600 text-sm">{errors.dept}</div>
                                                                                                        ) : null} */}

                                                                    {/* {!values.completed &&
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

                                                                                                        <button type="submit" className="bg-primary text-white">Submit</button> */}
                                                                    {/* <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                                                            <Field type="checkbox" name="accept" className="my-0 mr-2" />
                                                                                                            Saya menyetujui data yang dikirimkan adalah benar
                                                                                                            {errors.accept && touched.accept ? (
                                                                                                                <div className="text-red-600 text-sm">{errors.accept}</div>
                                                                                                            ) : null}
                                                                                                        </label>
                                                                                                        {values.accept &&
                                                                                                            <button type="submit" className="bg-primary text-white p-3 text-lg uppercase">Submit</button>
                                                                                                        } */}

                                                                    <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                        <Field
                                                                            type="radio"
                                                                            name="completed"
                                                                            value="1"
                                                                            className="my-0 mr-2"
                                                                        />
                                                                        Lengkap
                                                                    </label>

                                                                    <label className="mb-4 block bg-gray-100 p-3 rounded">
                                                                        <Field
                                                                            type="radio"
                                                                            name="completed"
                                                                            value="0"
                                                                            className="my-0 mr-2"
                                                                        />
                                                                        Tidak
                                                                        Lengkap
                                                                    </label>

                                                                    {errors.completed &&
                                                                        touched.completed && (
                                                                            <div className="text-red-600 text-sm">
                                                                                {
                                                                                    errors.completed
                                                                                }
                                                                            </div>
                                                                        )}
                                                                    {values.completed ==
                                                                        "1" && (
                                                                        <button
                                                                            type="submit"
                                                                            className="bg-primary text-white p-3 text-lg uppercase"
                                                                        >
                                                                            Submit
                                                                        </button>
                                                                    )}
                                                                </Form>
                                                                {values.completed ==
                                                                    "0" && (
                                                                    <>
                                                                        <div className="border-t border-gray-200 w-full mb-4" />
                                                                        <Comment
                                                                            from={`${values.dept} - Pengecekan Dokumen`}
                                                                            id={
                                                                                id
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    />
                                                )}
                                                {inputToken.cp == 1 && (
                                                    <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                                        <i class="fas fa-check"></i>{" "}
                                                        CONFIRMED
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-4 block bg-green-300 p-3 rounded font-bold text-center text-green-700">
                                            <i class="fas fa-check"></i>{" "}
                                            CONFIRMED
                                        </div>
                                        {/* <h2 className="text-4xl font-bold text-right">
                                                                                        Don't Forget always check your offboarding status
                                                                                    </h2> */}
                                        {/* <p className="text-right">
                                                                                        <a className="border p-2 rounded text-right text-blue-600 inline-block m-2 font-semibold" href="/exitDocument">Template Exit Document</a>
                                                                                        <a className="border p-2 rounded text-right text-blue-600 inline-block m-2 font-semibold" href="/exitClearance">Template Clearance Exit</a>
                                                                                    </p> */}
                                    </>
                                )
                            ) : null}
                        </div>
                        <div className="col-lg-6 order-1 lg:order-2">
                            <CardEmployee data={data} visibility={tracking} />
                        </div>
                        <ManagerModal
                            openModal={isOpen}
                            submitted={submitted}
                            stateChanger={setIsOpen}
                        />
                    </div>
                )
            )}
        </>
    );
};

export default OffboardingForm;
