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
import {useAsync} from "react-use";

export default function Applications() {
    const router = useRouter();
    const blockchain = useBlockchain();
    const explorer = useExplorer();

    const {value: data, loading, error} = useAsync(async () => {
        return await explorer.getApplications();
    })

    function goToOrganisation(organisationId: string) {
        router.push(`/organisations/${organisationId}`)
    }

    const header = ["Name",  "Website", "Organisation"]
    const renderRow = async (row : Hash) => {
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
            <></>
        ]
    }

    if (loading) return <Skeleton/>
    if (!data || error) return <>An error occurred: {error?.message}</>
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
