'use client';

import {useAtomValue} from "jotai/index";
import {AccountState, BlockchainQuery, BlockchainQueryFabric, TokenTransaction} from '@cmts-dev/carmentis-sdk/client';
import Skeleton from "react-loading-skeleton";
import React from "react";
import BoringAvatar from "boring-avatars";
import {
    Box,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {networkAtom} from "@/atoms/network.atom";
import {useParams} from "next/navigation";
import useSWR, {SWRResponse} from "swr";

import {ErrorDisplay} from "@/app/components/error-display";

async function fetchAccountState(input: [string, BlockchainQuery, string]) {
    const client = input[1]
    return await client.fetchAccountStateByPublicKey(input[2]);
}

async function fetchAccountTransactionsHistory(input: [string, BlockchainQuery, string]) {
    const client = input[1]
    return await client.fetchAccountTransactionsByPublicKey(input[2], 50);
}

export default function AccountByPublicKey() {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);
    const params = useParams<{ publicKey: string }>();
    const publicKey = params.publicKey;
    console.assert(typeof publicKey === 'string');


    const accountStateResponse = useSWR(['getAccountState', client,publicKey ], fetchAccountState)
    const transactionsResponse = useSWR(['getAccountTransactions', client, publicKey], fetchAccountTransactionsHistory)


    if (accountStateResponse.error || transactionsResponse.error) {
        return <AccountNotFound publicKey={publicKey}/>
    }
    return <>
        <Container
           sx={{
               display:"flex",
               flexDirection:"column",
               alignItems:"center",
               justifyContent:"center",
               padding: 4
           }}
           component={Paper}
        >
            <AccountStateComponent response={accountStateResponse} publicKey={publicKey} />
            <AccountTransactionsHistory response={transactionsResponse} />
        </Container>
    </>
}


function AccountNotFound({publicKey}: { publicKey: string }) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                padding: 4,
                background: "white",
                borderRadius: 3,
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
            >
                Account Not Found
            </Typography>
            <Typography
                variant="body1"
                sx={{color: "text.secondary", marginTop: 2, maxWidth: 600}}
            >
                We cannot find the account associated with the public key

                <Typography component="p" variant="body1" color="primary" fontWeight="bold">
                    {publicKey}
                </Typography>. Please verify the key and try again.
            </Typography>

        </Box>
    );
}


function AccountStateComponent({publicKey, response}: { publicKey:string, response:  SWRResponse<AccountState> }) {
    if (response.isLoading) return <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"}>
        <Skeleton circle={true}/>
        <Skeleton/>
    </Box>

    if (!response.data || response.error) return <ErrorDisplay error={response.error} />

    return <>
        <Box py={8} display={"flex"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
            <BoringAvatar size={100} name={publicKey} variant="beam"/>
            <Typography variant="body1" marginTop={2}>
                {publicKey}
            </Typography>
        </Box>

        <Box width={"100%"}>
            <Typography variant={"h6"}>Account state</Typography>
            <TableContainer component={Paper} sx={{marginTop: 2}}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Balance</TableCell>
                            <TableCell>{response.data.getBalance()} CMTS</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>

    </>
}


function AccountTransactionsHistory({response}: { response: SWRResponse<TokenTransaction[]> }) {
    if (response.isLoading) return <Skeleton count={10}/>

    if (!response.data || response.error) return <ErrorDisplay error={response.error} />
    const transactions = response.data;
    return  <Box mt={4} width={"100%"}>
        <Typography variant={"h6"}>Transactions</Typography>
        <TableContainer component={Paper} sx={{marginTop: 2, width: "100%"}}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Type</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction, i) => (
                        <TableRow key={i}>
                            <TableCell>{i}</TableCell>
                            <TableCell>{transaction.getDate().toLocaleString()}</TableCell>
                            <TableCell>{transaction.getAmount()}</TableCell>
                            <TableCell>{transaction.getLabel()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>
}



