'use client';

import * as Carmentis from "@/carmentis-nodejs-sdk";
import {PropsWithChildren, useState} from 'react';
import { PageTitle } from '@/app/components/pagetitle';
import {DynamicTableMasterBlocks} from '@/app/components/tableMasterBlocks';
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import {Card, CardContent} from "@mui/material";



let height = 200;

async function loadCurrentHeight() {
    const status = await sdk.blockchain.blockchainQuery.getChainStatus()
    height = height += 1;
    return {lastBlockHeight: height};
}


export default function Home() {

    return (
        <>
            <PageTitle title={"Dashboard"}></PageTitle>
            <LatestBlocks/>
        </>
    );
}

const LIMIT = 10;
function LatestBlocks() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);


    const {data, isLoading, error} = useSWR(["getCurrentHeight"], loadCurrentHeight, { refreshInterval: 1000 });
    if (error) return <>An error occurred. Error: {error}</>
    if (isLoading || !data) return <Skeleton/>
    const masterBlockIds = [];
    const lastBlockHeight = data.lastBlockHeight;
    for (let i = lastBlockHeight; i > lastBlockHeight - LIMIT; i--) {
        masterBlockIds.push(i);
    }

    async function renderRow( blockHeight: number ) {
        return [
            <td key={blockHeight}>{blockHeight}</td>
        ]
    }

    return <LatestBlocksDisplay>
        <DynamicTableComponent
            key={lastBlockHeight}
            header={["Id"]}
            noWrap={true}
            data={masterBlockIds}
            renderRow={renderRow}
            onRowClicked={(h) => {router.push(`/explorer/masterblock/${h}`)}}
        />
    </LatestBlocksDisplay>
}

function LatestBlocksDisplay({children}: PropsWithChildren) {
    return <Card>
        <CardContent>
            {children}
        </CardContent>
    </Card>
}

