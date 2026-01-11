'use client';

import {AccountState, CMTSToken, Hash} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain, } from "@/app/layout";
import {useAsync} from "react-use";
import {Tooltip} from "@mui/material";
import OrganizationLinkCell from "@/components/tableCells/OrganizationLinkCell";


export default function OrganisationsPage() {
    const router = useRouter();
    const provider = useBlockchain();

    const {value: data, loading, error} = useAsync(async () => {
        return await provider.getAllOrganizationIds();
    })

    const header = ["Name",  "Hash", "Location", "Website", "Public Key", "Balance"]
    const renderRow = async (organisationId : Hash) => {
        const orgVb = await provider.loadOrganizationVirtualBlockchain(organisationId);
        const orgDesc = await orgVb.getDescription();
        return [
            <OrganizationLinkCell orgId={organisationId} orgName={orgDesc.name}/>,
            <>{organisationId.encode()}</>,
            <>{orgDesc.city} ({orgDesc.countryCode})</>,
            <>{orgDesc.website}</>,
        ]
    }


    if (loading) return <Skeleton/>
    if (!data || error) return <>An error occurred: {error?.message}</>
    return (
        <>
            <PageTitle title="Organisations" />
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(row) => router.push(`/organisations/${row.encode()}`)}
            />
        </>
    )
}
