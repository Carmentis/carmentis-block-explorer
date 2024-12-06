'use client'

import ActiveLink from "@/app/components/myLink";


export function Sidebar() {

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-heading">Block Explorer</li>
                <li className="nav-item">
                    <ActiveLink href="/" className="side-menu nav-link" name="Dashboard" icon="bi-bar-chart"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/explorer" className="side-menu nav-link" name="Data explorer" icon="bi-search"/>
                </li>

                <li className="nav-heading">Objects</li>
                <li className="nav-item">
                    <ActiveLink href="/accounts" className="side-menu nav-link" name="Accounts" icon="bi-person"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/organisations" className="side-menu nav-link" name="Organisations" icon="bi-building"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/nodes" className="side-menu nav-link" name="Nodes" icon="bi-cloud"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/applications" className="side-menu nav-link" name="Applications" icon="bi-grid"/>
                </li>

                <li className="nav-heading">Other tools</li>
                <li className="nav-item"><a className="nav-link collapsed" href="https://workspace.carmentis.io"><i
                    className="bi bi-box-arrow-up-right"></i> <span>Workspace</span></a></li>
                <li className="nav-item"><a className="nav-link collapsed" href="https://exchange.carmentis.io"><i
                    className="bi bi-box-arrow-up-right"></i> <span>Exchange</span></a></li>
                <li className="nav-item"><a className="nav-link collapsed" href="https://proof.carmentis.io"><i
                    className="bi bi-box-arrow-up-right"></i> <span>Proof Upload</span></a></li>
            </ul>
        </aside>
    );
}