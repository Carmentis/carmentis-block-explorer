'use client'

import {PageTitle} from '@/app/components/pagetitle';
import {notFound, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

import * as Carmentis from '@/carmentis-nodejs-sdk';
import {hexToUint8Array} from "@/app/utils/encoders";
import {GetMicroBlockResponse, Section} from "@/app/interfaces/getMicroBlockResponse";
import {Formatters} from "@/app/utils/formatters";
import Link from "next/link";

export default function MicroBlockExplorer() {

    // obtains the searched master block id from query parameter
    // or fails if not provided
    // Note: the searchParams can be null
    const searchParams = useSearchParams();
    let rawBlockId = null;
    if (searchParams) {
        rawBlockId = searchParams.get('blockId')
    }
    if (rawBlockId === null) {
        notFound();
    }

    const blockId = hexToUint8Array(rawBlockId);
    const [microBlock, setMicroBlock] = useState<GetMicroBlockResponse>();

    useEffect(() => {
        Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")
        Carmentis.getMicroBlock(blockId).then((response: GetMicroBlockResponse) => {
            setMicroBlock(response)
        });
    }, []);

    return (
        <>
            <PageTitle title={`Micro Block Explorer - Block ${rawBlockId}`}/>
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-0">
                        <div className="card">
                            <div className="card-body pt-3">
                                <ul className="nav nav-tabs nav-tabs-bordered" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" data-bs-toggle="tab"
                                                data-bs-target="#block-overview" aria-selected="true" role="tab">Summary
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#block-hashes"
                                                aria-selected="false" tabIndex={-1} role="tab">Hashes
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#block-signatures" aria-selected="false" tabIndex={-1}
                                                role="tab">Signature
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link" data-bs-toggle="tab"
                                                data-bs-target="#block-storage" aria-selected="false" tabIndex={-1}
                                                role="tab">Storage
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview" id="block-overview"
                                         role="tabpanel"><h5 className="card-title">Micro Block Summary</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Date</div>
                                            <div id="ind0-0" className="col-lg-9 col-md-8">
                                                {microBlock && Formatters.formatTimestampToLocalDate(microBlock.ts)}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Object type</div>
                                            <div id="ind0-1" className="col-lg-9 col-md-8">
                                                {microBlock && microBlock.type}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Nonce</div>
                                            <div id="ind0-2" className="col-lg-9 col-md-8">
                                                {microBlock && microBlock.nonce}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Number of sections</div>
                                            <div id="ind0-3" className="col-lg-9 col-md-8">
                                                {microBlock && microBlock.sections.length}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Gas</div>
                                            <div id="ind0-4" className="col-lg-9 col-md-8">
                                                {microBlock && microBlock.gas}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade profile-overview" id="block-hashes" role="tabpanel">
                                        <h5 className="card-title">Micro Block Hashes</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Block hash</div>
                                            <div id="ind1-0"
                                                 className="col-lg-9 col-md-8 mono">
                                                {microBlock && Formatters.formatHash(microBlock.hash)}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Previous block hash</div>
                                            <div id="ind1-1"
                                                 className="col-lg-9 col-md-8 mono">
                                                {microBlock && Formatters.formatHash(microBlock.prevHash)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade profile-overview" id="block-signatures"
                                         role="tabpanel"><h5 className="card-title">Micro Block Signature</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Operator signature</div>
                                            <div id="ind2-0" className="col-lg-9 col-md-8 mono">
                                                {microBlock && Formatters.formatHash(microBlock.signature)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade profile-overview" id="block-storage" role="tabpanel">
                                        <h5 className="card-title">Micro Block Storage</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Micro chain</div>
                                            <div id="ind3-0" className="col-lg-9 col-md-8 mono"><Link
                                                href={microBlock ? "/explorer/virtualBlockchain?chainId=" + Formatters.formatHash(microBlock?.microChainId) : ""}>
                                                { microBlock && Formatters.formatHash(microBlock.microChainId) }
                                            </Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Block</div>
                                            <div id="ind3-1" className="col-lg-9 col-md-8 mono">
                                                <Link href={ microBlock ? "/explorer/masterblock?blockId=" + microBlock.masterBlock : ""}>
                                                {microBlock && microBlock.masterBlock}
                                            </Link>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Index in block</div>
                                            <div id="ind3-2" className="col-lg-9 col-md-8 mono">
                                                {microBlock && microBlock.index}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Offset in block</div>
                                            <div id="ind3-3" className="col-lg-9 col-md-8 mono">
                                                {microBlock && microBlock.offset}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Sections</h5>
                                <table id="microBlockBody" className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col"  className="text-center">Index</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Size</th>
                                        <th scope="col" className="text-center">Content</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {microBlock && microBlock.sections.map((section: Section, index: number) => {
                                            return <tr key={index}>
                                                <td className="text-center">{index}</td>
                                                <td>{section.type}</td>
                                                <td>{Formatters.formatByteSize(section.size)}</td>
                                                <td className="text-center">Show</td>
                                            </tr>
                                        })
                                        }

                                    </tbody>
                                </table>
                                <button id="explore" type="button" className="btn btn-primary btn-sm rounded-pill"
                                >Explore flow data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}