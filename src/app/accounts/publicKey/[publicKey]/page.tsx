'use client';

import { useAtomValue } from "jotai/index";
import { AccountState, BlockchainQuery, BlockchainQueryFabric, TokenTransaction } from '@cmts-dev/carmentis-sdk/client';
import Skeleton from "react-loading-skeleton";
import React from "react";
import { networkAtom } from "@/atoms/network.atom";
import { useParams } from "next/navigation";
import useSWR, { SWRResponse } from "swr";
import { PageTitle } from "@/app/components/pagetitle";
import { ErrorDisplay } from "@/app/components/error-display";

async function fetchAccountState(input: [string, BlockchainQuery, string]) {
    const client = input[1]
    return await client.fetchAccountStateByPublicKey(input[2]);
}

async function fetchAccountTransactionsHistory(input: [string, BlockchainQuery, string]) {
    const client = input[1]
    return await client.fetchAccountTransactionsByPublicKey(input[2], 50);
}

export default function AccountByPublicKey() {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);
    const params = useParams<{ publicKey: string }>();
    const publicKey = params.publicKey;
    console.assert(typeof publicKey === 'string');

    const accountStateResponse = useSWR(['getAccountState', client, publicKey], fetchAccountState)
    const transactionsResponse = useSWR(['getAccountTransactions', client, publicKey], fetchAccountTransactionsHistory)

    if (accountStateResponse.error || transactionsResponse.error) {
        return <AccountNotFound publicKey={publicKey} />
    }

    return (
        <div className="space-y-6">
            <PageTitle title="Account Details" />
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <AccountStateComponent response={accountStateResponse} transactionsResponse={transactionsResponse} publicKey={publicKey} />
                    <AccountTransactionsHistory response={transactionsResponse} />
                </div>
            </div>
        </div>
    );
}


function AccountNotFound({ publicKey }: { publicKey: string }) {
    return (
        <div className="space-y-6">
            <PageTitle title="Account Not Found" />
            <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-3xl mx-auto">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Not Found</h2>
                    <p className="text-gray-600 mb-4 max-w-md">
                        We cannot find the account associated with the public key:
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 w-full max-w-lg overflow-auto">
                        <p className="font-mono text-blue-600 text-sm break-all">{publicKey}</p>
                    </div>
                    <p className="text-gray-600">Please verify the key and try again.</p>
                </div>
            </div>
        </div>
    );
}


function AccountStateComponent({ publicKey, response, transactionsResponse }: { publicKey: string, response: SWRResponse<AccountState>, transactionsResponse: SWRResponse<TokenTransaction[]> }) {
    if (response.isLoading) {
        return (
            <div className="py-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse"></div>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-4 mx-auto md:ml-auto"></div>
                        <div className="space-y-4">
                            <div className="h-20 w-48 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-20 w-48 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!response.data || response.error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>An error occurred while loading account data.</span>
                </div>
                {response.error && <p className="mt-2 text-sm">{response.error.toString()}</p>}
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start py-8">
                <div className="flex flex-col items-center md:items-start">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Public key</h2>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4 w-full max-w-lg overflow-auto">
                        <p className="font-mono text-sm text-gray-700 break-all">{publicKey}</p>
                    </div>
                </div>

                <div className="mt-6 md:mt-0">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center md:text-right">Account State</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Balance</p>
                            <p className="text-2xl font-bold text-blue-600">{response.data.getBalance()} <span className="text-sm font-normal text-gray-600">CMTS</span></p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500 mb-1">Latest transaction time</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {!transactionsResponse.isLoading && transactionsResponse.data && transactionsResponse.data.length > 0 
                                    ? transactionsResponse.data[0].getDate().toLocaleString()
                                    : <span className="text-gray-500">No transactions</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


function AccountTransactionsHistory({ response }: { response: SWRResponse<TokenTransaction[]> }) {
    if (response.isLoading) {
        return (
            <div className="space-y-4 mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h3>
                <div className="animate-pulse space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!response.data || response.error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-8">
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                    </svg>
                    <span>An error occurred while loading transaction data.</span>
                </div>
                {response.error && <p className="mt-2 text-sm">{response.error.toString()}</p>}
            </div>
        );
    }

    const transactions = response.data;

    if (transactions.length === 0) {
        return (
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-600 font-medium">No transactions found</p>
                    <p className="text-gray-500 text-sm mt-1">This account has no transaction history.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Transactions</h3>
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction, i) => (
                            <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.getDate().toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        transaction.getAmount() > 0 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {transaction.getAmount()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.getLabel()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
