'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Tooltip} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";
import {useAsync} from "react-use";

export default function Applications() {
    const router = useRouter();
    const blockchain = useBlockchain();

    const {value: data, loading, error} = useAsync(async () => {
        return await blockchain.getAllApplications();
    })

    function goToOrganisation(organisationId: string) {
        router.push(`/organisations/${organisationId}`)
    }

    const header = ["Application ID", "Name",  "Website", "Organisation"]
    const renderRow = async (row : Hash) => {
        const application = await blockchain.loadApplication(row);
        const orgId = application.getOrganizationId();
        const organisation = await blockchain.loadOrganization(orgId);
        return [
            <>{row.encode()}</>,
            <>

                <Tooltip title={application.getDescription() ?? 'No description provided.'}>
                <p>{application.getName()}</p>
                </Tooltip>
            </>,
            <>{application.getWebsite()}</>,
            <>{organisation.getName()}</>
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
                onRowClicked={(hash) => router.push(`/applications/${hash.encode()}`)}
            />
        </>
    )

}
