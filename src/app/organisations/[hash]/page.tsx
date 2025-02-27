'use client';

import React from 'react';
import {Container, Typography, Link, CircularProgress, Box} from '@mui/material';
import useSWR from 'swr';
import {useParams} from "next/navigation";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";

// Fetcher function to be implemented by you
const fetcher = async (organisationHash: string) => {
   const vb = new sdk.blockchain.organizationVb(organisationHash);
   await vb.load();
   const description = await vb.getDescription();
   const account = await sdk.blockchain.blockchainQuery.getAccountState(organisationHash);
   return {
       description: {
           name: description.name,
           location: `${description.city} (${description.countryCode})`,
           website: description.website
       },
       account: {
           publicKey: vb.getPublicKey(),
           balance: account.balance
       },
       vb
   }
};

type OrganisationData = {
    vb: sdk.blockchain.organizationVb,
    description: {
        name: string,
        location: string,
        website: string
    },
    account: {
        publicKey: string,
        balance: number
    },
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

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    Failed to load organisation details. Please try again later.
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Organisation Details
            </Typography>
            {data ? (
                <>
                    <Typography variant="h6">Name: {data.description.name}</Typography>
                    <Typography variant="h6">Location: {data.description.location}</Typography>
                    <Typography variant="h6">Public key: {data.account.publicKey}</Typography>
                    <Typography variant="h6">balance: {data.account.balance}</Typography>
                    <Typography variant="h6">
                        Website:{' '}
                        <Link href={data.description.website} target="_blank" rel="noopener noreferrer">
                            {data.description.website}
                        </Link>
                    </Typography>
                </>
            ) : (
                <Typography variant="body1">No organisation data available.</Typography>
            )}
        </Container>
    );
}