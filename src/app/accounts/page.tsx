'use client';

import {CMTSToken, Hash, PublicSignatureKey, StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";
import {DynamicTableComponent} from "@/components/table.component";
import Skeleton from "react-loading-skeleton";
import {useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {Tooltip} from "@mui/material";




export default function Accounts() {
    // set the node parameters
    const router = useRouter();
    const blockchain = useBlockchain();

    const {value: data, loading, error} = useAsync(async () => {

        /*
        const accountsHash = await blockchain.getAllAccounts();
        const accounts = [];
        for (let i = 0; i < accountsHash.length; i++) {
            const accountHash = accountsHash[i];
            const accountData = await blockchain.getAccountState(accountHash);
            const account = await blockchain.loadAccount(accountHash);
            const accountPublicKey =  account.getPublicKey();
            const accountDescription: AccountDescription = {
                publicKey: accountPublicKey,
                balance: accountData.getBalance(),
                [hash]: accountHash.encode()
            }
            accounts.push(accountDescription);
        }

         */
        return blockchain.getAllAccounts();
    })


    const sigEncoder = StringSignatureEncoder.defaultStringSignatureEncoder();
    const renderRow = async (accountHash : Hash) => {
        const [publicKey, balance] = await Promise.all([
            blockchain.getPublicKeyOfAccount(accountHash),
            blockchain.getAccountBalance(accountHash)
        ]);
        const pk = sigEncoder.encodePublicKey(publicKey);
        const encodedAccountHash = accountHash.encode();
        return [
            <td key={0} onClick={() => router.push(`/accounts/publicKey/${pk}`)}>
               <Tooltip title={pk}>
                   <>{pk.slice(0, 20)}...{pk.slice(-20)}</>
               </Tooltip>
            </td>,
            <td key={1} onClick={() => router.push(`/accounts/hash/${encodedAccountHash}`)}>
                {encodedAccountHash}
            </td>,
            <td key={2}>{balance.toString()}</td>
        ]
    }

    if (error) return <>An error occurred: {error.message}..</>
    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Accounts" />
            <DynamicTableComponent
                header={["Public Key", "Account [hash]", "Balance"]}
                data={data}
                renderRow={renderRow}
                onRowClicked={console.log}
            />
        </>
    )
}
