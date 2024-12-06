import {Hash} from "@/app/interfaces/hash";
import {Id} from "@/app/interfaces/id";


interface Header {
    ts: number;
    nodeId: Id;
    previousHash: Hash;
    nonce: number;
    merkleRootHash: Hash;
    radixRootHash: Hash;
    chainId: string;
}

export interface MicroBlock {
    hash: Hash;
    microChainId: Id;
    type: number;
    nonce: number;
    size: number;
    nSection: number;
}


export interface GetMasterBlockResponse {
    header: Header;
    microBlock: MicroBlock[]; // Use a more specific type if microBlock has a defined structure
}