import { Formik, Field, Form, FieldArray } from "formik";
import React from "react";

import UserDropdown from "../Dropdowns/UserDropdown.js";

export default function Navbar() {
    return (
        <>
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
                <div className="w-full mx-autp items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
                    {/* Brand */}
                    <a
                        className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                    >
                        Dashboard
                    </a>
                    {/* Form */}
                    {/* <form className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3">
            <div className="relative flex w-full flex-wrap items-stretch">
              <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                placeholder="Search here..."
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-sm shadow outline-none focus:outline-none focus:ring w-full pl-10"
              />
            </div>
          </form> */}
                    {/* User */}
                    <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
                        {/* <UserDropdown /> */}
                        <Formik
                            initialValues={{
                                managerID: "",
                            }}
                            onSubmit={async (values) => {
                                const formData = new FormData();
                                formData.append("offboardingID", "value");
                                const res = await axios.post(
                                    "/api/employeeMovement",
                                    formData,
                                    {
                                        headers: {
                                            "Content-Type":
                                                "multipart/form-data",
                                        },
                                    }
                                );
                                console.log(res.data);
                            }}
                        >
                            {({ values, errors, touched, setFieldValue }) => (
                                <Form>
                                    <button
                                        type="submit"
                                        className="btn bg-primary text-white"
                                    >
                                        <i className="fas fa-sign-out-alt mr-2"></i>
                                        EM Test
                                    </button>
                                </Form>
                            )}
                        </Formik>
                        <form
                            action="/logout"
                            method="post"
                            className="md:flex hidden flex-row flex-wrap items-center lg:ml-auto mr-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={
                                    document.getElementsByTagName("META")[3]
                                        .content
                                }
                            />
                            <button className="btn bg-white text-gray-900">
                                <i className="fas fa-sign-out-alt mr-2"></i>
                                Logout
                            </button>
                        </form>
                    </ul>
                </div>
            </nav>
            {/* End Navbar */}
        </>
    );
}
