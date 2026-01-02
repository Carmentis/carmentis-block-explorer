'use client';

import {
    Box, Button, ButtonGroup,
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
    CryptoEncoderFactory, OrganizationVb
} from '@cmts-dev/carmentis-sdk/client';
import React from 'react';
import AvatarPlaceholder from 'boring-avatars';
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import Link from "next/link";



export default function OrganisationPage() {
    const params = useParams<{hash: string}>();
    const organisationId = Hash.from(params.hash);
    const provider = useBlockchain();
    const {value: data, loading: isLoading, error} = useAsync(async () => {
        return provider.loadOrganizationVirtualBlockchain(organisationId);
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

const OrganisationDetail = ({organisation}: {organisation: OrganizationVb}) => {
    const router = useRouter();
    const provider = useBlockchain();
    const {value: orgDesc, loading: isLoadingDesc, error: descLoadingError} = useAsync(async () => {
        return await organisation.getDescription();
    });

    const {value: orgAccountId, loading: isLoadingAccountId} = useAsync(async () => {
        return organisation.getAccountId().encode();
    });

    const sigEncoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
    const {value: orgPk, loading: isLoadingPk, error: pkLoadingError} = useAsync(async () => {
        const accountId = await organisation.getAccountId();
        const accountVb = await provider.loadAccountVirtualBlockchain(accountId);
        return sigEncoder.encodePublicKey(await accountVb.getPublicKey());
    });

    if (isLoadingDesc) {
        return <>Loading...</>
    }
    if (descLoadingError || !orgDesc) {
        return <>An error occurred: {descLoadingError?.message || 'Unknown error'}</>
    }

    return (
        <Container component={Paper} sx={{p: 4}}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <AvatarPlaceholder
                    size={100}
                    name={orgDesc.name}
                    variant="marble"
                />
                <Typography variant="h5" mt={2}>
                    {orgDesc.name}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Location</Typography></TableCell>
                            <TableCell>{`${orgDesc.city} (${orgDesc.countryCode})`}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Public Key</Typography></TableCell>
                            <TableCell>
                                {orgPk}
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Account ID</Typography></TableCell>
                            <TableCell>
                                <a href={`/accounts/hash/${orgAccountId}`} target="_blank" rel="noopener noreferrer">
                                    {orgAccountId}
                                </a>

                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Website</Typography></TableCell>
                            <TableCell>
                                <a href={orgDesc.website} target="_blank" rel="noopener noreferrer">
                                    {orgDesc.website}
                                </a>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <ButtonGroup>
                <Link href={`/explorer/virtualBlockchain/${organisation.getIdentifier().encode()}`}>
                    <Button>Visit Virtual blockchain</Button>
                </Link>
            </ButtonGroup>
        </Container>
    );
};