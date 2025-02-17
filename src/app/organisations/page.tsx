'use client';

import {PageTitle} from "@/app/components/pagetitle";
import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent} from "@mui/material";
import TableComponent from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";

const fetcher = async () =>  {
    const organisationsHash : string[] = await sdk.blockchain.blockchainQuery.getOrganizations();
    const organisations = [];
    for (let i = 0; i < organisationsHash.length; i++) {
        const organisationHash = organisationsHash[i];
        console.log(i, organisationsHash[i])
        const organisationAccountData = await sdk.blockchain.blockchainQuery.getAccountState(organisationHash);
        organisations.push(
            {
                ...organisationAccountData,
                hash: organisationHash
            }
        );
    }
    return organisations;
}

export default function Accounts() {
    const accountExtractor = (data:{balance: number, hash: string}) => {
        return [
            { head: "Hash", value: <>{data.hash}</> },
            { head: "Balance", value: <>{data.balance}</> },
        ]
    }

    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainQuery.getChainStatus().then(console.log)

    const {data,error,isLoading} = useSWR(
        ['getOrganisations'], fetcher
    );

    console.log(data, error,isLoading)

    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <TableComponent
                data={data}
                extractor={accountExtractor}/>
        </CardContent>
    </Card>
    /*
    return (
        <>
            <PageTitle title={`Organisations Explorer`}/>
            <section className="section dashboard">
                <div className="row">
                    <div className="col-lg-0">
                        <div className="card">
                            <div className="card-body"><h5 className="card-title">Organizations</h5>
                                <table id="organizations" className="table"></table>
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