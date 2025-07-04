import {useRouter} from "next/navigation";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {Hash} from "@cmts-dev/carmentis-sdk/client";
import {DynamicTableComponent} from "@/components/table.component";
import {useBlockchain, useExplorer} from "@/app/layout";

export type TableMicroBlocksProps = {
    hashes: Hash[]
}
export default function TableMicroBlocks(props: TableMicroBlocksProps) {
    const router = useRouter();
    const explorer = useExplorer();

    async function renderMicroBlock( hash: Hash ) {
        //const c = await sdk.blockchain.blockchainQuery.getMicroblockContent(data.hash)
        const mb = await explorer.getMicroBlock(hash);
        //const header = await explorer.getMicroBlockHeader(hash);


        return [
            <td key={0}>{hash.encode()}</td>,
            <td key={1}>{mb.getNumberOfSections()}</td>,
            <td key={2}>{mb.header.timestamp.toLocaleString()}</td>,
        ]
    }

    return <DynamicTableComponent
        header={["Micro-Block Hash", "Height", "Timestamp"]}
        data={props.hashes}
        renderRow={renderMicroBlock}
        onRowClicked={(data) => {router.push(`/explorer/microblock/${data}`)}}
    />
}