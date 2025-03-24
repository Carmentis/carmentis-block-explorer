'use client'


import {PageTitle} from "@/app/components/pagetitle";
import {useParams, useRouter} from "next/navigation";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {Card, CardContent} from "@mui/material";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQuery, BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";
import TableMicroBlocks from "@/app/components/table-micro-blocks";

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
    return await client.getMasterBlock(h);
}


function MasterBlock( {id}: {id: number} ) {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);

    const router = useRouter();
    const {data, isLoading, error} = useSWR(["getCurrentHeight", client, id], loadBlock);

    if (isLoading) return <Skeleton/>
    if (!data || error) return <>An error occurred.</>




    return <Card>
        <CardContent>
            <TableMicroBlocks hashes={data.getMicroBlocksHash()}/>
        </CardContent>
    </Card>
}

