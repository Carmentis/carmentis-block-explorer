'use client';

import {
    Box,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Chip,
    Link, Paper,
    Table, TableBody,
    TableCell, TableContainer,
    TableRow,
    Typography
} from "@mui/material";
import {Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator} from "@mui/lab";
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import React, {useState, useRef, useEffect} from "react";
import "react-toastify/dist/ReactToastify.css";
import {UploadFile} from "@mui/icons-material";
import {useAsync} from "react-use";
import {proofLoader, blockchain} from "@cmts-dev/carmentis-sdk/client";
import {ErrorBoundary} from "react-error-boundary";
import {useAtomValue} from "jotai";
import {networkAtom} from "@/atoms/network.atom";


export default function ProofChecker() {
    // load the NODE_URL env variable
    const nodeUrl = useAtomValue(networkAtom);
    blockchain.blockchainQuery.setNode(nodeUrl);
    blockchain.blockchainCore.setNode(nodeUrl)

    const [proof, setProof] = useState<Record<string, any> | undefined>();
    return <>
        <Breadcrumbs>
            <Typography>Explorer</Typography>
            <Typography>Proof checker</Typography>
        </Breadcrumbs>
        <ErrorBoundary fallbackRender={ProofCheckerFailure} >
            { proof ? <ProofViewer proof={proof} resetProof={() => setProof(undefined)}/> : <ProofCheckerUpload onUpload={proof => setProof(proof)} /> }
        </ErrorBoundary>
    </>
}



function ProofCheckerFailure({ error }: { error: Error }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                textAlign: "center",
                padding: 4,
            }}
        >
            <Box
                sx={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 3,
                }}
            >
                <Typography variant="h1" color="error">
                    😞
                </Typography>
            </Box>
            <Typography variant="h6" color="error" gutterBottom>
                Sorry, we cannot verify the proof.
            </Typography>
            <Typography variant="body1" sx={{marginBottom: 2}}>
                The proof might be malformed.
            </Typography>
        </Box>
    );
}



function ProofCheckerUpload( {onUpload }: { onUpload: (proof: any) => void }) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = JSON.parse(e.target?.result as string);
                    onUpload(content);
                } catch (error) {
                    console.error(error)
                    //toast.error("Invalid JSON file. Please upload a valid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="flex justify-center items-center h-[500px]">
            <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
            />
            <div
                className="flex justify-center items-center w-72 h-72 bg-white rounded-full cursor-pointer hover:bg-gray-300"
                onClick={() => fileInputRef.current?.click()}
            >
                <UploadFile scale={4}/>
            </div>
        </div>
    );
}

function ProofViewer({proof, resetProof}: {resetProof: () => void, proof: Record<string, any>}) {
    const state = useAsync(async () => {
        console.log(proof, typeof proof);
        let loader = new proofLoader(proof);
        try {
            const records = await loader.load();
            return { verified: true, records: records.records }
        } catch (error) {
            console.error(error)
            return { verified: false, records: undefined }
        }

    })

    if (state.loading) return <>Checking the proof...</>;
    if (state.error || !state.value) return <>Proof verification failure: {state.error?.message}</>
    const data = state.value;
    const header = proof.information;
    const appLedgerId = proof.proofData.appLedgerId;
    const rows = [
        { header: "Proof Verification Status", value: <Chip label={data.verified ? 'Succeed' : 'Failed'} color={data.verified ? 'success' : 'error'}/>  },
        { header: "Proof Title", value: header.title },
        { header: "Proof export time", value: header.exportTime },
        { header: "Virtual Blockchain Id", value: <Link href={`/explorer/virtualBlockchain/${appLedgerId}`} target={"_blank"}>{appLedgerId}</Link> },
        { header: "Application", value: header.application },
        { header: "Operator", value: header.applicationOperator },
    ]
    return <>
        <Box sx={{my: 4}}>
            <Button variant={"contained"} onClick={() => resetProof()}>Verify another proof</Button>
        </Box>
        <Card>
            <CardContent>
                <Table>
                    {rows.map((value, index) =>
                        <TableRow key={index}>
                            <TableCell>{value.header}</TableCell>
                            <TableCell>{value.value}</TableCell>
                        </TableRow>
                    )}
                </Table>
                { data.records && <ProofRecordViewer records={data.records} /> }
            </CardContent>
        </Card>
    </>
}


function ProofRecordViewer( {records}: {records: {height: number, record: Record<string, any>}[] } ) {

    const content = []
    for (let i = 0; i < records.length; i++) {
        const record = records[i];
        content.push( <Card>
            <CardContent>
                <Typography variant={"h6"}>Block {record.height}</Typography>
                <BlockViewer initialPath={[]} data={record.record}/>
            </CardContent>
        </Card>)
    }
    return <>
        <Typography variant={"h6"} className={"mt-4"}>Proof Data Visualisation</Typography>
        <Timeline
            sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                },
            }}
        >
            {content.map((item,i) => {
                return  <TimelineItem key={i}>
                    <TimelineSeparator>
                        <TimelineDot />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        {item}
                    </TimelineContent>
                </TimelineItem>
            })}
        </Timeline>
    </>
}

function BlockViewer({data, initialPath}: {data: Record<string, any>, initialPath: string[]}) {
    const [path, setPath] = useState(initialPath)
    const [shownData, setShowData] = useState(data);

    useEffect(() => {
        // compute the shown data
        let shownData = data;
        for ( const token of path ) {
            shownData = shownData[token]
        }
        setShowData(shownData);
    }, [path, setShowData]);



    const rowEntryClass = 'w-full first:rounded-t last:rounded-b border-b-2 border-gray-50'
    function renderEntry(index: number, key: string, value: any) {
        let content;
        const isArrayOfStrings = Array.isArray(value) && value.every(v => typeof v === 'string')
        if (typeof value === 'string' || typeof value === 'number' || isArrayOfStrings) {
            content = <>
                <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                <td className={"p-1"}>{isArrayOfStrings ? value.join(', ') : value}</td>
            </>
        } else {
            // check if supported
            const isArray = Array.isArray(value);
            const isObject = typeof value === 'object';
            const isDate = value instanceof Date;
            if (!isArray && isObject) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500 hover:cursor-pointer"} onClick={() => setPath(p => {
                        console.log("Accessing path:", p, key)
                        return [...p, key];
                    })}>See more
                    </td>
                </>
            } else if (isDate) {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>{new Date(value).toLocaleString()}</td>
                </>
            } else {
                content = <>
                    <td className={"p-1 border-gray-50 border-r-2"}>{key}</td>
                    <td className={"p-1 text-gray-500"}>Cannot expand</td>
                </>
            }

        }
        return <TableRow key={index} className={rowEntryClass}>
            {content}
        </TableRow>
    }


    function backPath() {
        path.pop();
        return setPath([...path])
    }

    function renderPreviousPath() {
        if (path.length == 0) return
        return <TableRow className={rowEntryClass}>
            <td onClick={() => backPath()}>Back
            </td>
        </TableRow>
    }

    function renderRecord() {
        const previousPath = renderPreviousPath();
        const content = Object.entries(shownData).map(([key, value], i) => renderEntry(i, key, value))
        return <>
            <TableContainer >
                <Table component={Paper} elevation={1}>
                    <TableBody>
                        {previousPath}
                        {content}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    }



    return <>{renderRecord()}</>
}


