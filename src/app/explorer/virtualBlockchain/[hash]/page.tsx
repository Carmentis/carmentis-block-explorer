'use client';

import {useParams, useRouter} from "next/navigation";
import {
    Hash,
    VB_ACCOUNT,
    VB_APP_LEDGER,
    VB_APPLICATION,
    VB_ORGANIZATION,
    VB_VALIDATOR_NODE, VirtualBlockchainLabel, VirtualBlockchainType,
    VirtualBlockchainState, VirtualBlockchain
} from '@cmts-dev/carmentis-sdk/client';
import {PageTitle} from "@/app/components/pagetitle";
import TableMicroBlocks from "@/app/components/table-micro-blocks";
import {useBlockchain} from "@/app/layout";
import { useAsync } from "react-use";


export default function Page() {
    const provider = useBlockchain();
    const params = useParams<{ hash: string }>();
    const hash = Hash.from(params.hash);
    const router = useRouter();

    const { value: data, loading: isLoading, error } = useAsync(async () => {
        const vb: VirtualBlockchain = await provider.loadVirtualBlockchain(hash);
        const state: VirtualBlockchainState = await vb.getVirtualBlockchainState();
        return {vb, state}
        /*
        const vbStatus = await provider.getVirtualBlockchainState(hash.toBytes());
        if (vbStatus === null) throw new Error(
            `Virtual Blockchain with hash ${hash.encode()} does not exist.`
        );
        switch (vbStatus.type) {
            case VirtualBlockchainType.ACCOUNT_VIRTUAL_BLOCKCHAIN: return await provider.loadAccountVirtualBlockchain(hash);
            case VirtualBlockchainType.ORGANIZATION_VIRTUAL_BLOCKCHAIN: return await provider.loadOrganizationVirtualBlockchain(hash);
            case VirtualBlockchainType.APPLICATION_VIRTUAL_BLOCKCHAIN: return await provider.loadApplicationVirtualBlockchain(hash);
            case VirtualBlockchainType.NODE_VIRTUAL_BLOCKCHAIN:  return await provider.loadValidatorNodeVirtualBlockchain(hash);
            case VirtualBlockchainType.PROTOCOL_VIRTUAL_BLOCKCHAIN: return await provider.loadProtocolVirtualBlockchain(hash);
            case VirtualBlockchainType.APP_LEDGER_VIRTUAL_BLOCKCHAIN: return await provider.loadApplicationLedgerVirtualBlockchain(hash);
            default: throw new Error(`Unknown virtual blockchain type: ${vbStatus.type}`);
        }

         */
    })

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
        console.error(error)
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


    const vb = data.vb;
    //const lastMicroBlockHash = virtualBlockchainState.getLastMicroblockHash().encode()
    const height = data.vb.getHeight();
    const microblockHashes = vb.getAllMicroblockHashes();

    // Get the type label based on the type constant
    const getTypeLabel = () => {
        return VirtualBlockchainLabel.getVirtualBlockchainLabelFromVirtualBlockchainType(vb.getType()).replaceAll("_", " ");
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
                            <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-xs font-medium`}>
                                {getTypeLabel()}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Id</p>
                                    <p className="font-mono text-sm break-all">{hash.encode()}</p>
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
                                    <p className="font-medium">{height}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Microblocks Card  */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Microblocks</h2>
                        <p className="text-gray-600 mb-6">
                            This virtual blockchain contains the following microblocks. Click on a microblock to view its details.
                        </p>
                        <TableMicroBlocks hashes={microblockHashes} />
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
