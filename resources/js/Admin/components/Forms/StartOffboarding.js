import React, { useState, useEffect } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import axios from "axios";
import { useParams, useLocation, useRouteMatch } from "react-router-dom";
import ManagerModal from "../Modals/ManagerModal";
import { isNull } from "lodash";
import { IoTrashBin } from "react-icons/io5";

import * as Yup from "yup";
import SubmitResignModal from "../Modals/SubmitResignModal";
import moment from "moment";

export default function StartOffboarding() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const match = useRouteMatch("/newOffboarding");
    // if (match) {
    //     setAdmin(true);
    // }
    const dateMin = (date = null, type = "normal") => {
        if (type == "verification") {
            var dtToday = moment(date).add(1, "M").subtract(1, "days");
            date = dtToday.format("YYYY-MM-DD");
            return date;
        }
        var dtToday = moment(date).add(1, "M");
        date = dtToday.format("YYYY-MM-DD");
        return date;
    };

    const OffboardingSchema = match
        ? Yup.object().shape({
              employeeID: Yup.string().required("Required").nullable(),
              type: Yup.string().required("Required").nullable(),
              svpID: Yup.string().required("Required").nullable(),
              svpPassword: Yup.string().required("Required").nullable(),
              accept: Yup.bool().oneOf(
                  [true],
                  "Accept Terms & Conditions is required"
              ),
              effectiveDate: Yup.date("Invalid Date")
                  .required("Required")
                  .min(
                      new Date(dateMin(new Date(), "verification")),
                      "At least 1 month"
                  ),
          })
        : Yup.object().shape({
              employeeID: Yup.string().required("Required").nullable(),
              type: Yup.string().required("Required").nullable(),
              accept: Yup.bool().oneOf(
                  [true],
                  "Accept Terms & Conditions is required"
              ),
              effectiveDate: Yup.date("Invalid Date")
                  .required("Required")
                  .min(
                      new Date(dateMin(new Date(), "verification")),
                      "At least 1 month"
                  ),
          });
    return (
        <>
            <h2 className="text-2xl font-bold">New Offboarding</h2>
            <hr className="mb-3" />
            <Formik
                initialValues={{
                    employeeID: "",
                    svpID: "",
                    svpPassword: "",
                    type: "",
                    effectiveDate: "",
                    resignLetter: "",
                    accept: false,
                }}
                validationSchema={OffboardingSchema}
                onSubmit={async (values) => {
                    setIsOpen(true);
                    setSubmitted("loading");
                    const formData = new FormData();
                    formData.append("employeeID", values.employeeID);
                    formData.append("svpID", values.svpID);
                    formData.append("svpPassword", values.svpPassword);
                    formData.append("type", values.type);
                    formData.append("resign_letter", values.resignLetter);
                    formData.append("effective_date", values.effectiveDate);
                    formData.append("admin", "true");
                    if (match) {
                        formData.append("adminPublic", "true");
                    }
                    const res = await axios
                        .post("/api/resignform", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                            // });
                        })
                        .then((response) => {
                            console.log(response);
                            return response;
                        })
                        .catch((error) => {
                            console.log(error.response);
                            // setSubmitted(true)
                            // setSubmitted(false)
                            return error.response;
                        });
                    // console.log(res.data);
                    if (res.status == "200") {
                        setSubmitted(true);
                    } else {
                        setSubmitted(false);
                    }
                    // console.log(res.data);
                    // setSubmitted(true)
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <label htmlFor="employeeID">Employee ID</label>
                        <Field
                            id="employeeID"
                            name="employeeID"
                            placeholder="Employee ID"
                        />
                        {errors.employeeID && touched.employeeID ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                {errors.employeeID}
                            </div>
                        ) : null}

                        <label htmlFor="type">Type Offboarding</label>
                        <Field as="select" name="type">
                            <option value="" disabled>
                                Select type offboarding
                            </option>
                            <option value="e101">Pensiun Usia</option>
                            <option value="e102">Pensiun Dini</option>
                            <option value="e103">Meninggal Dunia</option>
                            <option value="e201">Pengunduran Diri</option>
                            <option value="e202">Pengunduran Diri APS</option>
                            <option value="e301">
                                Pemberhentian Tidak Hormat
                            </option>
                            <option value="e302">
                                Pemberhentian Bukan Atas Permintaan
                            </option>
                            <option value="e303">
                                Karyawan yang didiskualifikasi mengundurkan diri
                            </option>
                        </Field>
                        {errors.type && touched.type ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                {errors.type}
                            </div>
                        ) : null}
                        {values.type == "e201" || values.type == "e202" ? (
                            <>
                                <label htmlFor="resignLetter">
                                    Resign Letter
                                </label>
                                <input
                                    id="resignLetter"
                                    name="resignLetter"
                                    type="file"
                                    placeholder="Resign Letter"
                                    onChange={(event) => {
                                        setFieldValue(
                                            "resignLetter",
                                            event.target.files[0]
                                        );
                                    }}
                                />
                                {errors.resignLetter && touched.resignLetter ? (
                                    <div className="-mt-4 mb-4 text-red-600 text-sm">
                                        {errors.resignLetter}
                                    </div>
                                ) : null}
                            </>
                        ) : null}

                        {match && (
                            <>
                                <label htmlFor="svpID">SVP ID</label>
                                <Field
                                    id="svpID"
                                    name="svpID"
                                    placeholder="SVP ID"
                                />
                                {errors.svpID && touched.svpID ? (
                                    <div className="-mt-4 mb-4 text-red-600 text-sm">
                                        {errors.svpID}
                                    </div>
                                ) : null}

                                <label htmlFor="svpPassword">
                                    SVP Password
                                </label>
                                <Field
                                    id="svpPassword"
                                    name="svpPassword"
                                    type="password"
                                    placeholder="SVP Password"
                                />
                                {errors.svpPassword && touched.svpPassword ? (
                                    <div className="-mt-4 mb-4 text-red-600 text-sm">
                                        {errors.svpPassword}
                                    </div>
                                ) : null}
                            </>
                        )}

                        <label htmlFor="effectiveDate">Effective Date</label>
                        <Field
                            type="date"
                            id="effectiveDate"
                            min={dateMin(new Date())}
                            name="effectiveDate"
                        />
                        {errors.effectiveDate && touched.effectiveDate ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                {errors.effectiveDate}
                            </div>
                        ) : null}

                        {errors.status && touched.status ? (
                            <div className="-mt-4 mb-4 text-red-600 text-sm">
                                {errors.status}
                            </div>
                        ) : null}
                        <label className="mb-4">
                            <Field
                                type="checkbox"
                                name="accept"
                                className="my-0 mr-2"
                            />
                            Accept, declare it's true
                        </label>
                        {errors.accept && touched.accept ? (
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
            </Formik>
            <SubmitResignModal
                openModal={isOpen}
                submitted={submitted}
                stateChanger={setIsOpen}
            />
        </>
    );
}
