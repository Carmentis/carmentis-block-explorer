'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import TableComponent, {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";
import {useAsync} from "react-use";




export default function ValidatorNodes() {


    const blockchain = useBlockchain();
    const { value: data, loading, error } = useAsync(async () => {
        const nodes = await blockchain.getAllValidatorNodes();
        return nodes;
    })

    const renderRow = async (hash:Hash) => {
        const validator = await blockchain.loadValidatorNode(hash);
        const organizationId = validator.getOrganizationId();
        const organization = await  blockchain.loadOrganization(organizationId);
        const accountHash = await blockchain.getAccountHashFromPublicKey(organization.getPublicKey());
        const rpcEndpoint = validator.getRpcEndpoint();
        return [
            <>{organization.getName()}</>,
            <>{rpcEndpoint}</>,
            <>{validator.getVotingPower()}</>,
            <>{validator.getCometPublicKey()}</>,
        ]
    }

    if (loading) return <Skeleton/>
    if (error || !data) return <>An error occurred: {error?.message}</>
    const header = ["Organization", 'Node Endpoint', "Voting power", "Public key"]
    return (
        <>
            <PageTitle title="Validator Nodes" />
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={() => {}}
            />
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
