'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import TableComponent from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";
import {useAsync} from "react-use";




export default function ValidatorNodes() {
    const accountExtractor = (data:Hash) => {

        return [
            { head: "Hash", value: <>{data.encode()}</> },
        ]
    }

    const blockchain = useBlockchain();
    const { value: data, loading, error } = useAsync(async () => {
        const nodes = blockchain.getAllValidatorNodes();
        return nodes;
    })

    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Validator Nodes" />
            <TableComponent
                data={data}
                extractor={accountExtractor}/>
        </>
    )
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
