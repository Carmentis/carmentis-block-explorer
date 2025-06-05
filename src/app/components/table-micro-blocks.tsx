import {useRouter} from "next/navigation";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";
import {DynamicTableComponent} from "@/components/table.component";

export type TableMicroBlocksProps = {
    hashes: string[]
}
export default function TableMicroBlocks(props: TableMicroBlocksProps) {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);

    async function renderMicroBlock( data: string ) {
        //const c = await sdk.blockchain.blockchainQuery.getMicroblockContent(data.hash)
        const c = await client.getMicroBlock(data);
        return [
            <td key={0}>{data}</td>,
            <td key={1}>{c.getNumberOfSections()}</td>,
            <td key={2}>{c.getDate().toLocaleString()}</td>,
        ]
    }

    return <DynamicTableComponent
        header={["Micro-Block Hash", "Sections", "Timestamp"]}
        data={props.hashes}
        renderRow={renderMicroBlock}
        onRowClicked={(data) => {router.push(`/explorer/microblock/${data}`)}}
    />
}