import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios"

import { IoCartOutline, IoHeartOutline, IoEnterOutline, IoDocumentTextOutline } from "react-icons/io5";
import { FiMenu, FiChevronsRight } from "react-icons/fi";

import { Navigation } from 'react-minimal-side-navigation';
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import { ProSidebar, SidebarHeader, SidebarFooter, SidebarContent, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// import 'react-pro-sidebar/dist/css/styles.css';

import logo from "../../Public/Logo Big.png"
import { fetchCart } from '../redux/actions/globalAction'
import { connect, useSelector, useDispatch } from 'react-redux'

const mapStateToProps = (state) => {
    return {
        totalCart: state.totalCart,
        cartData: state.cartData,
    }
}

const Header = (props) => {

    const history = useHistory();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const cartCounter = props.totalCart;

    // useEffect(async () => {
    //     const dataFetch = await axios
    //         .get("/api/cart")
    //         .then(function (response) {
    //             // console.log(response);
    //             return response.data;
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });


    //     setCartCounter(dataFetch.qtyTotal);
    //     // setCartCounter(props.order);
    //     console.log(props.order);
    //     // setData(dataFetch.cart);
    // }, []);

    const dispatch = useDispatch();
    useEffect(() => {
        const loadCart = async () => {
            // setIsLoading(true);
            await dispatch(fetchCart());
            // setIsLoading(false);
        };
        loadCart();
    }, [dispatch]);

    return (
        <header className="site-header shadow-lg">
            <div className="header-wrapper">
                <div className="top-part">
                    <div className="head-content justify-between">
                        <button className="mobile-nav-toggle"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            type="button"
                        >
                            <div className="icon-hvr"><FiMenu /></div>
                        </button>
                        <div className="site-branding">
                            <div className="site-title">
                                <a href="/" className="remove_underline">
                                    <div className="logo">
                                        <img src={logo} alt="Keina Beauty" />
                                    </div>
                                </a>
                            </div>
                        </div>
                        <nav className="hidden lg:flex items-center">
                            <ul>
                                {dataHeader.map((item, i) => (
                                    <li className="hvr hvr-underline-from-center">
                                        <a href={item.itemId}>{item.title}</a>
                                    </li>
                                ))
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div
                className={`sidebar block md:hidden fixed inset-y-0 right-0 z-30 w-3/4 shadow overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "ease-out translate-x-0" : "ease-in translate-x-full"
                    }`}
            >
                <div className="header-wrapper py-8">

                    <div className="top-sidebar flex flex-col">
                        <div className="button-container relative ml-auto">
                            <button className="mobile-nav-toggle button-hvr"
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                type="button"
                            >
                                <FiChevronsRight />
                            </button>
                        </div>
                        <div className="logo mr-auto pr-4">
                            <img src={logo} alt="Keina Beauty" />
                        </div>
                    </div>
                    <div className="divider mt-2" />
                    <nav>
                        <ul>
                            {dataHeader.map((item, i) => (
                                <li className="my-2">
                                    <a className="hvr hvr-underline-from-center" href={item.itemId}>{item.title}</a>
                                </li>
                            ))
                            }
                        </ul>
                    </nav>
                    <div className="divider" />
                    <div className="flex justify-center">
                        <ul className="icon-nav">
                            {dataIconHeader.map((item, i) => (
                                <li>
                                    <a href={item.path}>
                                        <div className="icon icon-hvr">
                                            {item.icon}
                                        </div>
                                        <div className={`counter bg-red-700
                                            text-gray-50 w-4 h-4 text-xs rounded-full
                                            absolute right-1 top-1 text-center
                                            ${item.counter ? '' : 'hidden'}`}>
                                            {props.cartData?.qtyTotal || 0}
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>


                {/* <ProSidebar rtl={true}>
                        <SidebarHeader>
                        </SidebarHeader>
                        <SidebarContent>
                            <Menu iconShape="square">
                                <MenuItem
                                // icon={<FaGem />}
                                >Dashboard</MenuItem>
                                <SubMenu title="Components"
                                // icon={<FaHeart />}
                                >
                                    <MenuItem>Component 1</MenuItem>
                                    <MenuItem>Component 2</MenuItem>
                                </SubMenu>
                            </Menu>
                        </SidebarContent>
                    </ProSidebar> */}

                {/* <div className="flex items-center justify-center mt-10 text-center py-6">
                        <span className="mx-2 text-2xl font-semibold text-black">
                            react-minimal-side-navigation
                        </span>
                    </div>


                    <Navigation
                        // you can use your own router's api to get pathname
                        activeItemId={location.pathname}
                        onSelect={({ itemId }) => {
                            history.push(itemId);
                        }}
                        items={dataHeader}
                    /> */}


            </div>
            {/* <div className="block md:hidden">

                </div> */}
        </header>

    )
}

export default connect(mapStateToProps)(Header);

const dataHeader = [
    {
        title: 'About',
        itemId: '/about',
        // elemBefore: () => <Icon name="inbox" />,
    },
    {
        title: 'Products',
        itemId: '/shop',
        subNav: [
            {
                title: 'Skin Care',
                itemId: '/shop/skin-care',
            },
            {
                title: 'Body Treatment',
                itemId: '/shop/body-treatment',
            },
        ],
    },
    // {
    //     title: 'Article',
    //     itemId: '/article',
    // },
    {
        title: 'Join Campaign',
        itemId: 'https://lindungihutan.com/keinabeauty',
    },
]

const dataIconHeader = [
    // {
    //     path: '/favorites',
    //     icon: <IoHeartOutline />,
    // },
    {
        path: '/cart',
        icon: <IoCartOutline />,
        counter: true,
    },
    {
        path: '/order',
        icon: <IoDocumentTextOutline />,
        counter: false,
    },
    // {
    //     path: '/login',
    //     icon: <IoEnterOutline />,
    // },
]
