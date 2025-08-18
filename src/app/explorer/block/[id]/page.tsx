'use client'

import {PageTitle} from "@/app/components/pagetitle";
import {useParams, useRouter} from "next/navigation";
import useSWR from "swr";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQuery, BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";
import TableMicroBlocks from "@/app/components/table-micro-blocks";

export default function MasterBlockExplorer() {
    const params = useParams<{id: string}>();
    const { id } = params;

    return (
        <>
            <PageTitle title={`Master Block ${id}`} />
            <MasterBlock id={parseInt(id)} />
        </>
    );
}

async function loadBlock([, client, h]: [string, BlockchainQuery, number]) {
    return await client.getMasterBlock(h);
}

function MasterBlock({ id }: { id: number }) {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);
    const router = useRouter();
    const { data, isLoading, error } = useSWR(["getCurrentHeight", client, id], loadBlock);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
            </div>
        );
    }

    if (!data || error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>An error occurred while loading the master block data.</span>
                </div>
                {error && <p className="mt-2 text-sm">{error.message}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Block Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Block Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Height</p>
                                <p className="font-medium">{data.getHeight()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${data.isAnchored() ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {data.isAnchored() ? "Anchored" : "Running"}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Size</p>
                                <p className="font-medium">{data.getSize()} bytes</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-500">Proposer</p>
                                <p className="font-medium">{data.getProposerNode()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Proposed At</p>
                                <p className="font-medium">{data.getProposedAt().toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Number of Microblocks</p>
                                <p className="font-medium">{data.getMicroBlocksHash().length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Microblocks Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Microblocks</h2>
                    <p className="text-gray-600 mb-6">
                        This master block contains the following microblocks. Click on a microblock to view its details.
                    </p>
                    <TableMicroBlocks hashes={data.getMicroBlocksHash()} />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                {id > 1 && (
                    <button 
                        onClick={() => router.push(`/explorer/masterblock/${id - 1}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous Block
                    </button>
                )}
                <button 
                    onClick={() => router.push(`/explorer/masterblock/${id + 1}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    Next Block
                    <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
