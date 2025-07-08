'use client';

import {CMTSToken, Hash} from "@cmts-dev/carmentis-sdk/client";
import {AccountState} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent} from "@mui/material";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import { PageTitle } from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";
import {useAsync} from "react-use";


export default function OrganisationsPage() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    const blockchain = useBlockchain();
    const explorer = useExplorer();

    const {value: data, loading, error} = useAsync(async () => {
        const organisationsHash : Hash[] = await explorer.getOrganizations();
        const organisations = [];
        for (let i = 0; i < organisationsHash.length; i++) {
            const organisationHash = organisationsHash[i];
            const organisationAccountData = await explorer.getAccountState(organisationHash);
            organisations.push(
                {
                    account: organisationAccountData,
                    hash: organisationHash
                }
            );
        }
        return organisations;
    })

    const header = ["Name",  "Hash", "Location", "Website", "Public Key", "Balance"]
    const renderRow = async (row : {hash: Hash, account: AccountState}) => {
        // load the organisation
        const balance = CMTSToken.createCMTS(0);
        const organisation = await blockchain.loadOrganization(row.hash);
        const descripton = await organisation.getDescription();
        return [
            <>{descripton.name}</>,
            <>{row.hash.encode()}</>,
            <>{descripton.city}</>,
            <>{descripton.countryCode}</>,
            <>--</>,
            <>{balance.toString()}</>
        ]
    }


    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Organisations" />
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(row) => router.push(`/organisations/${row.hash.encode()}`)}
            />
        </>
    )
}
