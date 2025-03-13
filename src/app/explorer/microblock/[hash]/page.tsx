'use client'


import {useParams} from "next/navigation";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import {MicroBlock} from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {
    Card,
    CardContent,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";


const fetcher = async ( input: string[] ) =>  {
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string" );
    const hash = input[1];
    const c = await sdk.blockchain.blockchainQuery.getMicroblockContentObject(hash)
    console.log(c)
    return c
}

export default function MicroBlockExplorer() {
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);

    // load the params
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const {data, isLoading, error} = useSWR<MicroBlock>(
        [ "getMicroblock", hash ], fetcher
    )


    if (error) return <>An error occurred while loading: {error.message}</>
    if (!data || isLoading) return

    return <DataDisplay data={data}/>
}

const DataDisplay = ({ data }: {data: MicroBlock}) => {
    return (
        <Card sx={{  margin: "auto", mt: 4, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Header Information
                </Typography>
                <TableContainer component={Paper} sx={{mt: 2, mb: 4}} elevation={0}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Protocol Version:</TableCell>
                                <TableCell>{/* Add corresponding value here if exists */}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Height:</TableCell>
                                <TableCell>{data.getHeight()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Previous Hash:</TableCell>
                                <TableCell>{data.getPreviousHash()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Timestamp:</TableCell>
                                <TableCell>{new Date(data.getTimestamp()).toLocaleString()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Gas:</TableCell>
                                <TableCell>{data.getGas()}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{fontWeight: 'bold', paddingRight: 4}}>Gas Price:</TableCell>
                                <TableCell>{data.getGasPrice()}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h6" gutterBottom>
                    Sections
                </Typography>

                <Typography variant="body1" sx={{mt: 2}}>
                    Sections represent parts of a microblock. Each section is the most atomic unit of a microblock,
                    containing a name and a value.
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell>Size</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.getSections().map((section) => (
                                <TableRow key={section.getId()}>
                                    <TableCell>{section.getId()}</TableCell>
                                    <TableCell>{section.getLabel()}</TableCell>
                                    <TableCell>{section.getSize()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

/*

 */