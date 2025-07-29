'use client'

import {useEffect, useState} from 'react';
import {Blockchain, ProviderFactory} from "@cmts-dev/carmentis-sdk/client";
import {useAtomValue} from 'jotai';
import {networkAtom} from "@/atoms/network.atom";
import {Tooltip} from "@mui/material";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";

export function NodeConnectionStatus() {
    const network = useAtomValue(networkAtom);
    const blockchain = useBlockchain();
    const {value: status, loading, error} = useAsync(async () => {
        return await blockchain.getNodeStatus()
    }, [network]);


    return (
        <div className="flex items-center">
            <Tooltip title={network}>
                <div className="flex items-center">
                <div 
                    className="relative flex items-center"
                >
                    <div className={`w-3 h-3 rounded-full ${
                        loading
                            ? 'bg-gray-400' // Loading state
                            : status 
                                ? 'bg-green-500' // Connected
                                : 'bg-red-500'   // Disconnected
                    }`}></div>
                    <span className="ml-2 text-sm">
                        {loading
                            ? 'Checking...' 
                            : status
                                ? `Connected to ${status.getChainId()}`
                                : 'Disconnected'}
                    </span>


                </div>
            </div>
            </Tooltip>
        </div>
    );
}
