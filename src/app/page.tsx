'use client';

import * as Carmentis from "@/carmentis-nodejs-sdk";
import { useState } from 'react';
import { PageTitle } from '@/app/components/pagetitle';
import { GetChainStatusResponse } from '@/app/interfaces/getChainStatusResponse';
import {DynamicTableMasterBlocks} from '@/app/components/tableMasterBlocks';
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";







interface TableInput {
    blockId: number;
    length: number;
}
const TABLE_ROWS_LENGTH = 10;
export default function Home() {
    const [lastBlockId, setLastBlockId] = useState<number>();
    const [nMicroBlock, setNMicroBlock] = useState<number>();
    const [nVirtualBlockchains, setNVirtualBlocks] = useState<number>();
    const [tableInput, setTableInput] = useState<TableInput>();
    Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainQuery.getChainStatus().then(console.log)
    sdk.blockchain.blockchainQuery.getAccounts().then(console.log)



    /*
    const {data, isLoading, error} = useSWR(async () => {
        /*
        Carmentis.getChainStatus().then((status: GetChainStatusResponse) => {
            const lastBlockId = status.data.lastBlockId;
            setLastBlockId(lastBlockId)
            setNMicroBlock(status.data.nMicroblock)
            setNVirtualBlocks(status.data.nFlow);

            const firstBlockId = Math.max(lastBlockId - TABLE_ROWS_LENGTH + 1, 1);
            setTableInput({
                blockId: firstBlockId,
                length: TABLE_ROWS_LENGTH
            })


        }).catch(console.error);

    })

     */

    const {data, isLoading, error} = useSWR(null);

    console.log(data, isLoading, error)
    
    if (!data || isLoading) return <Skeleton/>
    return (
        <>
            <PageTitle title={"Dashboard"}></PageTitle>
            <div className="row">
                <div className="col-lg-0">
                    <div className="row">
                        <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12">
                            <div className="card info-card sales-card">
                                <div className="card-body"><h5 className="card-title">Current Block</h5>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-box"></i></div>
                                        <div className="ps-3">
                                            <h6 id="ind0">{lastBlockId}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12">
                            <div className="card info-card sales-card">
                                <div className="card-body"><h5 className="card-title">Micro Blocks</h5>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-boxes"></i></div>
                                        <div className="ps-3"><h6 id="ind1">{nMicroBlock}</h6></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12">
                            <div className="card info-card sales-card">
                                <div className="card-body"><h5 className="card-title">Virtual Blockchains</h5>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-layers"></i></div>
                                        <div className="ps-3"><h6 id="ind2">
                                            { nVirtualBlockchains }
                                        </h6></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xxl-3 col-lg-4 col-md-6 col-sm-12">
                            <div className="card info-card sales-card">
                                <div className="card-body"><h5 className="card-title">Throughput</h5>
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i className="bi bi-speedometer2"></i></div>
                                        <div className="ps-3"><h6 id="ind3">0.00</h6><span
                                            className="text-muted small pt-2 ps-1">events per second</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    { tableInput &&
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Last Blocks</h5>
                                <DynamicTableMasterBlocks></DynamicTableMasterBlocks>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    
    );
}
