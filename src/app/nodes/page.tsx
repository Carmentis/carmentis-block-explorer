'use client';

import {Hash, Logger} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import TableComponent, {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import {configure, getConsoleSink} from "@logtape/logtape";
import {useEffect} from "react";


export default function ValidatorNodes() {

    useEffect(() => {
        configure({
            sinks: { console: getConsoleSink() },
            loggers: [
                { category: "@cmts-dev/carmentis-sdk", lowestLevel: "fatal", sinks: ["console"] }
            ]
        })
    }, []);

    const provider = useBlockchain();
    const { value: data, loading, error } = useAsync(async () => {
        const nodes = await provider.getAllValidatorNodes();
        return nodes;
    })

    const renderRow = async (hash:Hash) => {
        console.log("Loading vb id")
        const validator = await provider.loadValidatorNodeVirtualBlockchain(hash);
        const validatorState = validator.getInternalState();
        console.log(validatorState)
        const org = await validator.getOrganizationVirtualBlockchain()
        const orgDesc = await org.getDescription()
        /*

        const organizationId = validator.getOrganizationId();
        const organization = await  provider.loadOrganization(organizationId);
        const accountHash = await provider.getAccountHashFromPublicKey(organization.getPublicKey());
        const rpcEndpoint = validator.getRpcEndpoint();

         */
        return [
            <>{orgDesc.name}</>,
            <>{}</>,
            <>{}</>,
            <>{}</>,
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
