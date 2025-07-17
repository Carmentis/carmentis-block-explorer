'use client';

import {useParams, useRouter} from "next/navigation";
import {
    Hash,
    VB_ACCOUNT,
    VB_APP_LEDGER,
    VB_APPLICATION,
    VB_ORGANIZATION,
    VB_VALIDATOR_NODE
} from '@cmts-dev/carmentis-sdk/client';
import useSWR from "swr";
import {PageTitle} from "@/app/components/pagetitle";
import TableMicroBlocks from "@/app/components/table-micro-blocks";
import {useBlockchain, useExplorer} from "@/app/layout";

const fetcher = async (input: string[]) => {
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string");
    const hash = Hash.from(input[1]);
    const explorer = useExplorer();
    const blockchain = useBlockchain();
    const info = await explorer.getVirtualBlockchainState(hash);
    const content = await explorer.getVirtualBlockchainHashes(
        Hash.from(info.lastMicroblockHash)
    );
    /*
    const info = await sdk.blockchain.blockchainQuery.getVirtualBlockchainInfo(hash);
    const content = await sdk.blockchain.blockchainQuery.getVirtualBlockchainContent(hash);


     */

    return { info, content };
}

export default function Page() {
    const params = useParams<{ hash: string }>();
    const hash = params.hash;
    const router = useRouter();

    const { data, isLoading, error } = useSWR(["getAppLedger", hash], fetcher);

    if (isLoading) {
        return (
            <>
                <PageTitle title="Virtual Blockchain" />
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </>
        );
    }

    if (error || !data) {
        return (
            <>
                <PageTitle title="Virtual Blockchain" />
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span>An error occurred while loading the virtual blockchain data.</span>
                    </div>
                    {error && <p className="mt-2 text-sm">{error.message}</p>}
                </div>
            </>
        );
    }

    const height = data.info.height;
    const type = data.info.type;

    // Get the type label based on the type constant
    const getTypeLabel = () => {
        switch (type) {
            case VB_APP_LEDGER: return "App Ledger";
            case VB_ACCOUNT: return "Account";
            case VB_APPLICATION: return "Application";
            case VB_ORGANIZATION: return "Organisation";
            case VB_VALIDATOR_NODE: return "Validator Node";
            default: return "Unknown";
        }
    };

    // Get the type color based on the type constant
    const getTypeColor = () => {
        switch (type) {
            case VB_APP_LEDGER: return "bg-blue-100 text-blue-800";
            case VB_ACCOUNT: return "bg-green-100 text-green-800";
            case VB_APPLICATION: return "bg-indigo-100 text-indigo-800";
            case VB_ORGANIZATION: return "bg-pink-100 text-pink-800";
            case VB_VALIDATOR_NODE: return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <>
            <PageTitle title="Virtual Blockchain" />

            <div className="space-y-6">
                {/* Blockchain Information Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Virtual Blockchain Details</h2>
                            <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
                                {getTypeLabel()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Hash</p>
                                    <p className="font-mono text-sm break-all">{hash}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Height</p>
                                    <p className="font-medium">{height}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Last Micro-Block</p>
                                    <p className="font-medium">{height}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Number of Microblocks</p>
                                    <p className="font-medium">{data.info.height}</p>
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
                            This virtual blockchain contains the following microblocks. Click on a microblock to view its details.
                        </p>
                        <TableMicroBlocks hashes={data.content} />
                    </div>
                </div>

                {/* Navigation Button */}
                <div className="flex justify-end">
                    <button 
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        Back to Explorer
                    </button>
                </div>
            </div>
        </>
    );
}
