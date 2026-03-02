'use client';

import React, {useEffect, useRef, useState} from "react";
import "react-toastify/dist/ReactToastify.css";
import {useAsync} from "react-use";
import {ErrorBoundary} from "react-error-boundary";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {PageTitle} from "@/app/components/pagetitle";
import Link from "next/link";
import {useBlockchain} from "@/app/layout";
import {Hash, ImportedProof, JsonData, ProofDocument} from "@cmts-dev/carmentis-sdk/client";

export default function ProofChecker() {

    const [proof, setProof] = useState<ProofDocument | undefined>();
    return (
        <div className="space-y-6">
            <PageTitle title="Proof Checker" />
            <ErrorBoundary fallbackRender={ProofCheckerFailure}>
                {proof ? 
                    <ProofViewer proof={proof} resetProof={() => setProof(undefined)}/> 
                    : 
                    <ProofCheckerUpload onUpload={proof => setProof(proof)} />
                }
            </ErrorBoundary>
        </div>
    );
}



function ProofCheckerFailure({ error }: { error: Error }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-pulse">
                <span className="text-5xl md:text-6xl">😞</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-3">
                Sorry, we cannot verify the proof
            </h2>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
                The proof might be malformed or contain invalid data.
            </p>
            {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-lg mx-auto">
                    <p className="text-sm text-red-700 font-mono break-all">
                        {error.message}
                    </p>
                </div>
            )}
        </div>
    );
}



function ProofCheckerUpload({onUpload}: { onUpload: (proof: ProofDocument) => void }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const processFile = (file?: File) => {
        setError(null);
        if (file) {
            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                setError("Please upload a JSON file");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result as string);
                    const proofDocument = ProofDocument.fromObject(content)
                    onUpload(proofDocument);
                } catch (error) {
                    console.error(error);
                    setError("Invalid JSON file. Please upload a valid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-xl w-full mx-auto text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">Upload Proof File</h2>
                <p className="text-gray-600">
                    Upload a JSON proof file to verify its authenticity and view its contents
                </p>
            </div>

            <div 
                className={`w-full max-w-md mx-auto border-2 border-dashed rounded-lg p-12 
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} 
                    transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-100`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept="application/json"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />
                <div className="flex flex-col items-center justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 
                        ${isDragging ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                        {isDragging ? 'Drop your file here' : 'Drag and drop your file here'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">or</p>
                    <button 
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                        }}
                    >
                        Browse Files
                    </button>
                    <p className="text-xs text-gray-500 mt-4">
                        Supported file: JSON
                    </p>
                </div>
            </div>

            {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto text-center">
                    <p className="text-sm text-red-600">{error}</p>
                </div>
            )}
        </div>
    );
}

function ProofViewer({proof, resetProof}: {resetProof: () => void, proof: ProofDocument}) {

    const blockchain = useBlockchain();
    const state = useAsync(async () => {
        // we currently support only one proof document for a single virtual blockchain
        const proofDocumentVBs = proof.getVirtualBlockchains();
        if (proofDocumentVBs.length !== 1) {
            throw new Error("Proof document contains multiple virtual blockchains. Only one virtual blockchain is supported.");
        }
        const proofDocumentVB = proofDocumentVBs[0];
        const vbId = proofDocumentVB.getIdentifier();
        const appLedgerId = Hash.fromHex(vbId);
        const appLedgerVb = await blockchain.loadApplicationLedgerVirtualBlockchain(appLedgerId);
        const importedProofs = await appLedgerVb.importProof(proof.getObject());
        return {
            proofDocumentVB,
            appLedgerId: vbId,
            appLedgerVb,
            importedProofs
        }

        /*
        const heights = verificationResult.getInvolvedBlockHeights();
        const records = await Promise.all(
            heights.map(async (blockHeight: number) => {
                const record = await verificationResult.getRecordContainedInBlockAtHeight(blockHeight);
                return { height: blockHeight, record };
            })
        );
        return { verificationResult, records };

         */
    });

    if (state.loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 border-4 border-blue-400 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-lg text-gray-700">Verifying proof...</p>
            </div>
        );
    }

    if (state.error || !state.value) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
                <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-red-700">Proof Verification Failed</h3>
                </div>
                <p className="text-red-600 mb-4">
                    {state.error?.message || "Unable to verify the proof. The proof might be invalid or corrupted."}
                </p>
                <button 
                    onClick={resetProof}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Try Another Proof
                </button>
            </div>
        );
    }

    const { appLedgerId, appLedgerVb, importedProofs } = state.value;
    const verified = true; // at this step, the proof has been successfully verified
    const title = proof.getTitle();
    const author = proof.getAuthor();
    const exportedAt = proof.getDate().toLocaleString();
    const records = importedProofs;
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Proof Details</h2>
                <button 
                    onClick={resetProof}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Verify Another Proof
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Verification Status</p>
                                <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    verified 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        verified ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    {verified ? 'Verified' : 'Failed'}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Proof Title</p>
                                <p className="font-medium">{title}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Proof Export Time</p>
                                <p className="font-medium">{exportedAt}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Virtual Blockchain ID</p>
                                <Link 
                                    href={`/explorer/virtualBlockchain/${appLedgerId}`}
                                    target="_blank"
                                    className="text-blue-600 hover:text-blue-800 font-mono text-sm break-all"
                                >
                                    {appLedgerId}
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Author</p>
                                <p className="font-medium">{author}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {records && <ProofRecordViewer records={records} />}
        </div>
    );
}


