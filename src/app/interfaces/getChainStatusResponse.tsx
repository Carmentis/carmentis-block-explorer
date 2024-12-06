export interface GetChainStatusResponse {
    id: number;
    data: {
        lastBlockId: number;
        timeToNextBlock: number;
        nSection: number;
        nMicroblock: number;
        nOrganization: number;
        nNode: number;
        nUser: number;
        nApplication: number;
        nFlow: number;
    }
}