'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Tooltip} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";

const fetcher = async () =>  {
    const applications : string[] = await sdk.blockchain.blockchainQuery.getApplications();

    return applications;
}

export default function Applications() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainCore.setNode(network);
    sdk.blockchain.blockchainQuery.setNode(network);

    const {data, mutate} = useSWR(
        ['getApplications'], fetcher
    );

    const header = ["Name",  "Website", "Version", "Organisation"]
    const renderRow = async (row : string, index: number) => {
        const vb = new sdk.blockchain.applicationVb(row);
        await vb.load()
        const lastVersion = vb.getHeight();
        const organisationVb = await vb.getOrganizationVb();
        const desc = await vb.getDescription(lastVersion-1)
        const orgDesc = await organisationVb.getDescription();
        return [
            <Tooltip title={desc.description ?? 'No description provided.'}>
                <p>{desc.name}</p>
            </Tooltip>,
            <>{desc.homepageUrl}</>,
            <>{lastVersion}</>,
            <Link href={`/organisations/${organisationVb.id}`}>{orgDesc.name}</Link>
        ]
    }

    useEffect(() => {
        mutate();
    }, [network]);

    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(hash) => router.push(`/applications/${hash}`)}
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