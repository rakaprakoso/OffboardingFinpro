import React, { useEffect, useState } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { NumberFormat } from "../../functions/NumberFormat";
import ExitInterviewForm from "../Forms/ExitInterviewForm";
import StatusProgress from "../StatusProgress";

export default function CardEmployee({ data, visibility, admin }) {
    const [toggle, setToggle] = useState(false);
    const [toggleAttachment, setToggleAttachment] = useState(false);
    const [togglePayroll, setTogglePayroll] = useState(false);
    const [toggleIT, setToggleIT] = useState(false);
    const {
        // acc_document,
        acc_svp,
        acc_hrbp_mgr,
        acc_hrss_mgr,
        confirm_fastel,
        confirm_kopindosat,
        confirm_it,
        confirm_hrdev,
        confirm_medical,
        confirm_finance,
        return_to_svp,
        return_to_hrss_doc,
        return_to_hrss_it,
        confirm_payroll,
        employee_return_document,
        acc_hrss,
        exit_interview,
    } = data.checkpoint;

    const dataCheckpoint = [
        // {
        //     'name': 'Resignation Letter',
        //     'data': acc_document,
        //     'resign': true,
        //     // 'link': `/api/accResignDocument?`,
        //     acceptance: '/api/accResignDocument?',
        // },
        {
            'name': 'Acc SVP',
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
            'data': confirm_fastel,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding Kopindosat',
            'data': confirm_kopindosat,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding IT',
            'data': confirm_it,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding HR Dev',
            'data': confirm_hrdev,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding Medical',
            'data': confirm_medical,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding Finance',
            'data': confirm_finance,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Confirmation PIC Payroll',
            'data': confirm_payroll,
            'link': `&process=3&payroll=true`,
        },
        {
            'name': 'Employee Return Document',
            'data': employee_return_document,
            'link': `&process=4`,
            'employee': true,
        },
        // {
        //     'name': 'Employee Return Document',
        //     'data': parseInt(data?.status_id) > 4 ? 1 : null,
        //     'link': `&process=4`,
        // },
        {
            'name': 'Exit Clearance Confirmed by SVP',
            'data': return_to_svp,
            'link': `&process=5`,
        },
        {
            'name': 'Exit Clearance Confirmed by HR Shared Service (Soft File)',
            'data': return_to_hrss_doc,
            'link': `&process=5`,
        },
        {
            'name': 'Exit Clearance Confirmed by HR Shared Service (IT)',
            'data': return_to_hrss_it,
            'link': `&process=5`,
        },
        // {
        //     'name': 'PL,Paklaring',
        //     'data': acc_hrss,
        //     'link': `&process=3&document=true`,
        //     'noNeed': true,
        // },
        {
            'name': 'Acc HRBP Manager',
            'data': acc_hrbp_mgr,
            'link': `&approval=hrmgr`,
        },
        // {
        //     'name': 'BAST Return',
        //     'data': data?.details?.bast_attachment ? 1 : null,
        //     'link': `&bast=true`,
        // },
        // {
        //     'name': 'Acc HR Shared Service Manager',
        //     'data': acc_hrss_mgr,
        // },
    ]
    const dataPayroll = [
        {
            name: 'Salary',
            amount: data?.payroll?.salary,
        },
        {
            name: 'Uang Pesangon PP 35/2021',
            amount: data?.payroll?.severance_pay,
        },
        {
            name: 'Uang Penghargaan Masa Kerja (UPMK) PP 35/2021',
            amount: data?.payroll?.upmk_pay,
        },
        {
            name: 'Maksimal Jumlah Sisa Hari Cuti yang dapat Diuangkan (' + data?.payroll?.paid_leave_available + ' Hari / 25 x ' + NumberFormat(data?.payroll?.salary, 'Rp.') + ' )',
            amount: data?.payroll?.paid_leave_pay,
        },
        {
            name: 'Total',
            amount: data?.payroll?.rights_total,
        },
    ]
    const employeeAttachment = [
        { name: 'CV', file: data?.attachment?.cv_link },
        { name: 'Personnel Letter', file: data?.attachment?.personnel_letter_link, noNeed: true, },
        { name: 'Payroll Calculation', file: data?.attachment?.payroll_link },
        { name: 'Paklaring', file: data?.attachment?.clearing_document_link },
    ]
    const dataAttachment = [
        { name: 'Resign Letter', file: data?.attachment?.resignation_letter_link, resign: true },
        // { name: 'Note Prosedur', file: data?.attachment?.note_procedure },
        { name: 'Interview Form', file: data?.attachment?.exit_interview_form_link, resign: true },
        // { name: 'Termination Letter', file: data?.details?.termination_letter_link },
        { name: 'Surat Pernyataan', file: data?.attachment?.termination_letter_link },
        // { name: 'Surat Pengalihan Pekerjaan', file: data?.attachment?.job_tranfer_attachment },
        // { name: 'Form perubahan fasilitas telepon', file: data?.attachment?.change_opers },
        { name: 'BAST', file: data?.attachment?.bast_link },
        { name: 'Berhenti BPJS', file: data?.attachment?.change_bpjs_link },
    ]
    const clearanceAttachment = [
        { name: 'Catatan Pengembalian Barang', file: data?.attachment?.returnDocument },
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
            file: data?.exit_clearance?.fastel,
            status: confirm_fastel,
            children: ['MSISDN', 'Outstanding'],
            moneyType: [false, true],
        },
        {
            name: 'Finance Calculation', file: data?.exit_clearance?.finance, status: confirm_finance,
            children: ['Vendor', 'Text', 'Amount'], row: true,
        },
        {
            name: 'HR DEV Calculation', file: data?.exit_clearance?.hrdev, status: confirm_hrdev,
            children: ['Perihal', 'Tujuan', 'Tanggal Kegiatan', 'Penyelenggara', 'Periode Ikadin']
        },
        {
            name: 'Kopindosat Calculation', file: data?.exit_clearance?.kopindosat, status: confirm_kopindosat,
            children: ['Hak', 'Kewajiban', 'Selisih'],
            moneyType: [true, true, true],
        },
        {
            name: 'Medical Calculation', file: data?.exit_clearance?.medical, status: confirm_medical,
            children: ['Ekses Medical'],
            moneyType: [true],
        },
    ]
    const itAttachment = {
        name: 'IT Attachment',
        file: data?.exit_clearance?.it,
        status: confirm_it,
        children: ['Code', 'Item', 'Qty'],
    }
    return (
        <>
            <div className="relative lg:top-4 lg:sticky flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg border border-gray-50">
                <div className="p-6">
                    <div className="px-4">
                        <div className="flex justify-center flex-col lg:flex-row">
                            <div className="flex justify-center mx-10 mb-4 lg:mb-auto">
                                <div className="relative w-24 h-24">
                                    <img
                                        alt="..."
                                        src={data?.employee?.profile_pic}
                                        className="shadow-xl rounded-full align-middle border-none absolute w-full h-full object-cover object-top"
                                    />
                                </div>
                            </div>
                            <div className="text-center lg:text-left mx-10">
                                <h3 className="text-xl font-semibold leading-normal mb-4 text-blueGray-700">
                                    {data.employee.name}
                                </h3>
                                <div className="mb-2 text-blueGray-600">
                                    <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
                                    {data?.employee?.job_detail?.title}
                                </div>
                                <div className="mb-2 text-blueGray-600">
                                    <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
                                    {data?.employee?.department?.name} - {data?.employee?.department?.location?.city}
                                </div>
                            </div>
                        </div>
                        <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800 text-center ">
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
                                <td className="px-3 py-2 text-xs">{data.employee.nik}</td>
                            </tr>
                        </table>
                    </div>
                    <div className="py-4 border-t border-blueGray-200 text-center">
                        <div className="flex flex-wrap justify-center">
                            <div className="w-full px-4">
                                <h3 className="text-gray-800 font-bold text-lg">Offboarding Detail</h3>
                                <div className="text-center whitespace-nowrap text-gray-700 justify-center p-2 rounded my-1 mx-auto w-full"
                                >
                                    <span className="font-bold block md:inline">Offboarding Type :</span> {data.type_detail.name}
                                </div>
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
                                {admin && admin == 'true' &&
                                    <StatusProgress data={data}/>
                                }

                                <Accordion allowMultipleExpanded allowZeroExpanded >
                                    {visibility && visibility == 'admin' &&
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                Checkpoint Detail
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>

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
                                                                            href={item?.employee ? `/offboarding/employee/${data.id}?token=${data.employee_token}`:`/offboarding/${data.id}?token=${data.token}${item?.link}`}
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
                                                        {item.resign && data?.type_id?.includes("e2") ?
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
                                                                {visibility == "admin" && item.acceptance ?
                                                                    <>
                                                                        {item.data == null ? <td className="px-4 py-3 text-xs">
                                                                            <a
                                                                                href={`${item.acceptance}token=${data.token}&id=${data.id}&action=accept`}
                                                                                className="text-blue-600 mx-3"
                                                                            // target="_blank"
                                                                            >
                                                                                Accept
                                                                            </a>
                                                                            <a
                                                                                href={`${item.acceptance}token=${data.token}&id=${data.id}&action=reject`}
                                                                                className="text-red-600 mx-3"
                                                                            // target="_blank"
                                                                            >
                                                                                Reject
                                                                            </a>

                                                                        </td> : null
                                                                        }
                                                                    </> : null}
                                                            </tr>
                                                            : null
                                                        }
                                                        {item.noNeed && data?.type_id?.includes("e3") ?
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
                                                                        <>
                                                                            <td className="px-4 py-3 text-xs">
                                                                                <a
                                                                                    href={`/offboarding/${data.id}?token=${data.token}${item?.link}`}
                                                                                    className="text-blue-600"
                                                                                    target="_blank"
                                                                                >
                                                                                    Link
                                                                                </a>

                                                                            </td>

                                                                        </>
                                                                        : null
                                                                    }
                                                                    {visibility == "admin" && item.acceptance ?
                                                                        <>
                                                                            <td className="px-4 py-3 text-xs">
                                                                                <a
                                                                                    href={`${item.acceptance}token=${data.token}&id=${data.id}&action=accept`}
                                                                                    className="text-blue-600"
                                                                                // target="_blank"
                                                                                >
                                                                                    Accept
                                                                                </a>
                                                                                <a
                                                                                    href={`${item.acceptance}token=${data.token}&id=${data.id}&action=reject`}
                                                                                    className="text-blue-600"
                                                                                // target="_blank"
                                                                                >
                                                                                    Reject
                                                                                </a>

                                                                            </td>
                                                                        </> : null}
                                                                </tr>
                                                                : null
                                                        }
                                                    </>
                                                ))}

                                            </table>

                                        </AccordionItemPanel>
                                    </AccordionItem>
                                    }
                                    {visibility &&
                                        <>
                                            {visibility && visibility == 'payroll' || visibility == 'admin' || visibility == 'employee' || visibility == 'clearance' ?
                                                <>
                                                    {visibility && visibility == 'employee' || visibility == 'admin' ?
                                                        <AccordionItem>
                                                            {/* <div className="mb-2"> */}
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>
                                                                    Attachment
                                                                </AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel>
                                                                <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                    <tr className="border-b-2 border-gray-300">
                                                                        <th className="px-3 py-2">Data</th>
                                                                        <th className="px-3 py-2">File</th>
                                                                    </tr>

                                                                    {visibility == 'admin' ? dataAttachment.map((item, i) => (
                                                                        <>
                                                                            {item.resign && data?.type_id?.includes("e2") ? <tr className="bg-gray-100 border-b border-gray-200">
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
                                                                    {/* {visibility == 'clearance' || visibility == 'admin' ? clearanceAttachment.map((item, i) => (
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
                                                                    )) : null} */}
                                                                    {visibility != 'clearance' ? employeeAttachment.map((item, i) => (
                                                                        <>
                                                                            {item.noNeed && data?.type_id?.includes("e3") ?
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

                                                            </AccordionItemPanel>
                                                        </AccordionItem> : null


                                                    }
                                                    {visibility == 'admin' || visibility == 'employee' || visibility == 'clearance' ?
                                                        <AccordionItem>
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>
                                                                    IT Attachment
                                                                </AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel>
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
                                                                        :
                                                                        <>
                                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                                <td className="px-3 py-2 text-xs" colSpan="3" >{parseInt(itAttachment?.status) == 1 ? "No Outstanding" : "In progress"}</td>
                                                                            </tr>
                                                                        </>
                                                                    }
                                                                </table>
                                                            </AccordionItemPanel>

                                                        </AccordionItem> : null
                                                    }
                                                    {visibility == 'admin' || visibility == 'payroll' ?
                                                        <>
                                                            <AccordionItem>
                                                                <AccordionItemHeading>
                                                                    <AccordionItemButton>
                                                                        Payroll Attachment
                                                                    </AccordionItemButton>
                                                                </AccordionItemHeading>
                                                                <AccordionItemPanel>

                                                                    <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                        <tr className="border-b-2 border-gray-300">
                                                                            <th className="px-3 py-2" colSpan="2">Employee Rights</th>
                                                                        </tr>
                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs" >Durasi Masa Kerja</td>
                                                                            <td className="px-3 py-2 text-xs" >{data?.payroll?.work_duration_text}</td>
                                                                        </tr>
                                                                        {dataPayroll.map((item, i) => (
                                                                            <tr className="bg-gray-100 border-b border-gray-200">
                                                                                <td className="px-3 py-2 text-xs" >{item.name}</td>
                                                                                <td className="px-3 py-2 text-xs" >{NumberFormat(item.amount, 'Rp. ')}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </table>
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
                                                                                                            {
                                                                                                                item.moneyType[k] ? NumberFormat(item2[item3], 'Rp.')
                                                                                                                    : item2[item3]
                                                                                                            }
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
                                                                </AccordionItemPanel>

                                                            </AccordionItem>
                                                        </>
                                                        : null
                                                    }

                                                    {visibility == 'admin' || visibility == 'clearance' ?
                                                        <>
                                                            <AccordionItem>
                                                                <AccordionItemHeading>
                                                                    <AccordionItemButton>
                                                                        Catatan Pengembalian Barang
                                                                    </AccordionItemButton>
                                                                </AccordionItemHeading>
                                                                <AccordionItemPanel>

                                                                    <table className="rounded-t-lg w-full m-5 mx-auto bg-gray-200 text-gray-800">
                                                                        <tr className="border-b-2 border-gray-300">
                                                                            <th colSpan="2" className="px-3 py-2">Catatan Pengembalian Barang</th>
                                                                            {/* <th className="px-3 py-2">File</th> */}
                                                                        </tr>
                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs">{data?.offboarding_form?.return_document_form?.data[0].question}</td>
                                                                            <td className="px-3 py-2 text-xs">{data?.offboarding_form?.return_document_form?.data[0].value}</td>
                                                                        </tr>
                                                                        {data?.offboarding_form?.return_document_form?.data[1].question &&
                                                                            data?.offboarding_form?.return_document_form?.data[1].question.map((item, i) => (
                                                                                <tr className="bg-gray-100 border-b border-gray-200">
                                                                                    <td className="px-3 py-2 text-xs">{item}</td>
                                                                                    <td className="px-3 py-2 text-xs">{data?.offboarding_form?.return_document_form?.data[1]?.value[i] && data?.offboarding_form?.return_document_form?.data[1]?.value[i][0] == "1" ? "Yes" : "No"}</td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs">Return Document Type</td>
                                                                            <td className="px-3 py-2 text-xs">{data?.offboarding_form?.return_document_form?.return_type?.type}</td>
                                                                        </tr>
                                                                        {data?.offboarding_form?.return_document_form?.return_type?.data &&
                                                                            data?.offboarding_form?.return_document_form?.return_type?.data.map((item, i) => (
                                                                                <tr className="bg-gray-100 border-b border-gray-200">
                                                                                    <td className="px-3 py-2 text-xs">{item.question}</td>
                                                                                    <td className="px-3 py-2 text-xs">
                                                                                        {i != 2 ? item.value :
                                                                                            item.value != '' ?
                                                                                            <a className="text-blue-700 border-b" href={item.value} target="_blank">Link</a>
                                                                                            : '-'
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                        <tr className="bg-gray-100 border-b border-gray-200">
                                                                            <td className="px-3 py-2 text-xs">Catatan Tambahan</td>
                                                                            <td className="px-3 py-2 text-xs">{data?.offboarding_form?.return_document_form?.additional_comment}</td>
                                                                        </tr>
                                                                    </table>

                                                                </AccordionItemPanel>

                                                            </AccordionItem>

                                                        </>
                                                        : null
                                                    }


                                                    {visibility == 'admin' ?
                                                        <AccordionItem>
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>
                                                                    Exit Interview Form
                                                                </AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel>
                                                                {data && <ExitInterviewForm data={data} admin={true} />}
                                                            </AccordionItemPanel>
                                                        </AccordionItem>
                                                        : null
                                                    }
                                                </>
                                                : null
                                            }
                                        </>
                                    }


                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
