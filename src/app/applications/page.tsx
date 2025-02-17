'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent} from "@mui/material";
import TableComponent from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";

const fetcher = async () =>  {
    const applications : string[] = await sdk.blockchain.blockchainQuery.getApplications();

    return applications;
}

export default function Applications() {
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