import React, { useEffect, useState } from "react";

export default function CardEmployee({ data, visibility }) {
    const [toggle, setToggle] = useState(false);
    const [toggleAttachment, setToggleAttachment] = useState(false);
    const [togglePayroll, setTogglePayroll] = useState(false);
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
    const payrollAttachment = [
        { name: 'Fastel Calculation', file: data?.exit_clearance?.attachment_fastel, status: acc_fastel },
        { name: 'Kopindosat Calculation', file: data?.exit_clearance?.attachment_kopindosat, status: acc_kopindosat },
        { name: 'HR DEV Calculation', file: data?.exit_clearance?.attachment_hrdev, status: acc_hrdev },
        { name: 'Medical Calculation', file: data?.exit_clearance?.attachment_medical, status: acc_medical },
        { name: 'Finance Calculation', file: data?.exit_clearance?.attachment_finance, status: acc_finance },
    ]
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
                        <table class="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                            <tr class="bg-gray-100 border-b border-gray-200">
                                <td class="px-3 py-2 text-xs">ID</td>
                                <td class="px-3 py-2 text-xs">{data.employee.id}</td>
                            </tr>
                            <tr class="bg-gray-100 border-b border-gray-200">
                                <td class="px-3 py-2 text-xs">Email</td>
                                <td class="px-3 py-2 text-xs">{data.employee.email}</td>
                            </tr>
                            <tr class="bg-gray-100 border-b border-gray-200">
                                <td class="px-3 py-2 text-xs">NIK</td>
                                <td class="px-3 py-2 text-xs">{data.employee.rawNIK}</td>
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
                                {data.details.reason &&
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
                                                        <button className="btn shadow w-full bg-gray-100 mb-3" onClick={() => setToggleAttachment(!toggleAttachment)}>
                                                            Attachment - Click Here
                                                        </button>
                                                        {toggleAttachment &&
                                                            <table class="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                <tr class="border-b-2 border-gray-300">
                                                                    <th class="px-3 py-2">Data</th>
                                                                    <th class="px-3 py-2">File</th>
                                                                </tr>

                                                                {visibility == 'admin' ? dataAttachment.map((item, i) => (
                                                                    <>
                                                                        {item.resign && data?.type.includes("e2") ? <tr class="bg-gray-100 border-b border-gray-200">
                                                                            <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                            <td class="px-3 py-2 text-xs">
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
                                                                        {!item.resign ? <tr class="bg-gray-100 border-b border-gray-200">
                                                                            <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                            <td class="px-3 py-2 text-xs">
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
                                                                    <tr class="bg-gray-100 border-b border-gray-200">
                                                                        <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                        <td class="px-3 py-2 text-xs">
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
                                                                                <tr class="bg-gray-100 border-b border-gray-200">
                                                                                    <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                                    <td class="px-3 py-2 text-xs">
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
                                                                            <tr class="bg-gray-100 border-b border-gray-200">
                                                                                <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                                <td class="px-3 py-2 text-xs">
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
                                                    <button className="btn shadow w-full bg-gray-100 mb-3" onClick={() => setTogglePayroll(!togglePayroll)}>
                                                        Payroll Attachment - Click Here
                                                    </button>
                                                    {togglePayroll && <table class="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                        <tr class="border-b-2 border-gray-300">
                                                            <th class="px-3 py-2">Data</th>
                                                            <th class="px-3 py-2">File</th>
                                                        </tr>
                                                        {payrollAttachment.map((item, i) => (
                                                            <tr class="bg-gray-100 border-b border-gray-200">
                                                                <td class="px-3 py-2 text-xs">{item.name}</td>
                                                                <td class="px-3 py-2 text-xs">
                                                                    {parseInt(item.status) == 1 && item.file ?
                                                                        <a
                                                                            href={item.file}
                                                                            className="text-xs text-lightBlue-500 border rounded px-2 inline-block"
                                                                        >
                                                                            <i className="fas fa-file mr-2 text-xs"></i>
                                                                            Download
                                                                        </a>
                                                                        : parseInt(item.status) == 1 ? "No Outstanding" : "In progress"
                                                                    }
                                                                </td>
                                                            </tr>
                                                        ))
                                                        }
                                                    </table>
                                                    }
                                                </div> : null}
                                            </>
                                            : null}
                                    </>
                                }
                                <button className="btn shadow w-full bg-gray-100" onClick={() => setToggle(!toggle)}>
                                    Checkpoint Detail - Click Here
                                </button>
                                {toggle &&
                                    <table class="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                        <tr class="border-b-2 border-gray-300">
                                            <th class="px-4 py-3">Checkpoint</th>
                                            <th class="px-4 py-3">Status</th>
                                            {visibility == "admin" ?
                                                <th class="px-4 py-3">Status</th>
                                                : null
                                            }
                                        </tr>
                                        {dataCheckpoint.map((item, i) => (
                                            <>
                                                {!item.resign && !item.noNeed ?
                                                    <tr class="bg-gray-100 border-b border-gray-200">
                                                        <td class="px-4 py-3 text-xs">{item.name}</td>
                                                        <td class="px-4 py-3 text-xs">
                                                            {parseInt(item.data) == 1 ?
                                                                <i class="fas fa-check text-green-600"></i> :
                                                                parseInt(item.data) == 0 ?
                                                                    <i class="fas fa-times text-red-600"></i> :
                                                                    "Waiting"
                                                            }
                                                        </td>
                                                        {visibility == "admin" && item.link ?
                                                            <td class="px-4 py-3 text-xs">
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
                                                    <tr class="bg-gray-100 border-b border-gray-200">
                                                        <td class="px-4 py-3 text-xs">{item.name}</td>
                                                        <td class="px-4 py-3 text-xs">
                                                            {parseInt(item.data) == 1 ?
                                                                <i class="fas fa-check text-green-600"></i> :
                                                                parseInt(item.data) == 0 ?
                                                                    <i class="fas fa-times text-red-600"></i> :
                                                                    "Waiting"
                                                            }
                                                        </td>
                                                        {visibility == "admin" && item.link ?
                                                            <td class="px-4 py-3 text-xs">
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
                                                        <tr class="bg-gray-100 border-b border-gray-200">
                                                            <td class="px-4 py-3 text-xs">{item.name}</td>
                                                            <td class="px-4 py-3 text-xs">
                                                                {parseInt(item.data) == 1 ?
                                                                    <i class="fas fa-check text-green-600"></i> :
                                                                    parseInt(item.data) == 0 ?
                                                                        <i class="fas fa-times text-red-600"></i> :
                                                                        "Waiting"
                                                                }
                                                            </td>
                                                            {visibility == "admin" && item.link ?
                                                                <td class="px-4 py-3 text-xs">
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
