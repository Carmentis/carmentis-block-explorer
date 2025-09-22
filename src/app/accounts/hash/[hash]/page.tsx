'use client';

import {Hash, StringSignatureEncoder} from '@cmts-dev/carmentis-sdk/client';
import React, {useEffect} from "react";
import {useParams, useRouter} from "next/navigation";
import {PageTitle} from "@/app/components/pagetitle";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";
import Spinner from "@/app/components/loading-page.component";
import {useNavigate, useNavigation} from "react-router";


export default function AccountByAccountHash() {
    const blockchain = useBlockchain();
    const params = useParams<{ hash: string }>();
    const accountHash = params.hash;
    const {value: accountPublicKey, loading: isLoadingPublicKey, error} = useAsync(async () => {
        const accountPublicKey = await blockchain.getPublicKeyOfAccount(
            Hash.from(accountHash)
        );
        return accountPublicKey;
    });
    const router = useRouter();

    useEffect(() => {
        if (accountPublicKey !== undefined) {
            const encoder = StringSignatureEncoder.defaultStringSignatureEncoder();
            const uriEncodedPublicKey = encodeURI(encoder.encodePublicKey(accountPublicKey));
            router.push('/accounts/publicKey/' + uriEncodedPublicKey);
        }
    }, [accountPublicKey])

    if (isLoadingPublicKey) {
        return <Spinner />;
    }

    if (error) {
        return <>An error occurred: {error}</>
    }




    return <>
        You will be redirected to the account page...
    </>
}