'use client'


import {useParams} from "next/navigation";
import {
    ApplicationDescription,
    ApplicationWrapper,
    Hash, OrganizationWrapper,
    OrganizationDescription
} from '@cmts-dev/carmentis-sdk/client';
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import {Card, CardContent, Container, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {ErrorDisplay} from "@/app/components/error-display";
import {useBlockchain} from "@/app/layout";
import {useAsync} from "react-use";

/*
const fetcher = async ( input: string[] ) =>  {
    console.assert(Array.isArray(input) && input.length === 2);
    console.assert(typeof input[1] === "string" );
    const [hash] = Hash.from(input[1]);
    const blockchain = useBlockchain();
    const application = await blockchain.loadApplication([hash]);
    const description = await application.getDescription();
    const organisationId = await application.getOrganizationId();
    const organisation = await blockchain.loadOrganization(organisationId);
    const organisationDescription = await organisation.getDescription();
    const applicationDescription = await application.getDescription();
    return {
        appDesc: applicationDescription,
        orgDesc: organisationDescription,
    }

}*/

export default function Application() {
    // load the params
    const params = useParams<{hash: string}>();
    const hash = Hash.from(params.hash);
    const blockchain = useBlockchain();
    const {value: data, loading: isLoading, error} = useAsync(async () => {
        const application = await blockchain.loadApplication(hash);
        const organisationId = application.getOrganizationId();
        const organisation = await blockchain.loadOrganization(organisationId);
        return {organisation, application};
    });


    if (error) return <ErrorDisplay error={error}/>
    if (!data || isLoading) return <Skeleton/>
    return <>
        <ApplicationDescriptionComponent
            id={hash}
            application={data.application}
            organisation={data.organisation}
        />

    </>

}


function ApplicationDescriptionComponent({id, application, organisation}: { id: Hash, application: ApplicationWrapper, organisation: OrganizationWrapper } ) {

    const items = [
        { label: "Name", value: application.getName() },
        { label: "Id", value: id.encode() },
        { label: "Description", value: application.getDescription() },
        { label: "Website", value: application.getWebsite()},
        { label: "Logo URL", value: application.getLogoUrl() },
        { label: "Organisation", value: organisation.getName() },
    ]
    return (
        <Container>
            <Card sx={{  padding: 2, boxShadow: 3}}>
                <CardContent>
                    <Typography variant={"h5"}>{application.getName()}</Typography>
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