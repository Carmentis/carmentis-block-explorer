"use client";

// Keep necessary styles
import 'react-loading-skeleton/dist/skeleton.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './globals.css';

// Components
import {Navbar} from '@/app/components/navbar';
import {Sidebar} from '@/app/components/sidebar';
import {Blockchain, Explorer, ProviderFactory} from '@cmts-dev/carmentis-sdk/client';
import {JotaiProvider} from "@/components/jotai.component";
import {SWRConfig} from "swr";
import axios from "axios";
import {PublicEnvScript} from "next-runtime-env";
import { useState, useEffect } from 'react';
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";

const SWR_CONFIG = {
    refreshInterval: 1000,
    fallback: { a: 1, b: 1 },
    fetcher: (url: string) => axios.get(url).then(res => res.data)
}


export function useBlockchain() {
    // const node = process.env.NEXT_PUBLIC_NODE_URL;
    const node = useAtomValue(networkAtom);
    const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(node as string);
    return Blockchain.createFromProvider(provider);
}

export function useExplorer() {
   // const node = process.env.NEXT_PUBLIC_NODE_URL;
    const node = useAtomValue(networkAtom);
    const provider = ProviderFactory.createInMemoryProviderWithExternalProvider(node as string);
    return Explorer.createFromProvider(provider);
}

export default function RootLayout(
    {children}: Readonly<{ children: React.ReactNode; }>
) {

    const explorer = useExplorer();

    // State to track if sidebar is open (for mobile)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Effect to handle sidebar toggle class for existing toggle functionality
    useEffect(() => {
        const handleBodyClassChange = () => {
            const body = document.querySelector('body');
            if (body) {
                if (sidebarOpen) {
                    body.classList.add('toggle-sidebar');
                } else {
                    body.classList.remove('toggle-sidebar');
                }
            }
        };

        handleBodyClassChange();

        // Listen for toggle-sidebar class changes from other components
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const body = document.querySelector('body');
                    if (body) {
                        setSidebarOpen(body.classList.contains('toggle-sidebar'));
                    }
                }
            });
        });

        // Listen for custom sidebarToggle event from navbar
        const handleSidebarToggle = (event: any) => {
            setSidebarOpen(event.detail.isOpen);
        };

        window.addEventListener('sidebarToggle', handleSidebarToggle);

        const body = document.querySelector('body');
        if (body) {
            observer.observe(body, { attributes: true });
        }

        return () => {
            observer.disconnect();
            window.removeEventListener('sidebarToggle', handleSidebarToggle);
        };
    }, [sidebarOpen]);

    return (
        <SWRConfig value={SWR_CONFIG}>
            <JotaiProvider>
                <PublicEnvScript/>
                <html lang="en" className="h-full">
                    <body className="bg-gray-50 min-h-screen">
                        <Navbar />
                        <div className="flex min-h-screen pt-[60px]">
                            {/* Sidebar - hidden on mobile by default, shown when sidebarOpen is true */}
                            <div className={`${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
                                <Sidebar />
                            </div>

                            {/* Main Content - full width on mobile, adjusted on desktop */}
                            <div className={`flex-1 transition-all duration-300 w-full 
                                ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'} 
                                lg:ml-64`}
                            >
                                <main className="p-4 md:p-6">
                                    <div className="mb-6">
                                        {children}
                                    </div>
                                </main>

                                {/* Footer */}
                                <footer className="px-4 md:px-6 py-4 border-t border-gray-200">
                                    <div className="text-center text-sm text-gray-600">
                                        © Copyright <span className="font-semibold">Carmentis SAS</span>. All Rights Reserved
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </body>
                </html>
            </JotaiProvider>
        </SWRConfig>
    );
}
