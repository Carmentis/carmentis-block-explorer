'use client'

import {Box, Card, CardContent, CardHeader, Divider, Grid, Stack, Typography, Avatar, Button} from "@mui/material";
import {useState, ReactNode} from "react";
import Link from "next/link";
import SearchBar from "@/app/explorer/components/searchBar/SearchBar";
import useBlockSearchStrategy from "@/app/explorer/searchStrategies/useBlockSearchStrategy";
import Skeleton from "react-loading-skeleton";
import {ErrorDisplay} from "@/app/components/error-display";
import {useSearchParams} from "next/navigation";
import useVirtualBlockchainSearchStrategy from "@/app/explorer/searchStrategies/useVirtualBlockchainSearchStrategy";
import useMicroBlockSearchStrategy from "@/app/explorer/searchStrategies/useMicroBlockSearchStrategy";
import useAccountSearchStrategy from "@/app/explorer/searchStrategies/useAccountSearchStrategy";
import LayersIcon from "@mui/icons-material/Layers";
import GridViewIcon from "@mui/icons-material/GridView";
import HubIcon from "@mui/icons-material/Hub";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { routes } from "@/app/routes";
import {StringSignatureEncoder} from "@cmts-dev/carmentis-sdk/client";

// A lightweight, minimalist card wrapper to unify loading/error/empty states
function ResultCard({
    title,
    icon,
    loading,
    error,
    empty,
    emptyLabel,
    children,
}: {
    title: string;
    icon: ReactNode;
    loading: boolean;
    error?: unknown;
    empty?: boolean;
    emptyLabel?: string;
    children?: ReactNode;
}) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <CardHeader
                avatar={<Avatar variant="rounded" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{icon}</Avatar>}
                title={<Typography variant="subtitle1" fontWeight={700}>{title}</Typography>}
            />
            <Divider />
            <CardContent>
                {loading ? (
                    <>
                        <Skeleton height={12} style={{ marginBottom: 8 }} />
                        <Skeleton height={12} style={{ marginBottom: 8 }} />
                        <Skeleton height={12} width={'60%'} />
                    </>
                ) : error ? (
                    <ErrorDisplay error={error} />
                ) : empty ? (
                    <Typography color="text.secondary">{emptyLabel || 'No results found'}</Typography>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    );
}

export default function explorer() {
    const query = extractQueryFromParams();
    const [search, setSearch] = useState(query);

    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant={'h4'} fontWeight={800}>Explore the chain</Typography>
                <SearchBar search={search} updateSearch={setSearch} />
            </Stack>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>{handleBlockResultDisplay(search)}</Grid>
                <Grid item xs={12} md={6}>{handleVirtualBlockchainSearchResultDisplay(search)}</Grid>
                <Grid item xs={12} md={6}>{handleMicroBlockSearchResultDisplay(search)}</Grid>
                <Grid item xs={12} md={6}>{handleAccountSearchDisplay(search)}</Grid>
            </Grid>
        </Box>
    );
}

function extractQueryFromParams(): string {
    const params = useSearchParams();
    return params.get("search") || "";
}

function handleVirtualBlockchainSearchResultDisplay(search: string) {
    const { value, loading, error } = useVirtualBlockchainSearchStrategy(search);
    const isEmptyQuery = !search?.trim();
    if (isEmptyQuery) {
        return (
            <ResultCard title="Virtual Blockchain" icon={<HubIcon />} loading={false} empty emptyLabel="Type a VB id (hash) to search" />
        );
    }
    const content = value ? (
        <Stack spacing={1}>
            <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">VB ID</Typography>
                <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>{value.getVbId().encode()}</Typography>
            </Stack>
            <Button component={Link} href={routes.explorer.virtualBlockchain(value.getVbId().encode())} variant="contained" size="small">
                Open
            </Button>
        </Stack>
    ) : undefined;
    return (
        <ResultCard
            title="Virtual Blockchain"
            icon={<HubIcon />}
            loading={loading}
            error={error}
            empty={!value}
            emptyLabel="No virtual blockchain found"
        >
            {content}
        </ResultCard>
    );
}

function handleMicroBlockSearchResultDisplay(search: string) {
    const { value, loading, error } = useMicroBlockSearchStrategy(search);
    const isEmptyQuery = !search?.trim();
    if (isEmptyQuery) {
        return (
            <ResultCard title="Micro-block" icon={<GridViewIcon />} loading={false} empty emptyLabel="Type a micro-block hash to search" />
        );
    }
    const content = value ? (
        <Stack spacing={1}>
            <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Hash</Typography>
                <Typography variant="h6" sx={{ wordBreak: 'break-all' }}>{search}</Typography>
            </Stack>
            <Button component={Link} href={routes.explorer.microblock(search)} variant="contained" size="small">
                Open
            </Button>
        </Stack>
    ) : undefined;
    return (
        <ResultCard
            title="Micro-block"
            icon={<GridViewIcon /> }
            loading={loading}
            error={error}
            empty={!value}
            emptyLabel="No micro-block found"
        >
            {content}
        </ResultCard>
    );
}

function handleBlockResultDisplay(search: string) {
    const { value, loading, error } = useBlockSearchStrategy(search);
    const isEmptyQuery = !search?.trim();
    const foundBlocks = value;

    if (isEmptyQuery) {
        return (
            <ResultCard title="Block" icon={<LayersIcon />} loading={false} empty emptyLabel="Type a block height (number) to search" />
        );
    }

    let body: ReactNode = undefined;
    let empty = false;
    let emptyLabel = '';

    if (!foundBlocks || foundBlocks.length === 0) {
        empty = true;
        emptyLabel = 'No blocks found';
    } else if (foundBlocks.length !== 1) {
        empty = true;
        emptyLabel = 'Multiple blocks found';
    } else {
        const foundBlock = foundBlocks[0];
        body = (
            <Stack spacing={1}>
                <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">Height</Typography>
                    <Typography variant="h6">{foundBlock.getBlockHeight()}</Typography>
                </Stack>
                <Button component={Link} href={routes.explorer.block(foundBlock.getBlockHeight())} variant="contained" size="small">
                    Open
                </Button>
            </Stack>
        );
    }

    return (
        <ResultCard title="Block" icon={<LayersIcon />} loading={loading} error={error} empty={empty} emptyLabel={emptyLabel}>
            {body}
        </ResultCard>
    );
}

function handleAccountSearchDisplay(search: string) {
    const { value, loading, error } = useAccountSearchStrategy(search);
    const isEmptyQuery = !search?.trim();

    if (isEmptyQuery) {
        return (
            <ResultCard title="Account" icon={<AccountBalanceWalletIcon />} loading={false} empty emptyLabel="Paste a public key to see account balance" />
        );
    }


    let content;
    if (value) {
        const encoder = StringSignatureEncoder.defaultStringSignatureEncoder();
        const publicKey = encoder.encodePublicKey(value.publicKey);
        content = <Stack spacing={1}>
            <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Public key</Typography>
                <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{publicKey}</Typography>
            </Stack>
            <Stack spacing={0.5}>
                <Typography variant="body2" color="text.secondary">Balance</Typography>
                <Typography variant="h6">{value.balance.toString()}</Typography>
            </Stack>
            <Button component={Link} href={routes.accounts.byPublicKey(publicKey)} variant="contained" size="small">
                Open
            </Button>
        </Stack>
    } else {
        content = undefined;
    }

    return (
        <ResultCard
            title="Account"
            icon={<AccountBalanceWalletIcon /> }
            loading={loading}
            error={error}
            empty={!value}
            emptyLabel="No account found"
        >
            {content}
        </ResultCard>
    );
}

