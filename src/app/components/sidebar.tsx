'use client'

import ActiveLink from "@/app/components/myLink";
import {usePathname} from "next/navigation";


export function Sidebar() {
    const pathname = usePathname();
    const isAlpha = typeof pathname === "string" && pathname.includes("alpha");
    const env = isAlpha ? "alpha" : "beta";
    const workspaceUrl = `https://workspace.${env}.carmentis.io`;
    const exchangeUrl = `https://exchange.${env}.carmentis.io`;
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
                    <ActiveLink href="/organisations" className="side-menu nav-link" name="Organisations"
                                icon="bi-building"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/nodes" className="side-menu nav-link" name="Nodes" icon="bi-cloud"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/applications" className="side-menu nav-link" name="Applications" icon="bi-grid"/>
                </li>
                <li className="nav-item">
                    <ActiveLink href="/oracles" className="side-menu nav-link" name="Oracles" icon="bi-grid"/>
                </li>

                <li className="nav-heading">Tools</li>
                <li className="nav-item">
                    <ActiveLink href="/proofChecker" className="side-menu nav-link" name="Proof checker" icon="bi-check"/>
                </li>
                <li className="nav-item"><a target={"_blank"} className="nav-link collapsed" href={workspaceUrl}><i
                    className="bi bi-box-arrow-up-right"></i> <span>Workspace</span></a></li>
                <li className="nav-item"><a target={"_blank"} className="nav-link collapsed" href={exchangeUrl}><i
                    className="bi bi-box-arrow-up-right"></i> <span>Exchange</span></a></li>
            </ul>
        </aside>
    );
}