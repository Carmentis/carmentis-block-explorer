'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Tooltip} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import Link from "next/link";

export default function Applications() {
    const router = useRouter();
    const provider = useBlockchain();

    const {value: data, loading, error} = useAsync(async () => {
        return await provider.getAllApplicationIds();
    })

    function goToOrganisation(organisationId: string) {
        router.push(`/organisations/${organisationId}`)
    }

    const header = ["Organization", "Name",  "Description","Website"]
    const renderRow = async (row : Hash) => {
        const application = await provider.loadApplicationVirtualBlockchain(row);

        const orgId = application.getOrganizationId();
        const organisation = await provider.loadOrganizationVirtualBlockchain(orgId);
        const orgDesc = await organisation.getDescription();
        return [
            <>

                <Link href={`/organisations/${orgId.encode()}`}>
                    <p>{orgId.encode()}</p>
                </Link>
            </>,
            <>{orgDesc.name}</>,

        ]

        /*
          <>

                <Tooltip title={application.getDescription() ?? 'No description provided.'}>
                    <p>{application.getDescription().slice(0, 30)}</p>
                </Tooltip>
            </>,
            <>{application.getWebsite()}</>,
         */
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
