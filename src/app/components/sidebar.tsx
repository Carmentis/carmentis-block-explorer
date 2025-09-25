'use client'

import ActiveLink from "@/app/components/myLink";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

export function Sidebar() {
    // State to track screen size
    const [isMobile, setIsMobile] = useState(false);

    // Effect to handle screen resize
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
        };

        // Initial check
        checkScreenSize();

        // Add event listener
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <aside className={`
            fixed top-[60px] bottom-0 w-64 z-40 
            transition-all duration-300 bg-white shadow-lg overflow-y-auto
            ${isMobile ? 'left-0 lg:left-0' : 'left-0'}
        `}>
            <div className="p-4">
                <nav>
                    {/* Block Explorer Section */}
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-3">Block Explorer</h3>
                        <ul className="space-y-1">
                            <li>
                                <ActiveLink 
                                    href="/" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Dashboard" 
                                    icon="bi-bar-chart"
                                />
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/explorer" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Data explorer" 
                                    icon="bi-search"
                                />
                            </li>
                        </ul>
                    </div>

                    {/* Objects Section */}
                    <div className="mb-4">
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-3">Objects</h3>
                        <ul className="space-y-1">
                            <li>
                                <ActiveLink 
                                    href="/accounts" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Accounts" 
                                    icon="bi-person"
                                />
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/organisations" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Organisations" 
                                    icon="bi-building"
                                />
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/nodes" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Nodes" 
                                    icon="bi-cloud"
                                />
                            </li>
                            <li>
                                <ActiveLink 
                                    href="/applications" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Applications" 
                                    icon="bi-grid"
                                />
                            </li>
                        </ul>
                    </div>

                    {/* Tools Section */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2 px-3">Tools</h3>
                        <ul className="space-y-1">
                            <li>
                                <ActiveLink 
                                    href="/proofChecker" 
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100" 
                                    name="Proof checker" 
                                    icon="bi-check"
                                />
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </aside>
    );
}
