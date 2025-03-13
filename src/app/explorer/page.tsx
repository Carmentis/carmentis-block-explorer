'use client'


import {PageTitle} from '@/app/components/pagetitle';
import {useEffect, useRef, useState} from "react";
import {DynamicTableMasterBlocks} from "@/app/components/tableMasterBlocks";
import *  as Carmentis from '@/carmentis-nodejs-sdk';
import {GetChainStatusResponse} from "@/app/interfaces/getChainStatusResponse";

/**
 *
 * This functions render a navigation page system in which a user wants to see the
 * blocks in the master blockchain.
 *
 * @constructor
 */
export default function BlockchainExplorer() {


    // the block explorer is ultimately defined by two variables: A firstBlockId and a counter on the number
    // displayed rows. Initially the firstBlockId is set to max(1, lastBlockId - displayedRowsNumber). When the
    // user wants to go back on the chain, we decrement by displayedRowsNumber the firstBlockId and display the
    // updated table.
    const [firstBlockId, setFirstBlockId] = useState<number>();
    const lastBlockId = useRef<number>();
    const displayedRowsNumber = 10;

    useEffect(() => {
        Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io");
        Carmentis.getChainStatus().then((status: GetChainStatusResponse) => {
            lastBlockId.current = status.data.lastBlockId + 1 // to include the latest block;
            const firstBlockId = Math.max(1, lastBlockId.current - displayedRowsNumber);
            setFirstBlockId(firstBlockId);
        })

    }, []);





    return (
        <>
            <PageTitle title={"Explorer"}></PageTitle>
            <div className="row">
                <div className="col-lg-0">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Blocks</h5>
                            {firstBlockId &&
                                <DynamicTableMasterBlocks/>
                            }


                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
