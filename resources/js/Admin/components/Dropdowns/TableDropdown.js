import React from "react";
import { createPopper } from "@popperjs/core";

const NotificationDropdown = ({ data }) => {

    const dataCheckpoint = [
        // {
        //     'name': 'Resignation Letter',
        //     'data': data?.acc_document,
        // },
        {
            'name': 'Acc Supervisor',
            'data': data?.acc_svp,
        },
        {
            'name': 'Exit Interview',
            'data': data?.exit_interview,
        },
        {
            'name': 'Outstanding Fastel',
            'data': data?.acc_fastel,
        },
        {
            'name': 'Outstanding Kopindosat',
            'data': data?.acc_kopindosat,
        },
        {
            'name': 'Outstanding IT',
            'data': data?.acc_it,
        },
        {
            'name': 'Outstanding HR Dev',
            'data': data?.acc_hrdev,
        },
        {
            'name': 'Outstanding Medical',
            'data': data?.acc_medical,
        },
        {
            'name': 'Outstanding Finance',
            'data': data?.acc_finance,
        },
        {
            'name': 'Payroll Calculated',
            'data': data?.acc_payroll,
        },
        {
            'name': 'Exit Clearance by Supervisor',
            'data': data?.return_svp,
        },
        {
            'name': 'Exit Clearance by HR Shared Service (Soft File)',
            'data': data?.return_hrss_softfile,
        },
        {
            'name': 'Exit Clearance by HR Shared Service (IT)',
            'data': data?.return_hrss_it,
        },
        {
            'name': 'Acc HR Shared Service (PL,Paklaring)',
            'data': data?.acc_hrss,
        },
        {
            'name': 'Acc HRBP Manager',
            'data': data?.acc_hrbp_mgr,
        },
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
                }}
            >
                <i className="fas fa-ellipsis-v"></i>
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
