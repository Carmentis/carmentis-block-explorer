'use client'


import {useParams} from "next/navigation";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {BlockchainQueryFabric, OracleDescription, OrganisationDescription} from '@cmts-dev/carmentis-sdk/client';
import useSWR from "swr";
import {useAtomValue} from "jotai/index";
import {networkAtom} from "@/atoms/network.atom";
import Skeleton from "react-loading-skeleton";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useState} from "react";
import {GenericTable} from "@/app/components/generic-table";
import {ErrorDisplay} from "@/app/components/error-display";
import {TableOfFields} from "@/app/applications/[hash]/tableOfFields";

const fetcher = async ( input: string[] ) =>  {
    console.assert(Array.isArray(input) && input.length === 3);
    console.assert(typeof input[2] === "string" );
    const hash = input[2];
    const vb = new sdk.blockchain.oracleVb(hash);
    await vb.load()
    const lastVersion = vb.getLatestVersionNumber();
    console.assert(typeof lastVersion == 'number')
    console.assert(lastVersion > 0);
    const organisationVb = await vb.getOrganizationVb();
    const desc = await vb.getDescriptionObject();
    const orgDesc = await organisationVb.getDescriptionObject();
    return {
        desc,
        orgDesc,
        lastVersion,
        vb
    }

}

export default function Oracle() {
    const network = useAtomValue(networkAtom);
    const client = BlockchainQueryFabric.build(network);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);

    // load the params
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const {data, isLoading, error} = useSWR(
        [ "getOracle", client, hash ], fetcher
    )


    if (error) return <ErrorDisplay error={error}/>
    if (!data || isLoading) return <Skeleton/>
    return <>
        <OracleDescriptionComponent
            description={data.desc}
            orgDesc={data.orgDesc}
        />
        <OracleVersions
            latestVersion={data.lastVersion}
            vb={data.vb}
        />
    </>

}


function OracleDescriptionComponent( input: { description: OracleDescription, orgDesc: OrganisationDescription } ) {
    const description = input.description;
    const items = [
        { label: "Name", value: description.getName() },
        { label: "Organisation", value: input.orgDesc.getName() },
    ]
    return (
        <Container>
            <Card sx={{  padding: 2, boxShadow: 3}}>
                <CardContent>
                    <Typography variant={"h5"}>{description.getName()}</Typography>
                    <Table>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left"
                                               sx={{fontWeight: 'bold'}}>{item.label}</TableCell>
                                    <TableCell align="left">{item.value}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Container>
    );
}


function OracleVersions({latestVersion, vb}: { latestVersion: number, vb: sdk.blockchain.oracleVb }) {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container sx={{ mt: 5}}>
            {Array.from({length: latestVersion}, (_, i) => (
                <Accordion
                    key={i}
                    expanded={expanded === `panel${i + 1}`}
                    onChange={handleChange(`panel${i + 1}`)}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon/>}
                        aria-controls={`panel${i + 1}-content`}
                        id={`panel${i + 1}-header`}
                    >
                        <Typography sx={{flexGrow: 1}}>{`Version ${i + 1}`}</Typography>
                        <Button variant="text">Expand</Button>
                    </AccordionSummary>
                    <AccordionDetails>
                        {expanded === `panel${i + 1}` && <SingleOracleVersion
                            vb={vb}
                            version={i+1}
                        />}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}


const singleOracleFetcher = async ( [, vb, version]: [string, sdk.blockchain.oracleVb, number] ) =>  {
    const definition = await vb.getDefinitionObject(version);
    return definition;
}

function SingleOracleVersion( {vb, version}: { vb: sdk.blockchain.oracleVb, version: number } ) {
    const {data, isLoading, error} = useSWR([ 'getOracleDefinition', vb, version ], singleOracleFetcher)
    if (isLoading) return <Skeleton/>
    if (!data || error) return <ErrorDisplay error={error}/>
    try {
        return <Box sx={{display: "flex", flexDirection: 'column', gap:4}}>
            <Box>
                <Typography sx={{fontWeight: "bold"}}>Services</Typography>
                {
                    data.getServices().map((s,i) => <Accordion key={i}>
                        <AccordionSummary>{s.getName()}</AccordionSummary>
                        <AccordionDetails>
                            <Typography variant={"h6"}>Request</Typography>
                            <TableOfFields fields={s.getRequest()}/>
                            <Typography variant={"h6"}>Answer</Typography>
                            <TableOfFields fields={s.getAnswer()}/>
                        </AccordionDetails>
                    </Accordion>)
                }
            </Box>

            <Box>
                <Typography sx={{fontWeight: "bold"}}>Structures</Typography>
                {
                    data.getStructures().map((struct,i) => <Accordion key={i}>
                        <AccordionSummary>{struct.getName()}</AccordionSummary>
                        <AccordionDetails>
                            <TableOfFields fields={struct.getProperties()}/>
                        </AccordionDetails>
                    </Accordion>)
                }
            </Box>


            <Box>
                <Typography sx={{fontWeight: "bold"}}>Enumerations</Typography>
                {
                    data.getEnumerations().map((e,i) => <Accordion key={i}>
                        <AccordionSummary>{e.getName()}</AccordionSummary>
                        <AccordionDetails>
                            {e.getValues().map((v,i) => <Chip key={i} label={v}/>)}
                        </AccordionDetails>
                    </Accordion>)
                }
            </Box>

            <Box>
                <Typography sx={{fontWeight: "bold"}}>Masks</Typography>
                <GenericTable
                    headers={[ 'Name', 'Regex', 'Substitution' ]}
                    rows={
                        data.getMasks().map((m) => {
                            return [
                                <Typography key={1}>{m.getName()}</Typography>,
                                <Typography key={2}>{m.getRegex()}</Typography>,
                                <Typography key={3}>{m.getSubstitution()}</Typography>,
                            ]
                        })
                    }
                />
            </Box>

        </Box>
    } catch (e) {
        return <ErrorDisplay error={e} />
    }
}

