'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import {BlockchainQuery, BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Typography} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

const fetcher = async (input: [string, BlockchainQuery]) =>  {
    const client = input[1];
    const oracles : string[] = await client.getOraclesHash();
    return oracles;
}

export default function Oracles() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);

    const {data, mutate} = useSWR(
        ['getOracles', client], fetcher
    );

    const renderRow = async (row : string) => {
        const vb = new sdk.blockchain.oracleVb(row);
        await vb.load()
        const height = vb.getHeight();
        const desc = await vb.getDescriptionObject();
        const organisationVb = await vb.getOrganizationVb();
        const orgDesc = await organisationVb.getDescriptionObject();
        return [
            <Typography key={0}>{desc.getName()}</Typography>,
            <Typography key={1}>{row}</Typography>,
            <Typography key={2}>{height-1}</Typography>,
            <Typography key={3}>{orgDesc.getName()}</Typography>
        ]
    }

    useEffect(() => {
        mutate();
    }, [network]);

    if (!data) return <Skeleton/>
    const header = ["Oracle", "Hash", "Version", "Organisation"];
    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(hash) => router.push(`/oracles/${hash}`)}
            />
        </CardContent>
    </Card>

    /*
    const accountExtractor = (data:string) => {
        return [
            { head: "Hash", value: <>{data}</> },
        ]
    }

    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);

    const {data,error,isLoading} = useSWR(
        ['getApplications'], fetcher
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

     */
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