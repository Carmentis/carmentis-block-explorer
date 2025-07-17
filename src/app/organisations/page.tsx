'use client';

import {AccountState, CMTSToken, Hash, StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";
import Skeleton from "react-loading-skeleton";
import {DynamicTableComponent} from "@/components/table.component";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import {useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain, useExplorer} from "@/app/layout";
import {useAsync} from "react-use";
import {Tooltip} from "@mui/material";


export default function OrganisationsPage() {
    const router = useRouter();
    const blockchain = useBlockchain();

    const {value: data, loading, error} = useAsync(async () => {
        return await blockchain.getAllOrganisations();
    })

    const header = ["Name",  "Hash", "Location", "Website", "Public Key", "Balance"]
    const renderRow = async (organisationId : Hash) => {
        const organisation = await blockchain.loadOrganization(organisationId);
        const publicKey = organisation.getPublicKey();
        const sigEncoder = StringSignatureEncoder.defaultStringSignatureEncoder();
        const pk = sigEncoder.encodePublicKey(publicKey);
        const accountHash = await blockchain.getAccountHashFromPublicKey(publicKey);
        const balance = await blockchain.getAccountBalance(accountHash);
        return [
            <>{organisation.getName()}</>,
            <>{organisationId.encode()}</>,
            <>{`${organisation.getCity()} (${organisation.getCountryCode()})`}</>,
            <>{organisation.getWebsite()}</>,
            <>
                <Tooltip title={pk}>
                    <>{pk.slice(0, 20)}...{pk.slice(-20)}</>
                </Tooltip>,
            </>,
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
                onRowClicked={(row) => router.push(`/organisations/${row.encode()}`)}
            />
        </>
    )
}
