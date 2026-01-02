'use client'

import {useParams, useRouter} from "next/navigation";
import {
    Hash,
    Microblock,
    SectionLabel,
    Utils
} from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import Link from "next/link";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Button} from "@mui/material";



export default function MicroBlockExplorer() {
    const provider = useBlockchain();

    // load the params
    const params = useParams<{ hash: string }>();
    const hash = Hash.from(params.hash);
    const { value: data, loading: isLoading, error } = useAsync(async () => {
        return await provider.loadMicroblockByMicroblockHash(hash)
    })

    if (error) {
        return (
            <>
                <PageTitle title="Microblock Details" />
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span>An error occurred while loading: {error.message}</span>
                    </div>
                </div>
            </>
        );
    }

    if (!data || isLoading) {
        return (
            <>
                <PageTitle title="Microblock Details" />
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <PageTitle title={`Microblock`} />
            <DataDisplay mb={data} />
        </>
    );
}

const DataDisplay = ({ mb }: { mb: Microblock }) => {
    const router = useRouter();
    const height = mb.getHeight();
    const gas = mb.getGas().toString();
    const gasPrice = mb.getGasPrice().toString();
    const previousHash = mb.getPreviousHash();
    const provider = useBlockchain();
    const accountId = Hash.from(Utils.getNullHash()).encode(); // TODO: fill
    const {value: vbId, loading: isLoading} = useAsync(async () => {
        return await provider.getVirtualBlockchainIdContainingMicroblock(mb.getHash());
    })

    return (
        <div className="space-y-6">
            {/* Header Information Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Header Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Hash</p>
                                <p className="font-mono text-sm break-all">{mb.getHash().encode()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Height</p>
                                <p className="font-medium">{height}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Virtual blockchain</p>
                                <Link
                                    href={`/explorer/virtualBlockchain/${vbId ? vbId.encode() : ''}`}
                                    className="font-mono text-sm text-blue-600 hover:text-blue-800 break-all"
                                >
                                    {vbId ? vbId.encode() : 'Loading...'}
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Previous Hash</p>
                                {height !== 1 ? (
                                    <Link 
                                        href={`/explorer/microblock/${previousHash.encode()}`}
                                        className="font-mono text-sm text-blue-600 hover:text-blue-800 break-all"
                                    >
                                        {previousHash.encode()}
                                    </Link>
                                ) : (
                                    <p className="font-mono text-sm break-all">{previousHash.encode()}</p>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Timestamp</p>
                                <p className="font-medium">{mb.getTimestampAsDate().toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gas</p>
                                <p className="font-medium">{gas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Gas Price</p>
                                <p className="font-medium">{gasPrice}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Fees payer account</p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sections Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sections</h2>
                    <p className="text-gray-600 mb-6">
                        Below is displayed the list of sections contained in the microblock.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {mb.getAllSections().map((section) => (
                                <tr key={section.type} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{SectionLabel.getSectionLabelFromSection(section)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <Button onClick={() => alert(JSON.stringify(section))}>See section content</Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                {height > 1 && (
                    <button 
                        onClick={() => router.push(`/explorer/microblock/${previousHash.encode()}`)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous Microblock
                    </button>
                )}
            </div>
        </div>
    );
};

/*
{data.getAllSections().map((section) => (
                                    <tr key={section.type} className="hover:bg-blue-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{section.data.length} bytes</td>
                                    </tr>
                                ))}
 */
