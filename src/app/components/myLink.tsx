'use client'

import Link from "next/link";
import {usePathname} from "next/navigation";

/**
 * This component is used to style the active navbar link with Tailwind CSS
 * @constructor
 */
export default function ActiveLink( input : {  href: string, className: string, icon: string, name: string }  ) {
    const pathname = usePathname();
    const isActive = (path: string) => pathname === path;

    // Base classes that are always applied
    const baseClasses = input.className;

    // Active state classes
    const activeClasses = isActive(input.href) 
        ? "bg-blue-50 text-blue-700 font-semibold" 
        : "text-gray-700";

    return (
        <Link href={input.href} className={`${baseClasses} ${activeClasses}`}>
            <i className={`bi ${input.icon} mr-2`}></i>
            <span>{input.name}</span>
        </Link>
    );
}
