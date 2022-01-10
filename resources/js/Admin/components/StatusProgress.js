import React, { useState } from 'react'
import TableDropdown from './Dropdowns/TableDropdown'

const StatusProgress = ({ data }) => {

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
        {
            name: 'Process 1',
            children: [
                {
                    name: 'Acc SVP',
                    data: acc_svp,
                },
            ]
        },
        {
            name: 'Process 2',
            children: [
                {
                    name: 'Exit Interview',
                    data: exit_interview,
                    resign: true,
                },
            ]
        },
        {
            name: 'Process 3',
            children: [
                {
                    name: 'Outstanding Fastel',
                    data: confirm_fastel,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Outstanding Kopindosat',
                    data: confirm_kopindosat,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Outstanding IT',
                    data: confirm_it,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Outstanding HR Dev',
                    data: confirm_hrdev,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Outstanding Medical',
                    data: confirm_medical,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Outstanding Finance',
                    data: confirm_finance,
                    link: `&process=3&newVersion=true`,
                },
                {
                    name: 'Confirmation PIC Payroll',
                    data: confirm_payroll,
                    link: `&process=3&payroll=true`,
                },
            ]
        },
        {
            name: 'Process 4',
            children: [
                {
                    name: 'Employee Return Document',
                    data: employee_return_document,
                    link: `&process=4`,
                    employee: true,
                },
            ]
        },
        {
            name: 'Process 5',
            children: [
                {
                    name: 'Exit Clearance Confirmed by SVP',
                    data: return_to_svp,
                    link: `&process=5`,
                },
                {
                    name: 'Exit Clearance Confirmed by HR Shared Service (Soft File)',
                    data: return_to_hrss_doc,
                    link: `&process=5`,
                },
                {
                    name: 'Exit Clearance Confirmed by HR Shared Service (IT)',
                    data: return_to_hrss_it,
                    link: `&process=5`,
                },
            ]
        },
        {
            name: 'Process 6',
            children: [
                {
                    name: 'Acc HRBP Manager',
                    data: acc_hrbp_mgr,
                    link: `&approval=hrmgr`,
                },
            ]
        },
    ]

    return (
        <>
            {data &&
                parseInt(data.status_id) >= 0 ?
                <div className="w-full mb-3 text-center border rounded-lg p-4">
                    <div className="text-gray-800 font-bold text-xl mb-3">Offboarding Progress</div>
                    <span className="text-gray-800 font-semibold text-xl mb-2">{Math.round(parseInt(data.status_id) / 7 * 100)} % - {data?.status_details?.name}
                    <TableDropdown ticketResign={data?.type_id} data={data?.checkpoint} text={<i className="far fa-eye inline-block text-blue-600"></i>}/>
                    </span>
                    <div className="relative w-full">
                        <div className="overflow-hidden h-4 flex rounded bg-blue-200">
                            <div
                                style={{ width: `${parseInt(data.status_id) / 7 * 100}%` }}
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                        </div>
                    </div>
                    {/* <div className="flex w-full justify-between">
                {dataCheckpoint.map((item, i) => (
                    newFunction(item,i,data)
                ))}
            </div> */}
                </div>
                :
                <>
                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 w-full px-1 rounded"
                    >
                        Failed
                    </div>
                </>
            }


        </>
    )
}

export default StatusProgress
function newFunction(item, i, data) {
    const [isOpen, setIsOpen] = useState(false);
    return <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
        <div className={`p-3 rounded-full w-max m-auto ${parseInt(data.status_id) - 1 > i ? `bg-primary text-white` : `border-primary`}`}>{item.name}</div>
        <div className={`absolute  w-full ${isOpen ? `flex` : `hidden`}`}>
            <div className="mx-auto bg-white text-gray-800 shadow-lg p-3 rounded text-xs">
                {item.children.map((item2, j) => (
                    <div>{item2.name}
                        {parseInt(item2.data) == 1 ?
                            <i className="ml-2 fas fa-check text-green-600"></i> :
                            parseInt(item2.data) == 0 ?
                                <i className="ml-2 fas fa-times text-red-600"></i> :
                                <i className="ml-2 animate-spin fas fa-spinner text-gray-800"></i>
                        }
                    </div>
                ))}
            </div>
        </div>
    </div>;
}

