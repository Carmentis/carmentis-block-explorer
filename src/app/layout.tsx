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
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {JotaiProvider} from "@/components/jotai.component";
import {SWRConfig} from "swr";
import axios from "axios";

const SWR_CONFIG = {
    refreshInterval: 1000,
    fallback: { a: 1, b: 1 },
    fetcher: (url: string) => axios.get(url).then(res => res.data)
}



export default function RootLayout(
    {children}: Readonly<{ children: React.ReactNode; }>
) {
    sdk.blockchain.blockchainQuery.setNode(process.env.NEXT_PUBLIC_NODE_URL)
    return (
        <SWRConfig value={SWR_CONFIG}>
        <JotaiProvider>
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
                        <footer id="footer" className="footer d-block">
                            <div className="copyright">© Copyright <strong><span>Carmentis SAS</span></strong>. All
                                Rights
                                Reserved
                            </div>
                        </footer>
                    </div>

                </div>

                <Script src={"bootstrap/dist/js/bootstrap.min.js"}/>
                </body>
                </html>
        </JotaiProvider>
        </SWRConfig>
    );
}
