'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Tooltip, Typography} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const fetcher = async () =>  {
    const oracles : string[] = await sdk.blockchain.blockchainQuery.getOracles();

    return oracles;
}

export default function Oracles() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainCore.setNode(network);
    sdk.blockchain.blockchainQuery.setNode(network);

    const {data, mutate} = useSWR(
        ['getOracles'], fetcher
    );

    const renderRow = async (row : string, index: number) => {
        const vb = new sdk.blockchain.oracleVb(row);
        await vb.load()
        const height = vb.getHeight();
        const desc = await vb.getDescription();
        const organisationVb = await vb.getOrganizationVb();
        const orgDesc = await organisationVb.getDescription();
        return [
            <Typography>{desc.name}</Typography>,
            <Typography>{row}</Typography>,
            <Typography>{height-1}</Typography>,
            <Typography>{orgDesc.name}</Typography>
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