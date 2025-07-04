'use client';

import {Hash, PublicSignatureKey, StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {DynamicTableComponent} from "@/components/table.component";
import Skeleton from "react-loading-skeleton";
import {useRouter} from "next/navigation";
import { PageTitle } from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";

interface AccountDescription {
    publicKey: PublicSignatureKey,
    balance: number,
    hash: string,
}

const fetcher = async () =>  {
    const explorer = useExplorer();
    const blockchain = useBlockchain();
    const accountsHash = await explorer.getAccounts();
    const accounts = [];
    for (let i = 0; i < accountsHash.length; i++) {
        const accountHash = accountsHash[i];
        const accountData = await explorer.getAccountState(accountHash);
        const account = await blockchain.loadAccount(accountHash);
        const accountPublicKey =  await account.getPublicKey();
        const accountDescription: AccountDescription = {
            publicKey: accountPublicKey,
            balance: accountData.balance,
            hash: accountHash.encode()
        }
        accounts.push(accountDescription);
    }
    return accounts;


}

export default function Accounts() {
    // set the node parameters
    const router = useRouter();
    const explorer = useExplorer();

    const {data, error} = useSWR(
        ['getAccounts'], fetcher
    );
    const renderRow = async (row : AccountDescription) => {
        const pk = row.publicKey;
        const sigEncoder = StringSignatureEncoder.defaultStringSignatureEncoder();
        const taggedPublicKey = sigEncoder.encodePublicKey(pk);
        return [
            <td key={0} onClick={() => router.push(`/accounts/publicKey/${taggedPublicKey}`)}>{pk.getPublicKeyAsString()}</td>,
            <td key={1}>{row.balance}</td>
        ]
    }

    if (error) return <>An error occurred.</>
    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Accounts" />
            <DynamicTableComponent
                header={["Public Key", "Balance"]}
                data={data}
                renderRow={renderRow}
                onRowClicked={console.log}
            />
        </>
    )
}
