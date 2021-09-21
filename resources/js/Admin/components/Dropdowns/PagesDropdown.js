import React from "react";
import { Link } from "react-router-dom";
import { createPopper } from "@popperjs/core";

const PagesDropdown = ({ data }) => {
    // dropdown props
    const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
    const btnDropdownRef = React.createRef();
    const popoverDropdownRef = React.createRef();
    const openDropdownPopover = () => {
        createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };
    return (
        <>
            <a
                className="lg:text-white lg:hover:text-blueGray-200 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
                href="#pablo"
                ref={btnDropdownRef}
                onClick={(e) => {
                    e.preventDefault();
                    dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                }}
            >
                Navigation <i className="ml-2 fas fa-ellipsis-v text-xl"></i>
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
                }
            >
                {data && data.map((item, i) => (
                    <>
                        <span
                            className={
                                "text-sm pt-2 pb-0 px-4 font-bold block w-full whitespace-nowrap bg-transparent text-blueGray-400"
                            }
                        >
                            {item.name}
                        </span>
                        {item.children && item.children.map((item2, i) => (
                            <Link
                                to={item2.path}
                                className={
                                    "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
                                }
                            >
                                {item2.name}
                            </Link>
                        ))}
                        {i != data.length - 1 ? <div className="h-0 mx-4 my-2 border border-solid border-blueGray-100" /> : null}
                    </>
                ))}
            </div>
        </>
    );
};

export default PagesDropdown;
