'use client'


import {useParams} from "next/navigation";
import {ApplicationDescription, Hash, OrganizationDescription} from '@cmts-dev/carmentis-sdk/client';
import useSWR from "swr";
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
import {useBlockchain} from "@/app/layout";

const fetcher = async ( input: string[] ) =>  {
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string" );
    const hash = Hash.from(input[1]);
    const blockchain = useBlockchain();
    const application = await blockchain.loadApplication(hash);
    const description = await application.getDescription();
    const organisationId = await application.getOrganizationId();
    const organisation = await blockchain.loadOrganization(organisationId);
    const organisationDescription = await organisation.getDescription();
    const applicationDescription = await application.getDescription();
    return {
        appDesc: applicationDescription,
        orgDesc: organisationDescription,
    }

}

export default function Application() {
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
            id={hash}
            description={data.appDesc}
            orgDesc={data.orgDesc}
        />

    </>

}


function ApplicationDescriptionComponent( input: { id: string, description: ApplicationDescription, orgDesc: OrganizationDescription } ) {
    const description = input.description;
    console.log("application description:", description)
    const items = [
        { label: "Name", value: description.name },
        { label: "Id", value: input.id },
        { label: "Description", value: description.description },
        { label: "Website", value: description.homepageUrl },
        { label: "Logo URL", value: description.logoUrl },
        { label: "Root domain", value: '--'},
        { label: "Organisation", value: input.orgDesc.name },
    ]
    return (
        <Container>
            <Card sx={{  padding: 2, boxShadow: 3}}>
                <CardContent>
                    <Typography variant={"h5"}>{input.description.name}</Typography>
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