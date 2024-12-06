'use client'

import {useEffect, useRef, useState} from 'react';
import { MasterBlock } from '@/app/interfaces/masterBlock';
import * as Carmentis from '@/carmentis-nodejs-sdk';
import { MasterBlockList } from '@/app/interfaces/masterBlockList';
import {Formatters} from "@/app/utils/formatters";
import Link from "next/link"
import {GetChainStatusResponse} from "@/app/interfaces/getChainStatusResponse";
import Skeleton from "react-loading-skeleton";


export function StaticTableMasterBlocks(input: { blockId: number, length: number } ) {
    const [masterBlockList, setMasterBlockList] = useState<MasterBlock[]>([])

    useEffect(() => {
        Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")
        Carmentis.getMasterBlockList(input.blockId, input.length).then(
            (masterBlockList: MasterBlockList) => {
                setMasterBlockList(masterBlockList.data.list)
            }
        )
    }, []);

    return <>
        <TableMasterBlocks blocks={masterBlockList} />
    </>
}


/**
 * This function is used in order to integrate a dynamic update of the master blocks.
 * This component is useful to new blocks smoothly instead of reloading the entire component.
 *
 * @constructor
 */
export function DynamicTableMasterBlocks() {
    const [masterBlockList, setMasterBlockList] = useState<MasterBlock[]>([])
    const lastBlockId = useRef<number>();
    const firstBlockId = useRef<number>();
    const displayedRowsNumber = 10;
    const intervalFunctionInitialized = useRef<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    function getBlocksOnline() {
        setIsLoading(true);
        Carmentis.getMasterBlockList(firstBlockId.current, displayedRowsNumber).then(
            (masterBlockList: MasterBlockList) => {
                setMasterBlockList(masterBlockList.data.list)
                setIsLoading(false)
            }
        )
    }

    /**
     * This function is fired when the user wants to see more recent blocks.
     *
     * @constructor
     */
    function GoPrevious() {
        if ( !lastBlockId.current || !firstBlockId.current ) {
            console.warn("first or last block id is undefined")
            return
        }
        firstBlockId.current = Math.min(
                Math.max(1, lastBlockId.current - displayedRowsNumber),
                firstBlockId.current + displayedRowsNumber
            );
        getBlocksOnline()

    }

    function GoNext() {
        if ( !lastBlockId.current || !firstBlockId.current ) {
            console.warn("first or last block id is undefined")
            return
        }
        firstBlockId.current = Math.max(firstBlockId.current - displayedRowsNumber, 1);
        getBlocksOnline()
    }

    function GoNewest() {
        if ( !lastBlockId.current || !firstBlockId.current ) {
            console.warn("first or last block id is undefined")
            return
        }
        setIsLoading(true)
        Carmentis.getChainStatus().then((status:GetChainStatusResponse) => {
            lastBlockId.current = status.data.lastBlockId;
            firstBlockId.current = lastBlockId.current - displayedRowsNumber;
            Carmentis.getMasterBlockList(firstBlockId.current, 10).then(
                (masterBlockList: MasterBlockList) => {
                    setMasterBlockList(masterBlockList.data.list)
                    setIsLoading(false)
                }
            )
        })
    }

    function GoOldest() {
        firstBlockId.current = 1;
        getBlocksOnline();
    }

    // we first load the ten last blocks
    useEffect(() => {
        setIsLoading(true);
        // populate the table with latest blocks
        Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")
        Carmentis.getChainStatus().then((status:GetChainStatusResponse) => {
            lastBlockId.current = status.data.lastBlockId;
            firstBlockId.current = lastBlockId.current - displayedRowsNumber;
            Carmentis.getMasterBlockList(firstBlockId.current, 10).then(
                (masterBlockList: MasterBlockList) => {
                    setMasterBlockList(masterBlockList.data.list)
                    setIsLoading(false)
                }
            )
        })

        if (!intervalFunctionInitialized.current) {
            setInterval(() => {
                // do not perform any update if the first block or the last  block if are not defined
                if ( !firstBlockId.current || !lastBlockId.current ) {
                    return
                }

                // if the displayed rows do not display recent blocks, do not load them
                if ( firstBlockId.current + displayedRowsNumber < lastBlockId.current ) {
                    return
                }


                Carmentis.getMasterBlockList(lastBlockId.current, 5).then(
                    (masterBlockList: MasterBlockList) => {
                        // halt if the first or last block id is undefined
                        if ( !firstBlockId.current || !lastBlockId.current ) {
                            return
                        }

                        // get the newest block in the returned blocks
                        const blocks = masterBlockList.data.list;
                        const newLastBlockId: number = blocks.reduce((acc:number, block:MasterBlock) => {
                            return Math.max(acc, block.id)
                        }, lastBlockId.current);



                        // if the new last block equals the current last block id, then no new block is added so nothing
                        // as to be updated. In such case, we update the last block id
                        if ( lastBlockId.current === newLastBlockId ) return
                        lastBlockId.current = newLastBlockId;


                        // otherwise, the displayed blocks have to be updated
                        setMasterBlockList((displayedMasterBlocks: MasterBlock[]) => {
                            // we start the update by removing the first element if it's a block in progress
                            if ( displayedMasterBlocks.length !== 0 && displayedMasterBlocks[0].status == 0 ) {
                                displayedMasterBlocks.shift();
                            }

                            // the received blocks are ordered by decreasing chronoligcal order
                            const newDisplayedBlocksList = (blocks.concat(displayedMasterBlocks)).slice(0, displayedRowsNumber)

                            // we extract the oldest displayed block id to update the first block id
                            firstBlockId.current = newDisplayedBlocksList.reduce((acc:number, block:MasterBlock) => {
                                return Math.min(acc, block.id)
                            }, newDisplayedBlocksList[0].id);

                            return newDisplayedBlocksList;
                        })
                    }
                )
            }, 1000)
            intervalFunctionInitialized.current = true;
        }
    }, []);

    if (isLoading) { return <Skeleton count={11} />; }

    return <>


        <table id="masterBlocks" className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col">Hash</th>
                <th scope="col">Node</th>
                <th scope="col">Size</th>
                <th scope="col" className="text-center">Micro Blocks</th>
            </tr>
            </thead>
            <tbody>
            {
                masterBlockList.length === 0 &&
                <tr>
                    <td colSpan={8}>(No entry)</td>
                </tr>
            }
            {

                masterBlockList.map((block: MasterBlock) => {
                    return <MasterBlockTableRow block={block} key={block.id}></MasterBlockTableRow>
                })
            }

            </tbody>
        </table>

        <nav aria-label="Page navigation example">
            <ul className="pagination">

                <li className="page-item"><span className="page-link" onClick={GoNewest}>Newest</span></li>
                <li className="page-item"><span className="page-link" onClick={GoPrevious}>Newer</span></li>
                <li className="page-item"><span className="page-link" onClick={GoNext}>Older</span></li>
                <li className="page-item"><span className="page-link" onClick={GoOldest}>Oldest</span></li>
            </ul>
        </nav>
    </>;
}

