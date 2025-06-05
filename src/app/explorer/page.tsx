'use client'

import { PageTitle } from '@/app/components/pagetitle';
import { useState } from 'react';
import { BlockchainQuery, ChainStatus } from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import Loading from "@/app/nodes/loading";
import { ErrorDisplay } from "@/app/components/error-display";
import useBlockchainQuery from "@/components/node.hook";
import Skeleton from "react-loading-skeleton";
import { useRouter } from "next/navigation";

const chainStatusFetcher = async ([, client]: [string, BlockchainQuery]) => {
    return await client.getChainStatus()
}

/**
 * This function renders a navigation page system in which a user wants to see the
 * blocks in the master blockchain.
 */
export default function BlockchainExplorer() {
    const client = useBlockchainQuery()
    const { data, isLoading, error } = useSWR(['getChainStatus', client], chainStatusFetcher)

    if (isLoading) return <Loading />
    if (!data || error) return <ErrorDisplay error={error} />

    return (
        <>
            <PageTitle title={"Explorer"} />
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Blocks</h2>
                    <p className="text-gray-600 mb-6">
                        Explore the blocks in the master blockchain. Each block contains multiple microblocks and transactions.
                    </p>
                    <PaginatedTable chainStatus={data} />
                </div>
            </div>
        </>
    );
}

const PaginatedTable = ({ chainStatus }: { chainStatus: ChainStatus }) => {
    const [desiredBlock, setDesiredBlock] = useState<string>('');
    const chainLength = chainStatus.getLastBlockHeight() + 1;
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [page, setPage] = useState(Math.max(0, Math.floor(chainLength / rowsPerPage) - 1));

    const header = ['Block', "Status", "Size", "Proposer", "Proposed At"]
    const content = [];
    for (let i = page * rowsPerPage; i < (page + 1) * rowsPerPage; i++) {
        if (1 <= i && i < chainLength) {
            const masterBlockHeight = i;
            const row = <LoadMasterBlockRow masterBlockHeight={masterBlockHeight} key={masterBlockHeight} colSpan={header.length} />
            content.push(row);
        }
    }

    function goToBlock() {
        if (!desiredBlock) return;
        const n = parseInt(desiredBlock);
        if (isNaN(n)) return;

        const targetBlock = Math.max(1, Math.min(n, chainLength));
        const targetPage = Math.floor(targetBlock / rowsPerPage);
        setPage(targetPage);
        setDesiredBlock('');
    }

    return (
        <>
            {/* Search Block Form */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            value={desiredBlock} 
                            onChange={e => setDesiredBlock(e.target.value)}
                            placeholder="Enter block number" 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyDown={(e) => e.key === 'Enter' && goToBlock()}
                        />
                    </div>
                    <button 
                        onClick={goToBlock}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to block
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {header.map((v, i) => (
                                <th key={i} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {v}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {content}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                    <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                    <select 
                        value={rowsPerPage} 
                        onChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        {[5, 10, 25].map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">
                        {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, chainLength)} of {chainLength}
                    </span>
                    <div className="flex space-x-1">
                        <button 
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className={`p-2 rounded-md ${page === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button 
                            onClick={() => setPage(p => Math.min(Math.ceil(chainLength / rowsPerPage) - 1, p + 1))}
                            disabled={page >= Math.ceil(chainLength / rowsPerPage) - 1}
                            className={`p-2 rounded-md ${page >= Math.ceil(chainLength / rowsPerPage) - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

const masterBlockFetcher = async ([, client, height]: [string, BlockchainQuery, number]) => {
    return await client.getMasterBlock(height)
}

function LoadMasterBlockRow({ masterBlockHeight, colSpan }: { masterBlockHeight: number, colSpan: number }) {
    const client = useBlockchainQuery()
    const router = useRouter();
    const { data, isLoading, error } = useSWR(['getMasterBlock', client, masterBlockHeight], masterBlockFetcher)

    if (isLoading) {
        return (
            <tr>
                <td colSpan={colSpan} className="px-6 py-4">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-2 py-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                </td>
            </tr>
        );
    }

    if (!data || error) {
        return (
            <tr>
                <td colSpan={colSpan} className="px-6 py-4 text-center text-sm text-red-500">
                    <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span title={error?.message}>Loading failed</span>
                    </div>
                </td>
            </tr>
        );
    }

    const link = `/explorer/masterblock/${data.getHeight()}`;

    return (
        <tr 
            onClick={() => router.push(link)}
            className="hover:bg-blue-50 cursor-pointer transition-colors duration-150"
        >
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{data.getHeight()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.isAnchored() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {data.isAnchored() ? "Anchored" : "Running"}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.getSize()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.getProposerNode()}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{data.getProposedAt().toLocaleString()}</td>
        </tr>
    );
}
