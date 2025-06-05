'use client'

import { useState, useEffect } from 'react';
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import { useAtomValue } from 'jotai';
import { networkAtom } from "@/atoms/network.atom";

export function NodeConnectionStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const network = useAtomValue(networkAtom);

    useEffect(() => {
        let isMounted = true;

        const checkConnection = async () => {
            try {
                // Try to get chain status as a simple ping
                await sdk.blockchain.blockchainQuery.getChainStatus();
                if (isMounted) setIsConnected(true);
            } catch (error) {
                if (isMounted) setIsConnected(false);
            }
        };

        // Check connection immediately
        checkConnection();

        // Set up interval to check connection periodically
        const interval = setInterval(checkConnection, 10000); // Check every 10 seconds

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [network]); // Re-run when network changes

    return (
        <div className="flex items-center">
            <div className="flex items-center">
                <span className="text-sm mr-2">Node Status:</span>
                <div className="relative flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                        isConnected === null 
                            ? 'bg-gray-400' // Loading state
                            : isConnected 
                                ? 'bg-green-500' // Connected
                                : 'bg-red-500'   // Disconnected
                    }`}></div>
                    <span className="ml-2 text-sm">
                        {isConnected === null 
                            ? 'Checking...' 
                            : isConnected 
                                ? 'Connected' 
                                : 'Disconnected'}
                    </span>
                </div>
            </div>
        </div>
    );
}
