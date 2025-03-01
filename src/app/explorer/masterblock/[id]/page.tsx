'use client'


import {PageTitle} from "@/app/components/pagetitle";
import {useParams, useRouter} from "next/navigation";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {Card, CardContent} from "@mui/material";
import {CURVE} from "../../../../../../carmentis-core/types/common/crypto/noble/secp256k1";
import b = CURVE.b;

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

async function loadBlock( data: [string, number] ) {
    const [,h] = data;
    const status = await sdk.blockchain.blockchainQuery.getBlockInfo(h);
    const content = await sdk.blockchain.blockchainQuery.getBlockContent(h);
    return {
        status,
        content
    };
}

type MicroBlock = {
    timestamp: number;
    hash: string;
    vbHash: string;
}

function MasterBlock( {id}: {id: number} ) {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);
    const {data, isLoading, error} = useSWR(["getCurrentHeight", id], loadBlock);

    console.log(data, isLoading, error)
    if (isLoading) return <Skeleton/>
    if (!data || error) return <>An error occurred.</>


    async function renderMicroBlock( data: MicroBlock ) {
        const c = await sdk.blockchain.blockchainQuery.getMicroblockContent(data.hash)
        console.log(c)
        let numberSections = '??';
        if ( Array.isArray(c.body.sections) ){
            numberSections = c.body.sections.length.toString();
        }
        return [
            <td>{data.hash}</td>,
            <td>{numberSections}</td>,
            <td>{data.vbHash}</td>,
            <td>{data.timestamp}</td>,
        ]
    }

    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={["Hash", "#Sections","Virtual Blockchain", "Timestamp"]}
                noWrapCell={true}
                data={data.content.microblocks}
                renderRow={renderMicroBlock}
                onRowClicked={(data) => {router.push(`/explorer/microblock/${data.hash}`)}}
            />
        </CardContent>
    </Card>
}