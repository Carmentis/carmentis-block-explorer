'use client'

import {useState} from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";


export function Navbar() {
    const router = useRouter();
    const  [searchQuery, setSearchQuery] = useState('');

    function OnSubmit(event: React.FormEvent<HTMLFormElement>) {
        // stop the propagation of the form event
        event.preventDefault()

        // navigate to search
        router.push("/search?query=" + searchQuery);
    }

    /**
     * Toggle the sidebar.
     */
    const toggleNavbarClass = "toggle-sidebar";
    function toggleNavbar() {
        // get the body element (halt if document or body are not defined)
        if ( typeof window.document !== undefined ) {
            const body = document.querySelector('body');
            if ( body === null ) return;

            // add or remove the toggle class to hide or show the sidebar
            if ( body.classList.contains(toggleNavbarClass) ) {
                body.classList.remove(toggleNavbarClass);
            } else {
                body.classList.add(toggleNavbarClass);
            }
        }

    }

    return (
        <div id="navbar" className="header fixed-top d-flex align-items-center">
            <div className="d-flex align-items-center justify-content-between">
                <Image
                    src="/logo-full.svg" width="150" height={200} alt="" /> <span className="d-none d-lg-block"><span
                className="toolname">Explorer</span></span><i onClick={toggleNavbar} className="bi bi-list toggle-sidebar-btn"></i>
            </div>
            <div className="search-bar">
                <form className="search-form d-flex align-items-center" onSubmit={OnSubmit}>
                    <input type="text" name="query" placeholder="Search" title="Enter search keyword" onChange={(e) => setSearchQuery(e.target.value)} />
                    <button type="submit" title="Search"><i className="bi bi-search"></i></button>
                </form>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-lg-none">
                        <a className="nav-link nav-icon search-bar-toggle"
                                                                  href="#"><i className="bi bi-search"></i></a></li>
                    <li className="nav-item dropdown pe-4" id="network"><a
                        className="nav-link nav-profile d-flex align-items-center pe-0" href="#"
                        data-bs-toggle="dropdown"><i className="bi bi-hdd-network"></i> <span id="network-title"
                                                                                              className="d-none d-md-block dropdown-toggle ps-2">Themis (testnet)</span></a>
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header"><span>Network</span></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><a className="dropdown-item d-flex align-items-center" href="/get-started"><i
                                className="bi bi-box-arrow-up-right"></i> <span>Go to mainnet</span></a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}