import React from "react";
import { createPopper } from "@popperjs/core";
import Comment from "../Forms/Comment";

const CommentDropdown = ({ data, text,from,to,id }) => {


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
                <i className="fas fa-ellipsis-v"></i> Give Comment
            </a>
            <div
                ref={popoverDropdownRef}
                className={
                    (dropdownPopoverShow ? "block " : "hidden ") +
                    "z-50 float-left py-2 list-none text-left rounded min-w-48"
                }
            >

                <Comment from={`HR MGR - ${to}`} id={id} />
            </div>
        </>
    );
};

export default CommentDropdown;
