import React from 'react'
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

import logo from "../../../Public/Logo Big.png"

const Footer1 = () => {
    const socmedData = [
        {
            social: "Facebook",
            url: "http://facebook.com",
            icon: <FaFacebookF />,
        },
        {
            social: "Instagram",
            url: "http://Instagram.com",
            icon: <FaInstagram />,
        },
        {
            social: "Twitter",
            url: "http://Twitter.com",
            icon: <FaTwitter />,
        },
    ]
    return (
        <footer>
            <div className="footer-wrapper">
                <div className="top-part">
                    <div className="row">
                        <div className="col-lg-6">

                            <div className="logo">
                                <a href="/" className="remove_underline inline-block">
                                    <img className="mx-auto lg:mx-0"
                                    src={logo} alt="Keina Beauty" />
                                </a>
                            </div>

                        </div>
                        <div className="col-lg-6 flex justify-center lg:justify-end">
                            <div className="social-container">
                                <div className="text-center lg:text-right">Follow Us</div>
                                {socmedData.map((item, i) => (
                                    <a key={i} href={item.url}>
                                        {item.icon}
                                    </a>
                                ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider" />
                <div className="bottom-part">
                    <div className="text-center text-sm py-4">
                        Copyright &copy; 2021
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer1
