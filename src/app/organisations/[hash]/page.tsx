'use client';

import {
    Box,
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
import {
    Hash,
    OrganisationWrapper,
    OrganizationDescription,
    StringSignatureEncoder
} from '@cmts-dev/carmentis-sdk/client';
import React from 'react';
import AvatarPlaceholder from 'boring-avatars';
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";



export default function OrganisationPage() {
    const params = useParams<{hash: string}>();
    const organisationId = Hash.from(params.hash);
    const blockchain = useBlockchain();
    const {value: data, loading: isLoading, error} = useAsync(async () => {
        return blockchain.loadOrganization(organisationId);
    });


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
        organisation={data}
    />;
}




const OrganisationDetail = ({organisation}: {organisation: OrganisationWrapper}) => {
    const router = useRouter();
    const sigEncoder = StringSignatureEncoder.defaultStringSignatureEncoder();
    return (
        <Container component={Paper} sx={{p: 4}}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <AvatarPlaceholder
                    size={100}
                    name={organisation.getName()}
                    variant="marble"
                />
                <Typography variant="h5" mt={2}>
                    {organisation.getName()}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Location</Typography></TableCell>
                            <TableCell>{`${organisation.getCity()} (${organisation.getCountryCode()})`}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Public Key</Typography></TableCell>
                            <TableCell>
                                {sigEncoder.encodePublicKey(organisation.getPublicKey())}
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Website</Typography></TableCell>
                            <TableCell>
                                <a href={organisation.getWebsite()} target="_blank" rel="noopener noreferrer">
                                    {organisation.getWebsite()}
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