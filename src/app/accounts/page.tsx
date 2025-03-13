'use client';

import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {Card, CardContent} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import Skeleton from "react-loading-skeleton";
import {useRouter} from "next/navigation";


const fetcher = async () =>  {
    const accountsHash : string[] = await sdk.blockchain.blockchainQuery.getAccounts();
    const accounts = [];
    for (let i = 0; i < accountsHash.length; i++) {
        const accountHash = accountsHash[i];
        const accountData = await sdk.blockchain.blockchainQuery.getAccountState(accountHash);
        accounts.push(
            {
                ...accountData,
                hash: accountHash
            }
        );
    }
    return accounts;


}

export default function Accounts() {
    // set the node parameters
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);
    const router = useRouter();

    const {data, error} = useSWR(
        ['getAccounts'], fetcher
    );
    const renderRow = async (row : {hash: string, balance: number}) => {
        const vb = new sdk.blockchain.accountVb(row.hash);
        await vb.load()
        const pk = vb.getPublicKey();
        return [
            <td key={0} onClick={() => router.push(`/accounts/publicKey/${pk}`)}>{pk}</td>,
            <td key={1}>{row.balance}</td>
        ]
    }

    if (error) return <>An error occurred.</>
    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <DynamicTableComponent
                noWrapCell={true}
                header={["Public Key", "Balance"]}
                data={data}
                renderRow={renderRow}
                onRowClicked={console.log}
            />
        </CardContent>
    </Card>
}