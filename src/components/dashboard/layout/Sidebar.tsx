import React from 'react';
import {Link} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes, faTruck, faHome, faUsers, faMapMarkedAlt, faBoxOpen} from '@fortawesome/free-solid-svg-icons';
import Can from '@/components/dashboard/permission/Can';
import { acl } from '@/acl';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({isOpen, toggleSidebar}) => {
    // Funzione per chiudere la sidebar su mobile quando si clicca un link
    const handleLinkClick = () => {
        if (window.innerWidth < 768 && toggleSidebar) {
            toggleSidebar();
        }
    };

    return (
        <div
            className={`h-screen bg-sidebar text-white fixed left-0 top-0 overflow-y-auto transition-all duration-300 ease-in-out z-10
      ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-0'}`}
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center">
                        <img 
                                src="/logo-v-w.png" 
                                alt="Panificio Drago Logo" 
                                className="mr-2 h-12 w-12"
                            />
                        <h2 className="text-xl font-bold">Panificio Drago</h2>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="text-white hover:text-gray-300 md:hidden"
                        aria-label="Chiudi sidebar"
                    >
                        <FontAwesomeIcon icon={faTimes} size="lg"/>
                    </button>
                </div>

                <nav>
                    <ul>
                        <li className="mb-4">
                            <Can permission={acl.VEHICLE_CREATE}>
                                <Link
                                    to="/dashboard/vehicles"
                                    className="block py-2 px-4 rounded hover:bg-gray-700 flex items-center"
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faTruck} className="mr-3" />
                                    Veicoli
                                </Link>
                            </Can>
                        </li>
                        <li className="mb-4">
                            <Can permission={acl.CUSTOMER_CREATE}>
                                <Link
                                    to="/dashboard/customers"
                                    className="block py-2 px-4 rounded hover:bg-gray-700 flex items-center"
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faUsers} className="mr-3" />
                                    Clienti
                                </Link>
                            </Can>
                        </li>
                        <li className="mb-4">
                            <Can permission={acl.ZONE_CREATE}>
                                <Link
                                    to="/dashboard/zones"
                                    className="block py-2 px-4 rounded hover:bg-gray-700 flex items-center"
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="mr-3" />
                                    Zone
                                </Link>
                            </Can>
                        </li>
                        <li className="mb-4">
                            <Can permission={acl.DELIVERY_CREATE}>
                                <Link
                                    to="/dashboard/deliveries"
                                    className="block py-2 px-4 rounded hover:bg-gray-700 flex items-center"
                                    onClick={handleLinkClick}
                                >
                                    <FontAwesomeIcon icon={faBoxOpen} className="mr-3" />
                                    Consegne
                                </Link>
                            </Can>
                        </li>
                        <li className="mb-4">
                            {/* La dashboard principale è sempre visibile */}
                            <Link
                                to="/dashboard"
                                className="block py-2 px-4 rounded hover:bg-gray-700 flex items-center"
                                onClick={handleLinkClick}
                            >
                                <FontAwesomeIcon icon={faHome} className="mr-3" />
                                Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
