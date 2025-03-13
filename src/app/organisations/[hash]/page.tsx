'use client';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import useSWR from 'swr';
import {useParams, useRouter} from "next/navigation";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {AccountState, OrganisationDescription} from '@cmts-dev/carmentis-sdk/client';
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import React from 'react';
import AvatarPlaceholder from 'boring-avatars';

type OrganisationDetailProps = {
    data: OrganisationData;
};

// Fetcher function to be implemented by you
const fetcher = async (organisationHash: string) => {
   const vb = new sdk.blockchain.organizationVb(organisationHash);
   await vb.load();
   const description = await vb.getDescriptionObject();
   const account = await sdk.blockchain.blockchainQuery.getAccountStateObject(organisationHash);
   return {
       description,
       account
   }
};

type OrganisationData = {
    description: OrganisationDescription,
    account: AccountState,
}

export default function OrganisationPage() {
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainCore.setNode(network);
    sdk.blockchain.blockchainQuery.setNode(network);
    const params = useParams<{hash: string}>();
    const {data, error, isLoading} = useSWR<OrganisationData>(
        ["getSingleOrganisation", params.hash],
        async ([, hash]: [string,string]) => fetcher(hash));


    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress/>
            </Box>
        );
    }

    if (!data || error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    Failed to load organisation details. Please try again later.
                </Typography>
            </Container>
        );
    }

    return <OrganisationDetail
        data={data}
    />;
}




const OrganisationDetail: React.FC<OrganisationDetailProps> = ({data}: {data: OrganisationData}) => {
    const router = useRouter();
    return (
        <Container component={Paper} sx={{p: 4}}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <AvatarPlaceholder
                    size={100}
                    name={data.description.getPublicKey()}
                    variant="marble"
                />
                <Typography variant="h5" mt={2}>
                    {data.description.getName()}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Location</Typography></TableCell>
                            <TableCell>{data.description.getFormattedLocation()}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Public Key</Typography></TableCell>
                            <TableCell>{data.description.getPublicKey()}</TableCell>
                            <TableCell>
                                <Button onClick={() => router.push(`/accounts/publicKey/${data.description.getPublicKey()}`)}>See account</Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Balance</Typography></TableCell>
                            <TableCell>{data.account.getBalance()}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Website</Typography></TableCell>
                            <TableCell>
                                <a href={data.description.getWebsite()} target="_blank" rel="noopener noreferrer">
                                    {data.description.getWebsite()}
                                </a>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};