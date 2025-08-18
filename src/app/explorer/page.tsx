'use client'

import {Card, TextField, Typography} from "@mui/material";
import {useState} from "react";
import SearchBar from "@/app/explorer/components/searchBar/SearchBar";
import {useAsync, useAsyncFn} from "react-use";
import useBlockSearchStrategy from "@/app/explorer/searchStrategies/useBlockSearchStrategy";
import Skeleton from "react-loading-skeleton";
import {ErrorDisplay} from "@/app/components/error-display";
import {BlockInformationWrapper} from "@cmts-dev/carmentis-sdk/client";
import {useSearchParams} from "next/navigation";
import useVirtualBlockchainSearchStrategy from "@/app/explorer/searchStrategies/useVirtualBlockchainSearchStrategy";
import useMicroBlockSearchStrategy from "@/app/explorer/searchStrategies/useMicroBlockSearchStrategy";
import useAccountSearchStrategy from "@/app/explorer/searchStrategies/useAccountSearchStrategy";


export default function explorer() {
    const query = extractQueryFromParams();
    const [search, setSearch] = useState(query);



    // handle display
    const header = <>
        <Typography variant={"h5"}>Explore the chain</Typography>
        <SearchBar search={search} updateSearch={setSearch}/>
    </>
    const body = <>
        {handleBlockResultDisplay(search)}
        {handleVirtualBlockchainSearchResultDisplay(search)}
        {handleMicroBlockSearchResultDisplay(search)}
        {handleAccountSearchDisplay(search)}
    </>

    return <>
        {header}
        {body}
    </>
}

function extractQueryFromParams(): string {
    const params = useSearchParams();
    return params.get("search") || "";
}


function handleVirtualBlockchainSearchResultDisplay(search: string) {
    const {value, loading, error} = useVirtualBlockchainSearchStrategy(search);
    if (loading) return <Skeleton/>
    if (error) return <ErrorDisplay error={error}/>
    const foundVb = value;
    let content;
    if (foundVb === undefined) {
        content = <Typography>No virtual blockchain found</Typography>
    }
    else {
        content = <>
            <Typography variant={"h6"}>Virtual blockchain {foundVb.getVbId().encode()}</Typography>
        </>
    }
    return <Card>
        {content}
    </Card>
}

function handleMicroBlockSearchResultDisplay(search: string) {
    const {value, loading, error} = useMicroBlockSearchStrategy(search);
    if (loading) return <Skeleton/>
    if (error) return <ErrorDisplay error={error}/>
    const foundMb = value;
    let content;
    if (foundMb === undefined) {
        content = <Typography>No micro-block found</Typography>
    }
    else {
        content = <>
            <Typography variant={"h6"}>Virtual blockchain {search}</Typography>
        </>
    }
    return <Card>
        {content}
    </Card>
}


function handleBlockResultDisplay(search: string) {
    const {value, loading, error} = useBlockSearchStrategy(search);
    if (loading) return <Skeleton/>
    if (error) return <ErrorDisplay error={error}/>
    const foundBlocks = value;
    let content;
    if (!foundBlocks || foundBlocks.length === 0) content = <Typography>No blocks found</Typography>
    else if (foundBlocks.length !== 1) content = <Typography>Multiple blocks found</Typography>
    else {
        const foundBlock = foundBlocks[0];
        content = <>
            <Typography variant={"h6"}>Block {foundBlock.getBlockHeight()}</Typography>

        </>
    }
    return <Card>
        {content}
    </Card>
}

function handleAccountSearchDisplay(search: string) {
    const {value, loading, error} = useAccountSearchStrategy(search);
    if (loading) return <Skeleton/>
    if (error) return <ErrorDisplay error={error}/>
    const foundAccount = value;
    return <Card>

    </Card>
}

