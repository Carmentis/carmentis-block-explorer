'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Tooltip} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {BlockchainQuery, BlockchainQueryFabric} from "@cmts-dev/carmentis-sdk/client";
import { PageTitle } from "@/app/components/pagetitle";

const fetcher = async ([,client]: [string, BlockchainQuery]) =>  {
    const applications : string[] = await client.getApplicationsHash();
    return applications;
}

export default function Applications() {
    const router = useRouter();
    const network = useAtomValue(networkAtom)
    const client = BlockchainQueryFabric.build(network);

    const {data, mutate} = useSWR(
        ['getApplications', client], fetcher
    );

    function goToOrganisation(organisationId: string) {
        router.push(`/organisations/${organisationId}`)
    }

    const header = ["Name",  "Website", "Version", "Organisation"]
    const renderRow = async (row : string) => {
        const vb = new sdk.blockchain.applicationVb(row);
        await vb.load()
        const latestVersion = vb.getLatestVersionNumber();
        const organisationVb = await vb.getOrganizationVb();
        const desc = await vb.getDescriptionObject();
        const orgDesc = await organisationVb.getDescriptionObject();
        return [
            <>
                <Tooltip title={desc.getDescription() ?? 'No description provided.'}>
                <p>{desc.getName()}</p>
                </Tooltip>
            </>,
            <>{desc.getHomepageUrl()}</>,
            <>{latestVersion}</>,
            <>
                <div onClick={(e) => {
                    e.stopPropagation();
                    goToOrganisation(organisationVb.id)
                }}>{orgDesc.getName()}</div>
            </>
        ]
    }

    useEffect(() => {
        mutate();
    });

    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Applications" />
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(hash) => router.push(`/applications/${hash}`)}
            />
        </>
    )

}
