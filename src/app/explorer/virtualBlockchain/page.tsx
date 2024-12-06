'use client'

import {PageTitle} from '@/app/components/pagetitle';
import {notFound, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";

import * as Carmentis from '@/carmentis-nodejs-sdk';
import {hexToUint8Array} from "@/app/utils/encoders";
import {GetMicroBlockResponse} from "@/app/interfaces/getMicroBlockResponse";
import {Formatters} from "@/app/utils/formatters";
import {GetVirtualBlockResponse} from "@/app/interfaces/getVirtualBlochainResponse";
import TableMicroBlocks from "@/app/components/tableMicroBlocks";

export default function MicroBlockExplorer() {

    // obtains the searched master block id from query parameter
    // or fails if not provided
    const searchParams = useSearchParams();
    let rawChainId = null;
    if( searchParams ) {
        rawChainId = searchParams.get('chainId');
    }
    if (rawChainId === null) {
        notFound();
    }

    const chainId = hexToUint8Array(rawChainId);
    const [response, setResponse] = useState<GetVirtualBlockResponse>();

    useEffect(() => {
        Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")
        Carmentis.getMicroChain(chainId).then((response: GetVirtualBlockResponse) => {
            setResponse(response)
        });
    }, []);


    function createdOn( response: GetVirtualBlockResponse ) : number {
        return response.microBlock.reduce((acc: number, curr: GetMicroBlockResponse) => {
            return Math.min(acc, curr.ts)
        }, response.microBlock[0].ts)
    }

    function lastUpdate( response: GetVirtualBlockResponse ) : number {
        return response.microBlock.reduce((acc: number, curr: GetMicroBlockResponse) => {
            return Math.max(acc, curr.ts)
        }, response.microBlock[0].ts)
    }

    return (
        <>
            <PageTitle title={`Virtual Blockchain Explorer - Virtual Blockchain ${rawChainId}`}/>
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
                                </ul>
                                <div className="tab-content pt-2">
                                    <div className="tab-pane fade show active profile-overview" id="block-overview"
                                         role="tabpanel"><h5 className="card-title">Micro Chain Summary</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Created on</div>
                                            <div id="ind0-0" className="col-lg-9 col-md-8">
                                                { response && Formatters.formatTimestampToLocalDate(createdOn(response)) }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Last updated on</div>
                                            <div id="ind0-1" className="col-lg-9 col-md-8">
                                                { response && Formatters.formatTimestampToLocalDate(lastUpdate(response)) }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Status</div>
                                            <div id="ind0-2" className="col-lg-9 col-md-8"><i
                                                className="bi bi-circle-fill activity-badge text-success align-self-start"></i>
                                                { response && response.status }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Object type</div>
                                            <div id="ind0-3" className="col-lg-9 col-md-8">
                                                { response && Formatters.formatObjectType( response.type ) }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Number of micro blocks</div>
                                            <div id="ind0-4" className="col-lg-9 col-md-8">
                                                {response && response.microBlock.length}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade profile-overview" id="block-hashes" role="tabpanel">
                                        <h5 className="card-title">Micro Chain Hashes</h5>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Hash of genesis micro block</div>
                                            <div id="ind1-0"
                                                 className="col-lg-9 col-md-8 mono">0x071DEA8A77381CA790BC38AB0C6667189F8C10A1BDBFB29100DE23D77C90CE31
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-3 col-md-4 label">Hash of last micro block</div>
                                            <div id="ind1-1"
                                                 className="col-lg-9 col-md-8 mono">0x071DEA8A77381CA790BC38AB0C6667189F8C10A1BDBFB29100DE23D77C90CE31
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Micro Blocks</h5>
                                {
                                    response?.microBlock &&
                                    <TableMicroBlocks blocks={response.microBlock}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}