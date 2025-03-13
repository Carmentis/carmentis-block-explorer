import {MasterBlock} from '@/app/interfaces/masterBlock';

export interface MasterBlockList {
    id: number,
    data: {
        list: MasterBlock[]
    };
}
