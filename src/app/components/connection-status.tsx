'use client'

import {useEffect, useState} from 'react';
import {useAtomValue} from 'jotai';
import {networkAtom} from "@/atoms/network.atom";
import {Tooltip} from "@mui/material";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export function NodeConnectionStatus() {
    const network = useAtomValue(networkAtom);
    const blockchain = useBlockchain();
    const {value: status, loading, error} = useAsync(async () => {
        return await blockchain.getNodeStatus(network)
    }, [network]);


    // Create a tooltip content component for connected state
    const ConnectedTooltip = () => {
        if (!status) return null;

        return (
            <TableContainer component={Paper} sx={{ minWidth: 300 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Property</TableCell>
                            <TableCell>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>Chain ID</TableCell>
                            <TableCell>{status.result.node_info.network}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Node Public Key</TableCell>
                            <TableCell>--</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Public Key Type</TableCell>
                            <TableCell>--</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Node Name</TableCell>
                            <TableCell>{status.result.node_info.moniker}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <div className="flex items-center">
            <Tooltip 
                title={status ? <ConnectedTooltip /> : network}
                placement="bottom-start"
            >
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
                                ? `Connected to ${status.result.node_info.network}`
                                : 'Disconnected'}
                    </span>
                </div>
            </div>
            </Tooltip>
        </div>
    );
}
