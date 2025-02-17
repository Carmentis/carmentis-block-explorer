'use client'

import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {useAtom, useAtomValue} from 'jotai'
import {networkAtom} from "@/atoms/network.atom";
import {Input, TextField} from "@mui/material";
import useSWR from "swr";
import {NodeConnectionStatus} from "@/app/components/connection-status";


export function Navbar() {
    const router = useRouter();
    const  [searchQuery, setSearchQuery] = useState('');
    const [network, setNetwork] = useAtom(networkAtom);

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
                <TextField value={network} size={"small"} label={"Node"} onChange={e => setNetwork(e.target.value)}/>
                <NodeConnectionStatus/>
            </nav>
        </div>
    );
}

