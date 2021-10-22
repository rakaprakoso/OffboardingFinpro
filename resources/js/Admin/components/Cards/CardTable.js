import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Moment from 'react-moment';

// components

import TableDropdown from "../Dropdowns/TableDropdown.js";
import { Link } from "react-router-dom";
import TableFilter from 'react-table-filter';
var tablesort = require('tablesort');

export default function CardTable({ color }) {

    const [offboardingData, setOffboardingData] = useState(null);

    useEffect(async () => {

        const dataFetch = await axios
            .get(`/api/offboarding`)
            .then(function (response) {
                console.log(response);
                // return response.data;
                return response;
            })
            .catch(function (error) {
                return 404;
                console.log(error);
            });
        // console.log(dataFetch.cartSession[5]);
        // setRawData(dataFetch);
        if (dataFetch.status == 200) {
            setOffboardingData(dataFetch.data);
        } else {
            setOffboardingData(dataFetch);
        }

        new tablesort(document.getElementById('employee-table'));

    }, []);

    return (
        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                    (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                            >
                                Offboarding List
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Projects table */}
                    <table className="items-center w-full bg-transparent border-collapse sort" id="employee-table">
                        <thead>
                            <tr>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    No.
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Name
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Type
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Issue Date
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Effective Date
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Status
                                </th>
                                {/* <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Users
                                </th> */}
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Completion
                                </th>
                                <th
                                    className={
                                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                        (color === "light"
                                            ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                            : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                    }
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {offboardingData && offboardingData.length == 0 ?
                                <tr>
                                    <td colSpan="8" className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6 text-center items-center">
                                        Data Not Found
                                    </td>
                                </tr>
                                : null
                            }
                            {offboardingData && offboardingData.map((item, i) => (
                                <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6">
                                        {i+1}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6 text-left flex items-center">
                                        {/* <img
                                            src={require("../../assets/img/bootstrap.jpg").default}
                                            className="h-12 w-12 bg-white rounded-full border"
                                            alt="..."
                                        ></img>{" "} */}
                                        <span
                                            className={
                                                "font-bold " +
                                                +(color === "light" ? "text-blueGray-600" : "text-white")
                                            }
                                        >
                                            {item.employee.name} - {item.employee.nik}
                                        </span>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6">
                                        {item?.type_detail?.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6"
                                        data-sort={item.created_at}
                                    >
                                        <Moment format="DD MMMM YYYY">
                                            {item.created_at}
                                        </Moment>

                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6"
                                        data-sort={item.effective_date}
                                    >
                                        <Moment format="DD MMMM YYYY">
                                            {item.effective_date}
                                        </Moment>

                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6">
                                        <i
                                            className={
                                                "fas fa-circle mr-2 " +
                                                (parseInt(item.status_id) < 0 ? "text-red-600" : "text-green-600")
                                            }
                                        ></i>
                                        {item?.status_details?.name}
                                    </td>
                                    {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6">
                                        <div className="flex">
                                            <img
                                                src={require("../../assets/img/team-1-800x800.jpg").default}
                                                alt="..."
                                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                            ></img>
                                            <img
                                                src={require("../../assets/img/team-2-800x800.jpg").default}
                                                alt="..."
                                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                            ></img>
                                            <img
                                                src={require("../../assets/img/team-3-800x800.jpg").default}
                                                alt="..."
                                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                            ></img>
                                            <img
                                                src={require("../../assets/img/team-4-470x470.png").default}
                                                alt="..."
                                                className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                            ></img>
                                        </div>
                                    </td> */}
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6"
                                        data-sort={item.status_id}
                                    >
                                        <div className="flex items-center">
                                            {parseInt(item.status_id) >= 0 ?
                                                <>
                                                    <span className="mr-2">{Math.round(parseInt(item.status_id) / 7 * 100)} %</span>
                                                    <div className="relative w-full">
                                                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                                                            <div
                                                                style={{ width: `${parseInt(item.status_id) / 7 * 100}%` }}
                                                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </> :
                                                <>
                                                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 w-full px-1 rounded text-xs"
                                                    >
                                                        Failed
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-6">
                                        <Link
                                            className="shadow-none text-center whitespace-nowrap text-white justify-center bg-blue-600 px-2 rounded"
                                            to={`/admin/offboarding/${item.id}`}
                                        >
                                            <i className="far fa-eye inline-block mr-1"></i>
                                            Details
                                        </Link>
                                        <TableDropdown data={item.checkpoint} />
                                    </td>
                                </tr>

                            ))}
                            {/* <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                    <img
                                        src={require("../../assets/img/angular.jpg").default}
                                        className="h-12 w-12 bg-white rounded-full border"
                                        alt="..."
                                    ></img>{" "}
                                    <span
                                        className={
                                            "ml-3 font-bold " +
                                            +(color === "light" ? "text-blueGray-600" : "text-white")
                                        }
                                    >
                                        Angular Now UI Kit PRO
                                    </span>
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    $1,800 USD
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <i className="fas fa-circle text-emerald-500 mr-2"></i>{" "}
                                    completed
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex">
                                        <img
                                            src={require("../../assets/img/team-1-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-2-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-3-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-4-470x470.png").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <span className="mr-2">100%</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                                                <div
                                                    style={{ width: "100%" }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <TableDropdown />
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                    <img
                                        src={require("../../assets/img/sketch.jpg").default}
                                        className="h-12 w-12 bg-white rounded-full border"
                                        alt="..."
                                    ></img>{" "}
                                    <span
                                        className={
                                            "ml-3 font-bold " +
                                            +(color === "light" ? "text-blueGray-600" : "text-white")
                                        }
                                    >
                                        Black Dashboard Sketch
                                    </span>
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    $3,150 USD
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <i className="fas fa-circle text-red-500 mr-2"></i> delayed
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex">
                                        <img
                                            src={require("../../assets/img/team-1-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-2-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-3-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-4-470x470.png").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <span className="mr-2">73%</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
                                                <div
                                                    style={{ width: "73%" }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <TableDropdown />
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                    <img
                                        src={require("../../assets/img/react.jpg").default}
                                        className="h-12 w-12 bg-white rounded-full border"
                                        alt="..."
                                    ></img>{" "}
                                    <span
                                        className={
                                            "ml-3 font-bold " +
                                            +(color === "light" ? "text-blueGray-600" : "text-white")
                                        }
                                    >
                                        React Material Dashboard
                                    </span>
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    $4,400 USD
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <i className="fas fa-circle text-teal-500 mr-2"></i> on
                                    schedule
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex">
                                        <img
                                            src={require("../../assets/img/team-1-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-2-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-3-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-4-470x470.png").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <span className="mr-2">90%</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-teal-200">
                                                <div
                                                    style={{ width: "90%" }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <TableDropdown />
                                </td>
                            </tr>
                            <tr>
                                <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left flex items-center">
                                    <img
                                        src={require("../../assets/img/vue.jpg").default}
                                        className="h-12 w-12 bg-white rounded-full border"
                                        alt="..."
                                    ></img>{" "}
                                    <span
                                        className={
                                            "ml-3 font-bold " +
                                            +(color === "light" ? "text-blueGray-600" : "text-white")
                                        }
                                    >
                                        React Material Dashboard
                                    </span>
                                </th>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    $2,200 USD
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <i className="fas fa-circle text-emerald-500 mr-2"></i>{" "}
                                    completed
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex">
                                        <img
                                            src={require("../../assets/img/team-1-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-2-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-3-800x800.jpg").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                        <img
                                            src={require("../../assets/img/team-4-470x470.png").default}
                                            alt="..."
                                            className="w-10 h-10 rounded-full border-2 border-blueGray-50 shadow -ml-4"
                                        ></img>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                    <div className="flex items-center">
                                        <span className="mr-2">100%</span>
                                        <div className="relative w-full">
                                            <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
                                                <div
                                                    style={{ width: "100%" }}
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-right">
                                    <TableDropdown />
                                </td>
                            </tr>
                         */}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

CardTable.defaultProps = {
    color: "light",
};

CardTable.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
