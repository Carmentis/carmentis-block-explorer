import {Hash} from "@/app/interfaces/hash";
import {Id} from "@/app/interfaces/id";
import {Raw} from "@/app/interfaces/raw";


export interface Section {
    type: number;
    size: number;
    data: Hash;
}

export interface GetMicroBlockResponse {
    version: number;
    nonce: number;
    prevHash: Hash;
    ts: number;
    nSection: number;
    gas: number;
    gasPrice: number;
    signature: Raw;
    seed: Raw;
    genesisId: Hash;
    sections: Section[];
    bodyHash: Hash;
    hash: Hash;
    microChainId: Id;
    size: number;
    masterBlock: number;
    type: number;
    index: number;
    offset: number;
}
