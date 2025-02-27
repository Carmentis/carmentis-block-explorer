'use client';

import * as sdk from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent} from "@mui/material";
import TableComponent, {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import useSWR from "swr";
import {useEffect} from "react";
import {useRouter} from "next/navigation";

const fetcher = async () =>  {
    const organisationsHash : string[] = await sdk.blockchain.blockchainQuery.getOrganizations();
    const organisations = [];
    for (let i = 0; i < organisationsHash.length; i++) {
        const organisationHash = organisationsHash[i];
        console.log(i, organisationsHash[i])
        const organisationAccountData = await sdk.blockchain.blockchainQuery.getAccountState(organisationHash);
        organisations.push(
            {
                ...organisationAccountData,
                hash: organisationHash
            }
        );
    }
    return organisations;
}

export default function OrganisationsPage() {
    const router = useRouter();
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainCore.setNode(network);
    sdk.blockchain.blockchainQuery.setNode(network);

    const {data, mutate} = useSWR(
        ['getOrganisations'], fetcher
    );

    const header = ["Name", "Location", "Website", "Public Key", "Balance"]
    const renderRow = async (row : {hash: string, balance: number}, index: number) => {
        // load the organisation
        const vb = new sdk.blockchain.organizationVb(row.hash);
        await vb.load()
        const publicKey = vb.getPublicKey();
        const desc = await vb.getDescription();
        return [
            <>{desc.name}</>,
            <>{`${desc.city} (${desc.countryCode})`}</>,
            <>{desc.website}</>,
            <>{publicKey}</>,
            <>{row.balance}</>
        ]
    }

    useEffect(() => {
        mutate()
    }, [network]);

    if (!data) return <Skeleton/>
    return <Card>
        <CardContent>
            <DynamicTableComponent
                header={header}
                data={data}
                renderRow={renderRow}
                onRowClicked={(row) => router.push(`/organisations/${row.hash}`)}
            />
        </CardContent>
    </Card>
}