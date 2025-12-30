'use client';

import {CMTSToken, CryptoEncoderFactory, Hash, PublicSignatureKey, Utils} from "@cmts-dev/carmentis-sdk/client";
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

        const accountsHash = await blockchain.getAllAccounts();
        return accountsHash
    })


    const sigEncoder = CryptoEncoderFactory.defaultStringSignatureEncoder();
    const renderRow = async (accountHash : Hash) => {
        /*
        const [publicKey, balance] = await Promise.all([
            blockchain.getPublicKeyOfAccount(accountHash),
            blockchain.getAccountBalance(accountHash)
        ]);
         */
        //const pk = sigEncoder.encodePublicKey(publicKey);
        //const encodedAccountHash = accountHash.encode();
        const sigEncoder = await CryptoEncoderFactory.defaultStringSignatureEncoder();
        const account = await blockchain.getAccountState(accountHash.toBytes());
        const accountVb =  await blockchain.loadAccountVirtualBlockchain(accountHash);
        const pk = await sigEncoder.encodePublicKey(await accountVb.getPublicKey());
        const encodedAccountHash = Utils.binaryToHexa(accountHash.toBytes())
        console.log(account)
        const balance = CMTSToken.createAtomic(account.balance);
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
