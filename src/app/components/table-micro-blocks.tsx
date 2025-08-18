import {useRouter} from "next/navigation";
import {Hash, BlockchainFacade} from "@cmts-dev/carmentis-sdk/client";
import {DynamicTableComponent} from "@/components/table.component";
import {useExplorer} from "@/app/layout";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";
import {TableCell, TableRow} from "@mui/material";

export type TableMicroBlocksProps = {
    hashes: Hash[]
}
export default function TableMicroBlocks(props: TableMicroBlocksProps) {
    const router = useRouter();
    const network = useAtomValue(networkAtom)
    const blockchain = BlockchainFacade.createFromNodeUrl(network);

    async function renderMicroBlock( hash: Hash ) {
        //const c = await sdk.blockchain.blockchainQuery.getMicroblockContent(data.hash)
        const mb = await blockchain.getMicroblockInformation(hash);
        const header = mb.getMicroBlockHeader();
        const vbState = mb.getVirtualBlockchainState();
        const microBlockHash = hash.encode();


        return [
            <TableCell key={0}>{microBlockHash}</TableCell>,
            <TableCell key={2}>{vbState.getVbId().encode()}</TableCell>,
            <TableCell key={1}>{header.getHeight()}</TableCell>,
        ]
    }

    return <DynamicTableComponent
        header={["Micro-Block Hash",  "Virtual blockchain ID", "Height",]}
        data={props.hashes}
        renderRow={renderMicroBlock}
        onRowClicked={(data) => {router.push(`/explorer/microblock/${data.encode()}`)}}
    />
}