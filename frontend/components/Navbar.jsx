import React from "react";
import { NavLink } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser ,faBagShopping} from "@fortawesome/free-solid-svg-icons";


const Navbar = () => {

    const tabs = [
        { name: "Home", icon: <FontAwesomeIcon icon={faHome} />, link: "/" },
        { name: "Market", icon: <FontAwesomeIcon icon={faBagShopping} />, link: "/markets" },
        { name: "Portfolio", icon: <FaWallet />, link: "/portfolio" },
        { name: "Profile", icon: <FontAwesomeIcon icon={faUser} />, link: "/profile" },
    ];

    return (
        <div className="bg-gray-800 text-white">
            <div className="flex justify-around py-2 fixed bottom-0 left-0 w-full bg-gray-900">
                <div className="flex items-center justify-around text-2xl w-full sm:w-3/4 md:w-2/4 lg:w-2/5 text-white">
                    {tabs.map((tab, index) => (
                        <NavLink
                            key={index}
                            to={tab.link}
                            className={({ isActive }) =>
                                `flex flex-col items-center text-sm ${isActive ? "text-indigo-500" : "hover:text-indigo-400"
                                }`
                            }
                        >
                            <div className="text-2xl ">{tab.icon}</div>
                            <span className="text-white font-semibold text-lg">{tab.name}</span>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
