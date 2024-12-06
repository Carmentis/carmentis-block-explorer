import { Hash } from '@/app/interfaces/hash';

export interface MasterBlock {
    id: number;
    status: number;
    timestamp: number;
    hash: Hash;
    node: Node;
    size: number;
    nMicroblock: number;
}
