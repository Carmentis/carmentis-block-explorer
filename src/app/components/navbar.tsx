'use client'

import {useState} from "react";
import {useRouter} from 'next/navigation';
import Image from "next/image";
import {useAtom} from 'jotai'
import {networkAtom} from "@/atoms/network.atom";
import {NodeConnectionStatus} from "@/app/components/connection-status";
import {useWindowSize} from "react-use";

function useWindowWidth() {
    const {width} = useWindowSize();
    return width;
}

export function Navbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const width = useWindowWidth();

    /**
     * Toggle the sidebar.
     */
    const toggleNavbarClass = "toggle-sidebar";
    function toggleNavbar() {
        // get the body element (halt if document or body are not defined)
        if (typeof window.document !== undefined) {
            const body = document.querySelector('body');
            if (body === null) return;

            // add or remove the toggle class to hide or show the sidebar
            if (body.classList.contains(toggleNavbarClass)) {
                body.classList.remove(toggleNavbarClass);
            } else {
                body.classList.add(toggleNavbarClass);
            }

            // Dispatch a custom event that our layout component can listen for
            const event = new CustomEvent('sidebarToggle', { 
                detail: { isOpen: body.classList.contains(toggleNavbarClass) } 
            });
            window.dispatchEvent(event);
        }
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-[60px] bg-white shadow-md z-50 flex items-center px-4">
            {/* Hamburger Menu (Left) */}
            <button 
                onClick={toggleNavbar} 
                className="text-gray-700 hover:text-gray-900 focus:outline-none mr-3"
            >
                <i className="bi bi-list text-2xl"></i>
            </button>

            {/* Logo (Right to Hamburger) */}
            <div className="flex items-center mr-4">
                <Image
                    src="/logo-full.svg" 
                    width={150}
                    height={30}
                    alt="Carmentis Logo" 
                    className="h-5 w-auto"
                />

            </div>

            {/* Connection Status (Right) */}
            {width > 700 && (
                <div className="ml-auto">
                    <NodeConnectionStatus />
                </div>
            )}
        </header>
    );
}
