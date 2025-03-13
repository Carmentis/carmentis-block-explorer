'use client'


import {useParams} from "next/navigation";
import * as sdk from '@cmts-dev/carmentis-sdk/client';
import {ApplicationDescription, OrganisationDescription} from '@cmts-dev/carmentis-sdk/client';
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
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string" );
    const hash = input[1];
    const vb = new sdk.blockchain.applicationVb(hash);
    await vb.load()
    const lastVersion = vb.getLatestVersionNumber()
    console.assert(typeof lastVersion == 'number')
    console.assert(lastVersion > 0);
    const organisationVb = await vb.getOrganizationVb();
    const desc = await vb.getDescriptionObject()
    const orgDesc = await organisationVb.getDescriptionObject();
    return {
        desc,
        orgDesc,
        lastVersion,
        vb
    }

}

export default function Application() {
    const network = useAtomValue(networkAtom);
    sdk.blockchain.blockchainQuery.setNode(network);
    sdk.blockchain.blockchainCore.setNode(network);

    // load the params
    const params = useParams<{hash: string}>();
    const hash = params.hash;
    const {data, isLoading, error} = useSWR(
        [ "getApplication", hash ], fetcher
    )


    if (error) return <ErrorDisplay error={error}/>
    if (!data || isLoading) return <Skeleton/>
    return <>
        <ApplicationDescriptionComponent
            description={data.desc}
            orgDesc={data.orgDesc}
        />
        <ApplicationVersions
            latestVersion={data.lastVersion}
            vb={data.vb}
        />
    </>

}


function ApplicationDescriptionComponent( input: { description: ApplicationDescription, orgDesc: OrganisationDescription } ) {
    const description = input.description;
    const items = [
        { label: "Name", value: description.getName() },
        { label: "Description", value: description.getDescription() },
        { label: "Website", value: description.getHomepageUrl() },
        { label: "Logo URL", value: description.getLogoUrl() },
        { label: "Root domain", value: description.getRootDomain() },
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

function ApplicationVersions({latestVersion, vb}: { latestVersion: number, vb: sdk.blockchain.applicationVb }) {
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
                        {expanded === `panel${i + 1}` && <SingleApplicationVersion
                            vb={vb}
                            version={i+1}
                        />}
                    </AccordionDetails>
                </Accordion>
            ))}
        </Container>
    );
}


const singleApplicationFetcher = async ( [, vb, version]: [string, sdk.blockchain.applicationVb, number] ) =>  {
    console.log("fetcher, app version:", version)
    const definition = await vb.getDefinitionObject(version);
    return definition;
}

function SingleApplicationVersion( {vb, version}: { vb: sdk.blockchain.applicationVb, version: number } ) {
    const {data, isLoading, error} = useSWR([ 'getApplicationDefinition', vb, version ] ,singleApplicationFetcher)
    if (isLoading) return <Skeleton/>
    if (!data || error) return <ErrorDisplay error={error}/>
    try {
        return <Box sx={{display: "flex", flexDirection: 'column', gap:4}}>
            <Box>
                <Typography sx={{fontWeight: "bold"}}>Fields</Typography>
                <TableOfFields fields={data.getFields()}/>
            </Box>

            <Box>
                <Typography sx={{fontWeight: "bold"}}>Structures</Typography>
                {
                    data.getInternalStructures().map((struct,i) => <Accordion key={i}>
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
                                <Typography key={0}>{m.getName()}</Typography>,
                                <Typography key={1}>{m.getRegex()}</Typography>,
                                <Typography key={2}>{m.getSubstitution()}</Typography>,
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