function ProofRecordViewer({records}: {records: ImportedProof[]}) {
    return (
        <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Proof Data Visualization</h3>

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-blue-200"></div>

                <div className="space-y-8">
                    {records.map((record, index) => (
                        <div key={index} className="relative pl-16">
                            {/* Timeline dot */}
                            <div className="absolute left-4 top-0 transform -translate-x-1/2 w-5 h-5 rounded-full bg-blue-500 border-4 border-blue-100 z-10"></div>

                            {/* Content card */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 text-sm">
                                            {index + 1}
                                        </span>
                                        Block {record.height}
                                    </h4>
                                    <BlockViewer initialPath={[]} data={record.data} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BlockViewer({data, initialPath}: {data: JsonData, initialPath: string[]}) {
    const [path, setPath] = useState(initialPath);
    const [shownData, setShowData] = useState(data);

    useEffect(() => {
        // compute the shown data
        let shownData = data;
        for (const token of path) {
            // TODO: check
            // @ts-expect-error
            shownData = shownData[token];
        }
        setShowData(shownData);
    }, [path, data]);

    function renderEntry(index: number, key: string, value: any) {
        const isArrayOfStrings = Array.isArray(value) && value.every(v => typeof v === 'string');
        const isArray = Array.isArray(value);
        const isObject = typeof value === 'object' && value !== null;
        const isDate = value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)));

        let valueDisplay;
        let canNavigate = false;

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            valueDisplay = String(value);
        } else if (isArrayOfStrings) {
            valueDisplay = value.join(', ');
        } else if (isDate) {
            valueDisplay = new Date(value).toLocaleString();
        } else if (!isArray && isObject) {
            valueDisplay = "Object";
            canNavigate = true;
        } else if (isArray) {
            valueDisplay = `Array (${value.length} items)`;
            canNavigate = value.length > 0 && typeof value[0] === 'object';
        } else if (value === null) {
            valueDisplay = "null";
        } else {
            valueDisplay = "Cannot display";
        }

        return (
            <tr 
                key={index} 
                className={`border-b border-gray-200 ${canNavigate ? 'hover:bg-blue-50 cursor-pointer' : ''}`}
                onClick={canNavigate ? () => setPath([...path, key]) : undefined}
            >
                <td className="py-3 px-4 font-medium text-gray-700 border-r border-gray-200 bg-gray-50 w-1/3">
                    {key}
                </td>
                <td className={`py-3 px-4 ${canNavigate ? 'text-blue-600 hover:text-blue-800' : 'text-gray-700'}`}>
                    {canNavigate ? (
                        <div className="flex items-center">
                            <span>{valueDisplay}</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    ) : (
                        <span className={`${typeof value === 'string' ? 'break-all' : ''}`}>{valueDisplay}</span>
                    )}
                </td>
            </tr>
        );
    }

    function renderPathBreadcrumb() {
        if (path.length === 0) return null;

        return (
            <div className="flex items-center mb-4 text-sm bg-gray-50 p-2 rounded-md overflow-x-auto">
                <button 
                    onClick={() => setPath([])}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Root
                </button>

                {path.map((segment, index) => (
                    <div key={index} className="flex items-center">
                        <svg className="w-4 h-4 mx-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <button 
                            onClick={() => setPath(path.slice(0, index + 1))}
                            className={`${index === path.length - 1 ? 'text-gray-700 font-medium' : 'text-blue-600 hover:text-blue-800'}`}
                        >
                            {segment}
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            {renderPathBreadcrumb()}

            {path.length > 0 && (
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <button 
                        onClick={() => setPath(path.slice(0, -1))}
                        className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            // TODO: check
                            // @ts-expect-error
                            Object.entries(shownData)
                                .map(([key, value], i) => renderEntry(i, key, value))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
