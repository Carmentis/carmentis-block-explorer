'use client';

import {useParams} from "next/navigation";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import useSWR from "swr";
import Spinner from "@/app/components/loading-page.component";
import {
    Card,
    CardContent, Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {PageTitle} from "@/app/components/pagetitle";
import TableMicroBlocks from "@/app/components/table-micro-blocks";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";

const fetcher = async ( input: string[] ) =>  {
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string" );
    const hash = input[1];
    const info = await sdk.blockchain.blockchainQuery.getVirtualBlockchainInfo(hash)
    const content = await sdk.blockchain.blockchainQuery.getVirtualBlockchainContent(hash)
    return { info, content }
}

export default function Page() {
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);

    const {data, isLoading, error} = useSWR(["getAppLedger", hash], fetcher);

    if (isLoading) { return <Spinner />; }
    if (error || !data) return <Typography>An error occurred: {error}</Typography>;

    const height = data.info.height;
    const type = data.info.type;

    return <>
        <PageTitle title={`Virtual Blockchain`}></PageTitle>
        <Card sx={{  margin: "auto", mt: 4, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Virtual Blockchain
                    { type === sdk.constants.ID.OBJ_APP_LEDGER && <Chip label={"App Ledger"}/> }
                    { type === sdk.constants.ID.OBJ_ACCOUNT && <Chip label={"Account"}/> }
                    { type === sdk.constants.ID.OBJ_APP_USER && <Chip label={"App User"}/> }
                    { type === sdk.constants.ID.OBJ_ORACLE && <Chip label={"Oracle"}/> }
                    { type === sdk.constants.ID.OBJ_APPLICATION && <Chip label={"Application"}/> }
                    { type === sdk.constants.ID.OBJ_ORGANIZATION && <Chip label={"Organisation"}/> }
                    { type === sdk.constants.ID.OBJ_VALIDATOR_NODE && <Chip label={"Validator Node"}/> }
                </Typography>
                <TableContainer component={Paper} sx={{mt: 2, mb: 4}} elevation={0}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Virtual Blockchain</TableCell>
                                <TableCell>{hash}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Height:</TableCell>
                                <TableCell>{height}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Last Micro-Block</TableCell>
                                <TableCell>{height}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>
                    Micro-Blocks
                </Typography>
                <TableMicroBlocks hashes={data.content.list}/>
            </CardContent>
        </Card>
    </>
}