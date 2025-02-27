'use client';

import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {Card, CardContent} from "@mui/material";
import TableComponent, {DynamicTableComponent} from "@/components/table.component";
import Skeleton from "react-loading-skeleton";



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
    const network = useAtomValue(networkAtom);
    console.log(`setNode: ${network}`)
    sdk.blockchain.blockchainCore.setNode(network);
    sdk.blockchain.blockchainQuery.setNode(network);

    const {data} = useSWR(
        ['getAccounts'], fetcher
    );
    const renderRow = async (row : {hash: string, balance: number}, index: number) => {
        const vb = new sdk.blockchain.accountVb(row.hash);
        await vb.load()
        console.log(vb)
        return [
            <>{vb.getPublicKey()}</>,
            <>{row.balance}</>
        ]
    }

    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={["Public Key", "Balance"]}
                data={data}
                renderRow={renderRow}
                onRowClicked={console.log}
            />
        </CardContent>
    </Card>
}