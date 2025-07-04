'use client';

import {Hash} from "@cmts-dev/carmentis-sdk/client";
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


const fetcher = async () =>  {
    const explorer = useExplorer();
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
}

export default function OrganisationsPage() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    const blockchain = useBlockchain();

    const {data, mutate} = useSWR(
        ['getOrganisations'], fetcher
    );

    const header = ["Name", "Location", "Website", "Public Key", "Balance"]
    const renderRow = async (row : {hash: Hash, account: AccountState}) => {
        // load the organisation
        const organisation = await blockchain.loadOrganization(row.hash);
        const descripton = await organisation.getDescription();
        return [
            <>{descripton.name}</>,
            <>{descripton.city}</>,
            <>{descripton.countryCode}</>,
            <>--</>,
            <>{row.account.balance}</>
        ]
    }

    useEffect(() => {
        mutate()
    }, [network]);

    if (!data) return <Skeleton/>
    return (
        <>
            <PageTitle title="Organisations" />
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(row) => router.push(`/organisations/${row.hash}`)}
            />
        </>
    )
}
