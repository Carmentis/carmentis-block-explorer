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
import {Hash, OrganizationDescription} from '@cmts-dev/carmentis-sdk/client';
import React from 'react';
import AvatarPlaceholder from 'boring-avatars';
import {useBlockchain, useExplorer} from "@/app/layout";

type OrganisationDetailProps = {
    data: OrganizationDescription;
};

// Fetcher function to be implemented by you
const fetcher = async (organisationHash: Hash) => {
   const blockchain = useBlockchain();
   const vb = await blockchain.loadOrganization(organisationHash);
   return await vb.getDescription();
};



export default function OrganisationPage() {
    const params = useParams<{hash: string}>();
    const {data, error, isLoading} = useSWR<OrganizationDescription>(
        ["getSingleOrganisation", params.hash],
        async ([, hash]: [string,string]) => fetcher(Hash.from(hash)));


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




const OrganisationDetail: React.FC<OrganisationDetailProps> = ({data}: {data: OrganizationDescription}) => {
    const router = useRouter();
    return (
        <Container component={Paper} sx={{p: 4}}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
                <AvatarPlaceholder
                    size={100}
                    name={data.name}
                    variant="marble"
                />
                <Typography variant="h5" mt={2}>
                    {data.name}
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Location</Typography></TableCell>
                            <TableCell>{`${data.city} (${data.countryCode})`}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Public Key</Typography></TableCell>
                            <TableCell>--</TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell><Typography variant="subtitle1">Website</Typography></TableCell>
                            <TableCell>
                                <a href={data.website} target="_blank" rel="noopener noreferrer">
                                    {data.website}
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