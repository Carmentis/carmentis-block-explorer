import {GetMicroBlockResponse} from "@/app/interfaces/getMicroBlockResponse";
import {Hash} from "@/app/interfaces/hash";

export interface GetVirtualBlockResponse {
    status: number;
    microBlock: GetMicroBlockResponse[];
    currentBlock:  null;
    currentNonce: number;
    hash: Hash;
    type: number;
}
