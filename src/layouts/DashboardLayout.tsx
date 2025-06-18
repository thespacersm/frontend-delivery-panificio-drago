import React, {useEffect, useState} from 'react';
import {Outlet, Link} from 'react-router-dom';
import Header from '@/components/dashboard/layout/Header';
import Sidebar from '@/components/dashboard/layout/Sidebar';
import Can from '@/components/dashboard/permission/Can';
import {acl} from '@/acl';

const DashboardLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            // Apre automaticamente la sidebar su desktop
            setSidebarOpen(window.innerWidth >= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 flex-col md:flex-row">
            {/* Overlay con effetto blur per chiudere sidebar su mobile */}
            {sidebarOpen && window.innerWidth < 768 && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/30 z-[5] md:hidden"
                    onClick={closeSidebar}
                    aria-label="Chiudi sidebar"
                />
            )}

            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>

            <div className={`flex-1 flex flex-col transition-all relative ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
                <Header toggleSidebar={toggleSidebar}/>
                <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 pb-26 lg:px-8">
                    <Outlet/>
                </main>
                
                {/* Pulsante di aggiunta in basso a destra */}
                <Can permission={acl.ROUTE_CREATE}>
                    <Link 
                        to="/dashboard/routes/new"
                        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-primary text-white shadow-lg flex items-center justify-center text-3xl hover:bg-primary-700 cursor-pointer transition-colors z-10"
                        aria-label="Aggiungi percorso"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                </Can>
            </div>
        </div>
    );
};

export default DashboardLayout;
