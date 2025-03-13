'use client'


import {PageTitle} from "@/app/components/pagetitle";
import {useParams, useRouter} from "next/navigation";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {Card, CardContent} from "@mui/material";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQuery, BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";

export default function MasterBlockExplorer() {
    const params = useParams<{id: string}>();
    const { id } = params;

    return (
        <>
            <PageTitle title={`Master Block ${id}`}></PageTitle>
            <MasterBlock id={parseInt(id)}/>
        </>
    );
}

async function loadBlock( [,client, h]: [string, BlockchainQuery, number] ) {
    const block = await client.getMasterBlock(h)
    return block;
    /*
    const status = await sdk.blockchain.blockchainQuery.getBlockInfo(h);
    const content = await sdk.blockchain.blockchainQuery.getBlockContent(h);
    return {
        status,
        content
    };

     */
}


function MasterBlock( {id}: {id: number} ) {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);

    const router = useRouter();
    const {data, isLoading, error} = useSWR(["getCurrentHeight", client, id], loadBlock);

    if (isLoading) return <Skeleton/>
    if (!data || error) return <>An error occurred.</>

    async function renderMicroBlock( data: string ) {
        //const c = await sdk.blockchain.blockchainQuery.getMicroblockContent(data.hash)
        const c = await client.getMicroBlock(data);
        return [
            <td key={0}>{data}</td>,
            <td key={1}>{c.getNumberOfSections()}</td>,
            <td key={2}>{c.getDate().toLocaleString()}</td>,
        ]
    }



    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={["Virtual Blockchain", "Sections", "Timestamp"]}
                noWrapCell={true}
                data={data.getMicroBlocksHash()}
                renderRow={renderMicroBlock}
                onRowClicked={(data) => {router.push(`/explorer/microblock/${data}`)}}
            />
        </CardContent>
    </Card>
}