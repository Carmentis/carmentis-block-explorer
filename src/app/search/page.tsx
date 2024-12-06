'use client'

import {PageTitle} from "@/app/components/pagetitle";
import {notFound, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Skeleton from "react-loading-skeleton";
import * as Carmentis from "@/carmentis-nodejs-sdk";
import {GetMasterBlockResponse} from "@/app/interfaces/getMasterBlockResponse";
import Link from "next/link";
import {hexToUint8Array} from "@/app/utils/encoders";
import {GetMicroBlockResponse} from "@/app/interfaces/getMicroBlockResponse";
import {Formatters} from "@/app/utils/formatters";
import {GetVirtualBlockResponse} from "@/app/interfaces/getVirtualBlochainResponse";

/**
 * This interface is used as a compressed object to handle all possible results returns
 * by the search function.
 */
interface SearchResult {
    masterBlocks: GetMasterBlockResponse[];
    microBlocks: GetMicroBlockResponse[];
    virtualBlockchains: GetVirtualBlockResponse[];
}

/**
 * Returns an empty search results.
 * @constructor
 */
function CreateEmptySearchResults(): SearchResult {
    return {
        masterBlocks: [],
        microBlocks: [],
        virtualBlockchains: []
    }
}

export default function SearchPage() {
    // the searchParams can be null
    const searchParams = useSearchParams();
    let searchQuery = null;
    if ( searchParams ) {
        searchQuery =  searchParams.get('query');
    }

    // go to not found page if no results
    if (searchQuery === null) {
        notFound();
    }

    // search for results
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchResults, setSearchResults] = useState<SearchResult>(CreateEmptySearchResults());
    Carmentis.registerNodeEndpoint("https://node.testapps.carmentis.io")

    useEffect(() => {
        setIsLoading(true);
        new Promise<void>(async () => {
            const masterBlocks: GetMasterBlockResponse[] = [];
            const microBlocks: GetMicroBlockResponse[] = [];
            const virtualBlockchains: GetVirtualBlockResponse[] = [];

            // search for master block
            try {
                const blockId = parseInt(searchQuery);
                const response = await Carmentis.getMasterBlock(blockId);
                masterBlocks.push(response)
            } catch (e) {
                console.info(e)
            }

            // search for micro-block
            try {
                const blockId = hexToUint8Array(searchQuery);
                const microBlock = await Carmentis.getMicroBlock(blockId);
                microBlocks.push(microBlock);
            } catch (e) {
                console.info(e)
            }

            // search for virtual blockchains
            try {
                const chainId = hexToUint8Array(searchQuery);
                const response = await Carmentis.getMicroChain(chainId);
                virtualBlockchains.push(response)
            } catch (e) {
                console.info(e)
            }

            setSearchResults({
                masterBlocks,
                microBlocks,
                virtualBlockchains,
            })
            setIsLoading(false);
        });
    }, [searchQuery]);


    return <>
        <PageTitle title={"Search"}></PageTitle>
        <section className="section dashboard">
            <div className="row">
                <div className="col-lg-0">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Results for <b>&quot;{searchQuery}&quote;</b></h5>
                        </div>
                    </div>

                    {isLoading &&
                        <>
                            <div className="mb-4">
                                <Skeleton height={150} baseColor={'#ffffff'}></Skeleton>
                            </div>
                            <div className="mb-4">
                                <Skeleton height={150} baseColor={'#ffffff'}></Skeleton>
                            </div>
                            <div className="mb-4">
                                <Skeleton height={150} baseColor={'#ffffff'}></Skeleton>
                            </div>
                        </>

                    }
                    {!isLoading && <DisplaySearchResults searchQuery={searchQuery} results={searchResults}/>

                    }
                </div>
            </div>
        </section>
    </>;
}

function DisplaySearchResults(input: { searchQuery: string, results: SearchResult }) {
    const [results, setResults] = useState<SearchResult>(input.results);
    useEffect(() => {
        setResults(input.results);
    }, [input.results]);

    function hasResult<T>(data: Array<T> | undefined) {
        return data instanceof Array && data.length > 0;
    }

    return <>

        {hasResult(results.masterBlocks) &&
            <>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            <i className="bi bi-box mr-1"></i>
                            Found Master Blocks
                        </h5>

                        <table className="table">
                            <thead>
                            <tr>

                                <th className="col">Master Block</th>
                                <th className="col">Date</th>
                                <th>Node</th>
                                <th className="col">Number Micro Blocks</th>
                                <th className="col">Merkle Root Hash</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                input.results.masterBlocks.map((block: GetMasterBlockResponse) => {
                                    return <tr key={block.header.nonce}>

                                        <td className="col">
                                            <Link href={"/explorer/masterblock?blockId=" + block.header.nonce}>
                                                {block.header.nonce}
                                            </Link>
                                        </td>
                                        <td>{Formatters.formatTimestampToLocalDate(block.header.ts)}</td>
                                        <td>--</td>
                                        <td>{block.microBlock.length}</td>
                                        <td className="col">
                                            {Formatters.formatHash(block.header.merkleRootHash)}
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        }


        {hasResult(results.virtualBlockchains) &&
            <>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">
                            <i className="bi bi-layers mr-1"></i>
                            Found Virtual Blockchains
                        </h5>

                        <table className="table">
                            <thead>
                            <tr>
                                <th className="col">Blockchain Id</th>
                                <th>Micro Blocks Number</th>
                                <th>Nonce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                input.results.virtualBlockchains.map((block: GetVirtualBlockResponse, index: number) => {
                                    return <tr key={index}>
                                        <td className="col">
                                            <Link
                                                href={"/explorer/virtualBlockchain?chainId=" + Formatters.formatHash(block.hash)}>
                                                {Formatters.reduceHashSize(Formatters.formatHash(block.hash))}
                                            </Link>
                                        </td>
                                        <td className="col">
                                            {block.microBlock.length}
                                        </td>
                                        <td className="col">
                                            {block.currentNonce}
                                        </td>


                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        }

        {hasResult(results.microBlocks) &&
            <>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title"><i className="bi bi-boxes mr-1"></i>Found Micro Blocks</h5>

                        <table className="table">
                            <thead>
                            <tr>
                                <th className="col">Micro Block</th>
                                <th className="col">Date</th>
                                <th className="col">Master Block</th>
                                <th className="col">Virtual Blockchain</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                input.results.microBlocks.map((block: GetMicroBlockResponse, index: number) => {
                                    return <tr key={index}>
                                        <td className="col">
                                            <Link href={"/explorer/microblock?blockId=" + input.searchQuery}>
                                                {Formatters.reduceHashSize(Formatters.formatHash(block.hash))}
                                            </Link>
                                        </td>
                                        <td className="col">{Formatters.formatTimestampToLocalDate(block.ts)}</td>
                                        <td className="col">
                                            <Link href={"/explorer/masterblock?blockId=" + block.masterBlock}>
                                                {block.masterBlock}
                                            </Link>
                                        </td>
                                        <td className="col">
                                            <Link
                                                href={"/explorer/virtualBlockchain?chainId=" + Formatters.formatHash(block.microChainId)}>
                                                {Formatters.reduceHashSize(Formatters.formatHash(block.microChainId))}
                                            </Link>
                                        </td>
                                    </tr>
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </>
        }


    </>;
}