import React, { useEffect, useState } from "react";

export default function CardEmployee({ data, visibility, admin }) {
    const [toggle, setToggle] = useState(false);
    const [toggleAttachment, setToggleAttachment] = useState(false);
    const [togglePayroll, setTogglePayroll] = useState(false);
    const [toggleIT, setToggleIT] = useState(false);
    const {
        acc_document,
        acc_svp,
        acc_hrbp_mgr,
        acc_hrss_mgr,
        acc_fastel,
        acc_kopindosat,
        acc_it,
        acc_hrdev,
        acc_medical,
        acc_finance,
        return_svp,
        return_hrss_softfile,
        return_hrss_it,
        acc_payroll,
        acc_hrss,
        exit_interview,
    } = data.checkpoint;

    const dataCheckpoint = [
        {
            'name': 'Resignation Letter',
            'data': acc_document,
            'resign': true,
        },
        {
            'name': 'Acc Supervisor',
            'data': acc_svp,
            'link': `&process=2`,
        },
        {
            'name': 'Exit Interview',
            'data': exit_interview,
            'link': `&process=3&exitInterview=true`,
            'resign': true,
        },
        {
            'name': 'Outstanding Fastel',
            'data': acc_fastel,
            'link': `&process=3`,
        },
        {
            'name': 'Outstanding Kopindosat',
            'data': acc_kopindosat,
            'link': `&process=3`,
        },
        {
            'name': 'Outstanding IT',
            'data': acc_it,
            'link': `&process=3`,
        },
        {
            'name': 'Outstanding HR Dev',
            'data': acc_hrdev,
            'link': `&process=3`,
        },
        {
            'name': 'Outstanding Medical',
            'data': acc_medical,
            'link': `&process=3`,
        },
        {
            'name': 'Outstanding Finance',
            'data': acc_finance,
            'link': `&process=3`,
        },
        {
            'name': 'Payroll Calculated',
            'data': acc_payroll,
            'link': `&process=3&payroll=true`,
        },
        {
            'name': 'Exit Clearance by Supervisor',
            'data': return_svp,
            'link': `&process=5`,
        },
        {
            'name': 'Exit Clearance by HR Shared Service (Soft File)',
            'data': return_hrss_softfile,
            'link': `&process=5`,
        },
        {
            'name': 'Exit Clearance by HR Shared Service (IT)',
            'data': return_hrss_it,
            'link': `&process=5`,
        },
        {
            'name': 'PL,Paklaring',
            'data': acc_hrss,
            'link': `&process=3&document=true`,
            'noNeed': true,
        },
        {
            'name': 'Acc HRBP Manager',
            'data': acc_hrbp_mgr,
            'link': `&approval=hrmgr`,
        },
        {
            'name': 'Employee Return Document',
            'data': data?.status == 4 ? 1 : null,
            'link': `&process=4`,
        },
        {
            'name': 'BAST Return',
            'data': data?.details?.bast_attachment ? 1 : null,
            'link': `&bast=true`,
        },
        // {
        //     'name': 'Acc HR Shared Service Manager',
        //     'data': acc_hrss_mgr,
        // },
    ]
    const employeeAttachment = [
        { name: 'CV', file: data?.details?.employee_CV_link },
        { name: 'Personnel Letter', file: data?.details?.personnel_letter_link, noNeed: true, },
        { name: 'Payroll Calculation', file: data?.details?.payroll_link },
        { name: 'Paklaring', file: data?.details?.paklaring },
    ]
    const dataAttachment = [
        { name: 'Resign Letter', file: data?.details?.resignation_letter_link, resign: true },
        { name: 'Note Prosedur', file: data?.details?.note_procedure },
        { name: 'Interview Form', file: data?.details?.exit_interview_form, resign: true },
        // { name: 'Termination Letter', file: data?.details?.termination_letter_link },
        { name: 'Surat Pernyataan / Non Disclosure Agreement (Pernyataan, Pengalihan Pekerjaan)', file: data?.details?.exitDocument },
        { name: 'Surat Pengalihan Pekerjaan', file: data?.details?.job_tranfer_attachment },
        { name: 'Form perubahan fasilitas telepon', file: data?.details?.change_opers },
        { name: 'BAST', file: data?.details?.bast_attachment },
        { name: 'Berhenti BPJS', file: data?.details?.bpjs_attachment },
    ]
    const clearanceAttachment = [
        { name: 'Catatan Pengembalian Barang', file: data?.details?.returnDocument },
    ]
    // const payrollAttachment = [
    //     { name: 'Fastel Calculation', file: data?.exit_clearance?.attachment_fastel, status: acc_fastel },
    //     { name: 'Kopindosat Calculation', file: data?.exit_clearance?.attachment_kopindosat, status: acc_kopindosat },
    //     { name: 'HR DEV Calculation', file: data?.exit_clearance?.attachment_hrdev, status: acc_hrdev },
    //     { name: 'Medical Calculation', file: data?.exit_clearance?.attachment_medical, status: acc_medical },
    //     { name: 'Finance Calculation', file: data?.exit_clearance?.attachment_finance, status: acc_finance },
    // ]
    const payrollAttachment = [
        {
            name: 'Fastel Calculation',
            file: data?.right_obligation?.fastel,
            status: acc_fastel,
            children: ['MSISDN', 'Outstanding']
        },
        {
            name: 'Finance Calculation', file: data?.right_obligation?.finance, status: acc_finance,
            children: ['Vendor', 'Text', 'Amount'], row: true
        },
        {
            name: 'HR DEV Calculation', file: data?.right_obligation?.hrdev, status: acc_hrdev,
            children: ['Perihal', 'Tujuan', 'Tanggal Kegiatan', 'Penyelenggara', 'Periode Ikadin']
        },
        {
            name: 'Kopindosat Calculation', file: data?.right_obligation?.kopindosat, status: acc_kopindosat,
            children: ['Hak', 'Kewajiban']
        },
        {
            name: 'Medical Calculation', file: data?.right_obligation?.medical, status: acc_medical,
            children: ['Ekses Medical']
        },
    ]
    const itAttachment = {
        name: 'IT Attacgment',
        file: data?.right_obligation?.it,
        status: acc_it,
        children: ['Code', 'Item', 'Qty'],
    }
    return (
        <>
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16 lg:mt-0 border border-gray-50">
                <div className="p-6">
                    <div className="text-center px-4">
                        <h3 className="text-xl font-semibold leading-normal mb-4 text-blueGray-700">
                            {data.employee.name}
                        </h3>
                        <div className="mb-2 text-blueGray-600">
                            <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                            {data?.employee?.position}
                        </div>
                        <div className="mb-2 text-blueGray-600">
                            <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                            Indosat
                        </div>
                        <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="px-3 py-2 text-xs">ID</td>
                                <td className="px-3 py-2 text-xs">{data.employee.id}</td>
                            </tr>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="px-3 py-2 text-xs">Email</td>
                                <td className="px-3 py-2 text-xs">{data.employee.email}</td>
                            </tr>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <td className="px-3 py-2 text-xs">NIK</td>
                                <td className="px-3 py-2 text-xs">{data.employee.rawNIK}</td>
                            </tr>
                        </table>
                    </div>
                    <div className="mb-10 py-4 border-t border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full px-4">
                                <h3 className="text-gray-800 font-bold text-lg">Offboarding Detail</h3>
                                <div className="text-center whitespace-nowrap text-gray-700 justify-center w-max p-2 rounded my-1 mx-auto"
                                >
                                    <span className="font-bold">Offboarding Type :</span> {data.type_detail.name}
                                </div>
                                {admin && admin == 'true' ?
                                    <>
                                        {parseInt(data.status) >= 0 ?
                                            <div className="w-full mb-3">
                                                <span className="text-gray-800 font-semibold text-xl">{Math.round(parseInt(data.status) / 6 * 100)} % - {data?.status_details?.name}</span>
                                                <div className="relative w-full">
                                                    <div className="overflow-hidden h-3 flex rounded bg-blue-200">
                                                        <div
                                                            style={{ width: `${parseInt(data.status) / 6 * 100}%` }}
                                                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div> :
                                            <>
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 w-full px-1 rounded"
                                                >
                                                    Failed
                                                </div>
                                            </>
                                        }
                                    </> : null
                                }
                                {data?.details?.reason &&
                                    <>
                                        <p className="text-lg leading-relaxed text-blueGray-700">
                                            <strong>Reason :</strong>
                                        </p>
                                        <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                                            {data.details.reason}
                                        </p>
                                    </>
                                }
                                {visibility &&
                                    <>
                                        {visibility && visibility == 'payroll' || visibility == 'admin' || visibility == 'employee' || visibility == 'clearance' ?
                                            <>
                                                {visibility && visibility == 'employee' || visibility == 'admin' || visibility == 'clearance' ?
                                                    <div className="mb-2">
                                                        <button className="btn shadow w-full bg-blue-600 text-white mb-3" onClick={() => setToggleAttachment(!toggleAttachment)}>
                                                            Attachment - Click Here
                                                        </button>
                                                        {toggleAttachment &&
                                                            <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                <tr className="border-b-2 border-gray-300">
                                                                    <th className="px-3 py-2">Data</th>
                                                                    <th className="px-3 py-2">File</th>
                                                                </tr>

                                                                {visibility == 'admin' ? dataAttachment.map((item, i) => (
                                                                    <>
                                                                        {item.resign && data?.type.includes("e2") ? <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                            <td className="px-3 py-2 text-xs">
                                                                                {item.file ?
                                                                                    <a
                                                                                        href={item.file}
                                                                                        className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                                    >
                                                                                        <i className="fas fa-file mr-2 text-xs"></i>
                                                                                        Download
                                                                                    </a>
                                                                                    : "In progress"
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                            : null
                                                                        }
                                                                        {!item.resign ? <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                            <td className="px-3 py-2 text-xs">
                                                                                {item.file ?
                                                                                    <a
                                                                                        href={item.file}
                                                                                        className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                                    >
                                                                                        <i className="fas fa-file mr-2 text-xs"></i>
                                                                                        Download
                                                                                    </a>
                                                                                    : "In progress"
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                            : null
                                                                        }
                                                                    </>
                                                                )) : null}
                                                                {visibility == 'clearance' || visibility == 'admin' ? clearanceAttachment.map((item, i) => (
                                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                                        <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                        <td className="px-3 py-2 text-xs">
                                                                            {item.file ?
                                                                                <a
                                                                                    href={item.file}
                                                                                    className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                                >
                                                                                    <i className="fas fa-file mr-2 text-xs"></i>
                                                                                    Download
                                                                                </a>
                                                                                : "In progress"
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )) : null}
                                                                {visibility != 'clearance' ? employeeAttachment.map((item, i) => (
                                                                    <>
                                                                        {item.noNeed && data?.type.includes("e3") ?
                                                                            null :
                                                                            item.noNeed ?
                                                                                <tr className="bg-gray-100 border-b border-gray-200">
                                                                                    <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                                    <td className="px-3 py-2 text-xs">
                                                                                        {item.file ?
                                                                                            <a
                                                                                                href={item.file}
                                                                                                className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                                            >
                                                                                                <i className="fas fa-file mr-2 text-xs"></i>
                                                                                                Download
                                                                                            </a>
                                                                                            : "In progress"
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                                : null
                                                                        }
                                                                        {!item.noNeed ?
                                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                                <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                                <td className="px-3 py-2 text-xs">
                                                                                    {item.file ?
                                                                                        <a
                                                                                            href={item.file}
                                                                                            className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                                        >
                                                                                            <i className="fas fa-file mr-2 text-xs"></i>
                                                                                            Download
                                                                                        </a>
                                                                                        : "In progress"
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                            : null
                                                                        }
                                                                    </>
                                                                )) : null}
                                                            </table>
                                                        }
                                                    </div> : null
                                                }
                                                {visibility == 'admin' || visibility == 'payroll' ? <div className="mb-2">
                                                    <button className="btn shadow w-full bg-blue-600 text-white mb-3" onClick={() => setTogglePayroll(!togglePayroll)}>
                                                        Payroll Attachment - Click Here
                                                    </button>
                                                    {togglePayroll &&
                                                        <>
                                                            {/* <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                             <tr className="border-b-2 border-gray-300">
                                                                 <th className="px-3 py-2">Data</th>
                                                                 <th className="px-3 py-2">File</th>
                                                             </tr> */}
                                                            {/* {payrollAttachment.map((item, i) => (
                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                <td className="px-3 py-2 text-xs">{item.name}</td>
                                                                <td className="px-3 py-2 text-xs">
                                                                    {parseInt(item.status) == 1 && item.file ?
                                                                        // <a
                                                                        //     href={item.file}
                                                                        //     className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                        // >
                                                                        //     <i className="fas fa-file mr-2 text-xs"></i>
                                                                        //     Download
                                                                        // </a>
                                                                        JSON.stringify(item.file)
                                                                        : parseInt(item.status) == 1 ? "No Outstanding" : "In progress"
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
                                                        } */}
                                                            {payrollAttachment.map((item, i) => (
                                                                <>
                                                                    <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                        <tr className="border-b-2 border-gray-300">
                                                                            <th className="px-3 py-2" colSpan="2">{item.name}</th>
                                                                        </tr>
                                                                        {parseInt(item.status) == 1 && item.file != null && item.file != 0 ?
                                                                            <>
                                                                                {item.file && item?.file?.map((item2, j) => (
                                                                                    item.row ?
                                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                                            <td className="px-3 py-2 text-xs" colSpan="2">
                                                                                                {item.children && item?.children.map((item3, k) => (
                                                                                                    <span className={"px-2 " + (item.children.length == k + 1 ? "" : "border-r")}>
                                                                                                        <strong>{item3}</strong> : {item2[item3]}
                                                                                                    </span>
                                                                                                ))}
                                                                                            </td>
                                                                                        </tr>
                                                                                        :
                                                                                        item.children && item?.children.map((item3, k) => (
                                                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                                                <td className="px-3 py-2 text-xs" >{item3}</td>
                                                                                                <td className="px-3 py-2 text-xs">
                                                                                                    {item2[item3]}

                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                    //      {item.children && item?.children.map((item3, k) => (
                                                                                    //     <tr className="bg-gray-100 border-b border-gray-200">
                                                                                    //         <td className="px-3 py-2 text-xs" >{item3}</td>
                                                                                    //         <td className="px-3 py-2 text-xs">
                                                                                    //             {item2[item3]}
                                                                                    //              {parseInt(item.status) == 1 && item.file ?
                                                                                    //     JSON.stringify(item.file)
                                                                                    //     : parseInt(item.status) == 1 ? "No Outstanding" : "In progress"
                                                                                    // }
                                                                                    //         </td>
                                                                                    //     </tr>
                                                                                    // ))}

                                                                                ))}
                                                                            </>
                                                                            : <>
                                                                                <tr className="bg-gray-100 border-b border-gray-200">
                                                                                    <td className="px-3 py-2 text-xs" colSpan="2" >{parseInt(item.status) == 1 ? "No Outstanding" : "In progress"}</td>
                                                                                </tr>
                                                                            </>
                                                                        }
                                                                    </table>
                                                                </>
                                                            ))
                                                            }
                                                        </>
                                                    }
                                                </div> : null}

                                                {visibility == 'admin' || visibility == 'employee' ?
                                                    <div className="mb-2">
                                                        <button className="btn shadow w-full bg-blue-600 text-white mb-3" onClick={() => setToggleIT(!toggleIT)}>
                                                            IT Attachment - Click Here
                                                        </button>
                                                        {toggleIT &&
                                                            <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                <tr className="border-b-2 border-gray-300">
                                                                    <th className="px-3 py-2">Code</th>
                                                                    <th className="px-3 py-2">Item</th>
                                                                    <th className="px-3 py-2">Qty</th>
                                                                </tr>
                                                                {parseInt(itAttachment.status) == 1 && itAttachment.file != null && itAttachment.file != 0 ?
                                                                    <>
                                                                        {itAttachment.file && itAttachment?.file?.map((item2, j) => (
                                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                                <td className="px-3 py-2 text-xs" >{item2.Code}</td>
                                                                                <td className="px-3 py-2 text-xs" >{item2.Item}</td>
                                                                                <td className="px-3 py-2 text-xs" >{item2.Qty}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </>
                                                                    : <>
                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs" colSpan="2" >{parseInt(item.status) == 1 ? "No Outstanding" : "In progress"}</td>
                                                                        </tr>
                                                                    </>
                                                                }
                                                            </table>
                                                        }
                                                    </div> : null
                                                }
                                            </>
                                            : null}
                                    </>
                                }
                                <button className="btn shadow w-full bg-blue-600 text-white" onClick={() => setToggle(!toggle)}>
                                    Checkpoint Detail - Click Here
                                </button>
                                {toggle &&
                                    <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                        <tr className="border-b-2 border-gray-300">
                                            <th className="px-4 py-3">Checkpoint</th>
                                            <th className="px-4 py-3">Status</th>
                                            {visibility == "admin" ?
                                                <th className="px-4 py-3">Status</th>
                                                : null
                                            }
                                        </tr>
                                        {dataCheckpoint.map((item, i) => (
                                            <>
                                                {!item.resign && !item.noNeed ?
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <td className="px-4 py-3 text-xs">{item.name}</td>
                                                        <td className="px-4 py-3 text-xs">
                                                            {parseInt(item.data) == 1 ?
                                                                <i className="fas fa-check text-green-600"></i> :
                                                                parseInt(item.data) == 0 ?
                                                                    <i className="fas fa-times text-red-600"></i> :
                                                                    "Waiting"
                                                            }
                                                        </td>
                                                        {visibility == "admin" && item.link ?
                                                            <td className="px-4 py-3 text-xs">
                                                                <a
                                                                    href={`/offboarding/${data.id}?token=${data.token}${item?.link}`}
                                                                    className="text-blue-600"
                                                                    target="_blank"
                                                                >
                                                                    Link
                                                                </a>

                                                            </td>
                                                            : null
                                                        }
                                                    </tr>
                                                    : null
                                                }
                                                {item.resign && data?.type.includes("e2") ?
                                                    <tr className="bg-gray-100 border-b border-gray-200">
                                                        <td className="px-4 py-3 text-xs">{item.name}</td>
                                                        <td className="px-4 py-3 text-xs">
                                                            {parseInt(item.data) == 1 ?
                                                                <i className="fas fa-check text-green-600"></i> :
                                                                parseInt(item.data) == 0 ?
                                                                    <i className="fas fa-times text-red-600"></i> :
                                                                    "Waiting"
                                                            }
                                                        </td>
                                                        {visibility == "admin" && item.link ?
                                                            <td className="px-4 py-3 text-xs">
                                                                <a
                                                                    href={`/offboarding/${data.id}?token=${data.token}${item?.link}`}
                                                                    className="text-blue-600"
                                                                    target="_blank"
                                                                >
                                                                    Link
                                                                </a>

                                                            </td>
                                                            : null
                                                        }
                                                    </tr>
                                                    : null
                                                }
                                                {item.noNeed && data?.type.includes("e3") ?
                                                    null
                                                    : item.noNeed ?
                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                            <td className="px-4 py-3 text-xs">{item.name}</td>
                                                            <td className="px-4 py-3 text-xs">
                                                                {parseInt(item.data) == 1 ?
                                                                    <i className="fas fa-check text-green-600"></i> :
                                                                    parseInt(item.data) == 0 ?
                                                                        <i className="fas fa-times text-red-600"></i> :
                                                                        "Waiting"
                                                                }
                                                            </td>
                                                            {visibility == "admin" && item.link ?
                                                                <td className="px-4 py-3 text-xs">
                                                                    <a
                                                                        href={`/offboarding/${data.id}?token=${data.token}${item?.link}`}
                                                                        className="text-blue-600"
                                                                        target="_blank"
                                                                    >
                                                                        Link
                                                                    </a>

                                                                </td>
                                                                : null
                                                            }
                                                        </tr>
                                                        : null
                                                }
                                            </>
                                        ))}

                                    </table>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
