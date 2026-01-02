'use client';

import {useState} from 'react';
import {PageTitle} from '@/app/components/pagetitle';
import {Box, Card, CardContent, CardHeader, Divider, Grid2 as Grid, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, Typography, Avatar} from "@mui/material";
import Paper from "@mui/material/Paper";
import BlockSizeHistory from "@/components/block-size-history";
import useLatestBlockHeight from "@/hooks/useLatestBlockHeight";
import {useAsync} from "react-use";
import { useAtomValue } from 'jotai';
import { networkAtom } from '@/atoms/network.atom';
import { useRouter } from 'next/navigation';
import LayersIcon from "@mui/icons-material/Layers";
import { routes } from '@/app/routes';
import {useBlockchain} from "@/app/layout";
import {Hash} from '@cmts-dev/carmentis-sdk/client';

export default function Home() {
    return (
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>
            <PageTitle title={"Dashboard"} />
            <Grid container spacing={2}>
                <Grid size={{ lg: 12, md: 12 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardHeader
                            avatar={<Avatar variant="rounded" sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}><LayersIcon /></Avatar>}
                            title={<Typography variant="subtitle1" fontWeight={700}>Latest blocks</Typography>}
                        />
                        <Divider />
                        <CardContent>
                            <LatestBlocks />
                        </CardContent>
                    </Card>
                </Grid>
                {/*
                <Grid size={{ lg: 5, md: 12 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <CardHeader
                            avatar={<Avatar variant="rounded" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText' }}><GridViewIcon /></Avatar>}
                            title={<Typography variant="subtitle1" fontWeight={700}>Micro-blocks per block</Typography>}
                        />
                        <Divider />
                        <CardContent>
                            <BlockSizeHistory />
                        </CardContent>
                    </Card>
                </Grid>
                */}
            </Grid>
        </Box>
    );
}

function LatestBlocks() {
    const limit = 10;
    const { lastBlockHeight: lastBlock, loading } = useLatestBlockHeight();

    if (loading || lastBlock.isNone()) {
        return (
            <Table component={Paper}>
                <TableHead>
                    <TableRow>
                        <TableCell>Height</TableCell>
                        <TableCell>Block hash</TableCell>
                        <TableCell>Anchored at</TableCell>
                        <TableCell>Micro-blocks</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton width={60} /></TableCell>
                            <TableCell><Skeleton width={200} /></TableCell>
                            <TableCell><Skeleton width={160} /></TableCell>
                            <TableCell><Skeleton width={40} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    const entries: JSX.Element[] = [];
    const lastBlockHeight = lastBlock.unwrap();
    const start = Math.max(lastBlockHeight - limit + 1, 1);
    const end = lastBlockHeight;
    for (let i = end; i >= start; i--) {
        entries.push(<RowTable key={i} height={i} />);
    }

    return (
        <Table component={Paper}>
            <TableHead>
                <TableRow>
                    <TableCell>Height</TableCell>
                    <TableCell>Block hash</TableCell>
                    <TableCell>Anchored at</TableCell>
                    <TableCell>Micro-blocks</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {entries}
            </TableBody>
        </Table>
    );
}

function RowTable({ height }: { height: number }) {
    const navigation = useRouter();
    const blockchain = useBlockchain();
    const [numberOfMicroblocks, setNumberOfMicroblocks] = useState("--");
    const [anchoredAt, setAnchoredAt] = useState("--");
    const [blockHash, setBlockHash] = useState("--");

    const state =useAsync(async () => {
        const info = await blockchain.getBlockInformation(height);
        const content = await blockchain.getBlockContent(height);

        setBlockHash(Hash.from(info.hash).encode());
        setNumberOfMicroblocks(content.microblocks.length.toString());
        setAnchoredAt(new Date(info.timestamp * 1000).toLocaleString());

    }, [ height]);

    console.log("error:", state)

    function goToBlock() {
        navigation.push(routes.explorer.block(height));
    }

    return (
        <TableRow hover onClick={goToBlock} sx={{ cursor: 'pointer' }}>
            <TableCell>{height}</TableCell>
            <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{blockHash}</TableCell>
            <TableCell>{anchoredAt}</TableCell>
            <TableCell>{numberOfMicroblocks}</TableCell>
        </TableRow>
    );
}

