import React from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = ({ data, text, ticketResign }) => {

    const {
        // acc_document,
        acc_employee,
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
    } = data;

    const dataCheckpoint = [
        // {
        //     'name': 'Resignation Letter',
        //     'data': acc_document,
        //     'resign': true,
        //     // 'link': `/api/accResignDocument?`,
        //     acceptance: '/api/accResignDocument?',
        // },
        {
            'name': 'Confirmation by Employee',
            'data': acc_employee,
            'link': `&process=2`,
        },
        {
            'name': 'Confirmation by Line Manager',
            'data': acc_svp,
            'link': `&process=2`,
        },
        {
            'name': 'Exit Interview Confirmation by Line Manager',
            'data': exit_interview,
            'link': `&process=3&exitInterview=true`,
            'resign': true,
        },
        {
            'name': 'Outstanding by Fastel',
            'data': confirm_fastel,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding by Kopindosat',
            'data': confirm_kopindosat,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding by IT',
            'data': confirm_it,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding by HR Dev',
            'data': confirm_hrdev,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding by Medical',
            'data': confirm_medical,
            'link': `&process=3&newVersion=true`,
        },
        {
            'name': 'Outstanding by Finance',
            'data': confirm_finance,
            'link': `&process=3&newVersion=true`,
        },
        // {
        //     'name': 'Confirmation PIC Payroll',
        //     'data': confirm_payroll,
        //     'link': `&process=3&payroll=true`,
        // },
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
            'name': 'Exit Clearance Confirmed by Line Manager',
            'data': return_to_svp,
            'link': `&process=5`,
            read:true,
        },
        {
            'name': 'Exit Clearance Confirmed by HR Shared Service (Soft File)',
            'data': return_to_hrss_doc,
            'link': `&process=5`,
            read:true,
        },
        {
            'name': 'Exit Clearance Confirmed by HR Shared Service (IT)',
            'data': return_to_hrss_it,
            'link': `&process=5`,
            read:true,
        },
        // {
        //     'name': 'PL,Paklaring',
        //     'data': acc_hrss,
        //     'link': `&process=3&document=true`,
        //     'noNeed': true,
        // },
        {
            'name': 'Known by HRBP Manager',
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

    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "left-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    return (
        <>
            <a
                className="text-blueGray-500 py-1 px-3"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                    // alert(text)
                }}
            >
                {text != null ? text : <i className="fas fa-ellipsis-v"></i>}
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48 px-3"
                }
            >
                <ul className="text-xs">
                    {dataCheckpoint.map((item, i) => (
                        ((window[ticketResign] !== undefined || ticketResign.includes("e2")) || !item.resign) &&
                            <li key={i}>
                                {
                                    parseInt(item.data) == 4 &&
                                    <i className="fas fa-edit text-yellow-600"></i>
                                }
                                {
                                    parseInt(item.data) == 3 &&
                                    <i className="fas fa-envelope-open text-yellow-600"></i>
                                }
                                {
                                    parseInt(item.data) == 2 &&
                                    <i className="fas fa-envelope text-blue-600"></i>
                                }
                                {
                                    parseInt(item.data) == 1 ?
                                        <i className="fas fa-check text-green-600"></i> :

                                        parseInt(item.data) == 0 && item?.read ?
                                            <i class="fas fa-edit text-yellow-600"></i>
                                            :
                                            parseInt(item.data) == 0 ?
                                                <i className="fas fa-times text-red-600"></i> :
                                                item.data == null &&
                                                <i className="animate-spin fas fa-spinner text-gray-800"></i>
                                }
                                <span className="ml-2">| {item.name}</span>
                            </li>
                    ))}
                </ul>
                {/* <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Action
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Another action
        </a>
        <a
          href="#pablo"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={(e) => e.preventDefault()}
        >
          Something else here
        </a> */}
            </div>
        </>
    );
};

export default NotificationDropdown;