export function TableMasterBlocks(input: { blocks: MasterBlock[] }) {

    return (
        <table id="masterBlocks" className="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Status</th>
                <th scope="col">Date</th>
                <th scope="col">Hash</th>
                <th scope="col">Node</th>
                <th scope="col">Size</th>
                <th scope="col" className="text-center">Micro Blocks</th>
            </tr>
            </thead>
            <tbody>
            {

                input.blocks.map((block: MasterBlock) => {
                    return <MasterBlockTableRow block={block} key={block.id}></MasterBlockTableRow>
                })
            }

            </tbody>
        </table>
    );
}


export function MasterBlockTableRow(input: { block: MasterBlock }) {
    const block = input.block;
    return <tr>
        {block.status == 0 &&
            <>
                <td>{block.id}</td>
                <td>
                    <i
                        className="bi bi-circle-fill  text-info align-self-start"></i>
                    In progress
                </td>
                <td>Now</td>
                <td className="mono">--</td>
                <td>--</td>
                <td>--</td>
                <td className="text-center">--</td>
            </>
        }

        {block.status == 1 &&
            <>
                <td><Link href={"explorer/masterblock?blockId=" + block.id}>{block.id}</Link>
                </td>
                <td>

                    <i
                        className="bi bi-circle-fill activity-badge text-info align-self-start"></i>
                    Closed

                </td>
                <td>{Formatters.formatTimestampToLocalDate(block.timestamp)}</td>
                <td className="mono">
                    {Formatters.formatHash(block.hash)}
                </td>
                <td>Carmentis</td>
                <td>{block.size} bytes</td>
                <td className="text-center">{block.nMicroblock}</td>
            </>
        }

    </tr>
}