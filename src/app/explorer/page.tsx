'use client'


import {PageTitle} from '@/app/components/pagetitle';
import {Table, TableBody, TableCell, TableHead, TableRow, TablePagination, Tooltip, Typography} from '@mui/material';
import { useState } from 'react';
import {BlockchainQuery, ChainStatus} from "@cmts-dev/carmentis-sdk/client";
import useSWR from "swr";
import Loading from "@/app/nodes/loading";
import {ErrorDisplay} from "@/app/components/error-display";
import useBlockchainQuery from "@/components/node.hook";
import Skeleton from "react-loading-skeleton";
import {useRouter} from "next/navigation";

const chainStatusFetcher = async ([, client]:[string, BlockchainQuery]) => {
    return await client.getChainStatus()
}


/**
 *
 * This functions render a navigation page system in which a user wants to see the
 * blocks in the master blockchain.
 *
 * @constructor
 */
export default function BlockchainExplorer() {
    const client = useBlockchainQuery()
    const {data, isLoading, error} = useSWR(['getChainStatus', client], chainStatusFetcher)

    if (isLoading) return <Loading/>
    if (!data || error) return <ErrorDisplay error={error}/>

    return (
        <>
            <PageTitle title={"Explorer"}></PageTitle>
            <div className="row">
                <div className="col-lg-0">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Blocks</h5>
                            <PaginatedTable chainStatus={data} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}





const PaginatedTable = ( {chainStatus}: {chainStatus: ChainStatus} ) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const chainLength = chainStatus.getLastBlockHeight();

    const rows = Array.from({ length: chainLength + 1 }, (_, i) => i)
        .reverse()
        .filter(i => i > 0);

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const header = ['Block', "Status", "Size", "Proposer", "Proposed At"]
    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        {
                            header.map((v,i) => <TableCell key={i}>{v}</TableCell>)
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((masterBlockHeight, index) => (
                        <LoadMasterBlockRow masterBlockHeight={masterBlockHeight} key={masterBlockHeight} colSpan={header.length}/>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

const masterBlockFetcher = async ([, client, height]: [string, BlockchainQuery, number]) => {
    return await client.getMasterBlock(height)
}

function LoadMasterBlockRow({masterBlockHeight, colSpan}: {masterBlockHeight: number, colSpan: number}) {
    const client = useBlockchainQuery()
    const router = useRouter();
    const {data, isLoading, error} = useSWR(['getMasterBlock', client, masterBlockHeight], masterBlockFetcher)

    let content;
    let link : string | undefined = undefined;
    if (isLoading) content= <TableCell colSpan={colSpan}><Skeleton/></TableCell>
    else if (!data || error) {
        content = <TableCell>
            <Tooltip title={error.message}>
                <Typography>Loading failure</Typography>
            </Tooltip>
        </TableCell>
    } else {
        link = `/explorer/masterblock/${data.getHeight()}`
        content = <>
            <TableCell>{data.getHeight()}</TableCell>
            <TableCell>{data.isAnchored() ? "Anchored" : "Running"}</TableCell>
            <TableCell>{data.getSize()}</TableCell>
            <TableCell>{data.getProposerNode()}</TableCell>
            <TableCell>{data.getProposedAt().toLocaleString()}</TableCell>
        </>
    }
    return <TableRow onClick={() => link && router.push(link)}>
        {content}
    </TableRow>
}
