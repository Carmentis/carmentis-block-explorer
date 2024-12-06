"use client";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css'
import {Navbar} from '@/app/components/navbar';
import {Sidebar} from '@/app/components/sidebar';
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './globals.css';
import './custom.css';
import Script from "next/script";


export default function RootLayout(
    {children}: Readonly<{ children: React.ReactNode; }>
) {
    return (
        <html lang="en">
        <body>
            <Navbar></Navbar>
            <div id="dashboard">
                <div id="dashboard-sidebar">
                    <Sidebar></Sidebar>
                </div>
                <div id="dashboard-body">
                    <main id="main" className="main with-menu d-block">

                        <section className="section dashboard">

                            {children}
                        </section>
                    </main>
                </div>

            </div>
        <Script src={"bootstrap/dist/js/bootstrap.min.js"}/>
        </body>
        </html>
    );
}
