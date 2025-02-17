'use client';

import {PageTitle} from "@/app/components/pagetitle";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import {Card, CardContent} from "@mui/material";
import TableComponent from "@/components/table.component";
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
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainQuery.getChainStatus().then(console.log)

    const {data,error,isLoading} = useSWR(
        ['getAccounts'], fetcher
    );

    console.log(data, error,isLoading)

    const accountExtractor = (data:{balance: number, hash: string, height: number}) => {
        return [
            { head: "Hash", value: <>{data.hash}</> },
            { head: "Balance", value: <>{data.balance}</> },
            { head: "# Transactions", value: <>{data.height}</> }
        ]
    }

    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <TableComponent
                data={data}
                extractor={accountExtractor}/>
        </CardContent>
    </Card>
    /*
    sdk.blockchain.blockchainQuery.getAccounts()
        .then(accounts => {
            accounts.map(accountHash => {
                sdk.blockchain.blockchainQuery.getAccountState(accountHash).then(console.log)
            })
        })



    return (
        <>
            <PageTitle title={`Applications Explorer`}/>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-0">
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Top Accounts</h5>
                                <table id="accounts" className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">ID</th>
                                        <th scope="col" className="text-center">Attached object</th>
                                        <th scope="col" className="text-center">Object ID</th>
                                        <th scope="col" className="text-end">Balance (CMTS)</th>
                                        <th scope="col" className="text-center">Fees TX</th>
                                        <th scope="col" className="text-center">Other TX</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-center">-</td>
                                        <td className="text-center">-</td>
                                        <td className="text-end">999 000 000.00</td>
                                        <td className="text-center">0</td>
                                        <td className="text-center">1</td>
                                    </tr>
                                    <tr>
                                        <td><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-center">node</td>
                                        <td className="text-center"><a
                                            href="explorer/microchain/0x0000000000000000000000000000000000000000000000000000000000000000"
                                            className="mono">0x00000000 ⋯ 00</a></td>
                                        <td className="text-end">1 000 000.00</td>
                                        <td className="text-center">0</td>
                                        <td className="text-center">1</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <nav id="pagination"></nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );

     */
}