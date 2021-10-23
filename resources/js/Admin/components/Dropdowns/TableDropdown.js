import React from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = ({ data, text }) => {

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
                {text != null? text : <i className="fas fa-ellipsis-v"></i>}
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
                        <li> {parseInt(item.data) == 1 ?
                            <i className="fas fa-check text-green-600"></i> :
                            parseInt(item.data) == 0 ?
                                <i className="fas fa-times text-red-600"></i> :
                                <i className="animate-spin fas fa-spinner text-gray-800"></i>
                        } | {item.name}</li>
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
