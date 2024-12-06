'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";

/**
 * This component is used to style the active navbar
 * @constructor
 */
export default function ActiveLink( input : {  href: string, className: string, icon: string, name: string }  ) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;
    return <Link href={input.href} className={input.className + " " + (isActive(input.href) ? " active" : "")}>
        <i className={"bi " + input.icon}></i>
        <span>{input.name}</span>
    </Link>
}