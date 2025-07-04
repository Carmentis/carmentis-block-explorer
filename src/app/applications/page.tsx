'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Tooltip} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import { PageTitle } from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";

const fetcher = async ([]: [string]) =>  {
    const explorer = useExplorer();
    return await explorer.getApplications();
}

export default function Applications() {
    const router = useRouter();
    const network = useAtomValue(networkAtom)

    const {data, mutate} = useSWR(
        ['getApplications'], fetcher
    );

    function goToOrganisation(organisationId: string) {
        router.push(`/organisations/${organisationId}`)
    }

    const header = ["Name",  "Website", "Version", "Organisation"]
    const renderRow = async (row : Hash) => {
        const blockchain = useBlockchain();
        const application = await blockchain.loadApplication(row);
        const declaration = await application.getDeclaration();
        const description = await application.getDescription();
        return [
            <>
                <Tooltip title={description.description ?? 'No description provided.'}>
                <p>{description.name}</p>
                </Tooltip>
            </>,
            <>{description.homepageUrl}</>,
            <>--</>,
            <>

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
